// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import AccountSecurity from '../src/components/security/AccountSecurity';
import Parametres from '../src/pages/Parametres';
import { createPasswordSecurity } from '../src/lib/passwordSecurity';

const { auth, client, createPasswordClient, account, addToast } = vi.hoisted(() => ({
  auth: { getSession: vi.fn(), getUser: vi.fn(), onAuthStateChange: vi.fn(), updateUser: vi.fn(), setSession: vi.fn() },
  client: { setSession: vi.fn(), getUser: vi.fn(), updateUser: vi.fn(), reauthenticate: vi.fn(), stopAutoRefresh: vi.fn() },
  createPasswordClient: vi.fn(), account: { user: null, session: null, getCurrentSession: vi.fn() }, addToast: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({ supabase: { auth }, createPasswordClient }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => account }));
vi.mock('../src/contexts/ToastContext', () => ({ useToast: () => ({ addToast }) }));

function session(id = 'account-a', sessionId = 'session-a') {
  const encode = data => btoa(JSON.stringify(data)).replace(/=/g, '');
  return {
    access_token: `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: id, session_id: sessionId, exp: Math.floor(Date.now() / 1000) + 3600 })}.fixture`,
    refresh_token: `fixture-refresh-${id}`, user: { id, factors: [] },
  };
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const valid = { currentPassword: 'Previous-password-1', password: 'Next-password-2', confirmation: 'Next-password-2', nonce: '' };
let container, root, listeners, controllers, initial, request;
const button = text => [...container.querySelectorAll('button')].find(node => node.textContent.trim() === text);
const enter = (id, value) => act(() => {
  const input = container.querySelector(`#${id}`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
const show = async (page = <AccountSecurity />) => { await act(async () => root.render(<MemoryRouter>{page}</MemoryRouter>)); };
const emit = (_event, next) => {
  account.user = next?.user || null; account.session = next;
  root.render(<MemoryRouter><AccountSecurity /></MemoryRouter>);
};
function makeController() {
  const controller = createPasswordSecurity({ session: initial, getCurrentSession: account.getCurrentSession, createClient: createPasswordClient, userId: initial.user.id });
  controllers.push(controller);
  return controller;
}
async function passwordForm() {
  await show();
  act(() => button('Changer le mot de passe').click());
  enter('security-current-password', valid.currentPassword);
  enter('security-new-password', valid.password);
  enter('security-confirm-password', valid.confirmation);
  return container.querySelector('form');
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  account.getCurrentSession.mockImplementation(() => account.session);
  initial = session(); account.user = initial.user; account.session = initial; listeners = new Set(); controllers = [];
  auth.getSession.mockResolvedValue({ data: { session: initial }, error: null });
  auth.getUser.mockResolvedValue({ data: { user: initial.user }, error: null });
  auth.onAuthStateChange.mockImplementation(listener => {
    listeners.add(listener);
    return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
  });
  client.stopAutoRefresh.mockResolvedValue();
  client.setSession.mockResolvedValue({ data: { session: initial }, error: null });
  client.getUser.mockResolvedValue({ data: { user: initial.user }, error: null });
  client.updateUser.mockResolvedValue({ data: { user: initial.user }, error: null });
  client.reauthenticate.mockResolvedValue({ data: { user: null, session: null }, error: null });
  createPasswordClient.mockImplementation(fetch => { request = fetch; return client; });
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  for (const controller of controllers) controller.dispose();
  container.remove(); vi.unstubAllGlobals(); vi.restoreAllMocks();
});

test('un compte vérifié peut ouvrir le formulaire dans les paramètres', async () => {
  await show(<Parametres />);
  await act(async () => button('Sécurité').click());
  expect(button('Changer le mot de passe').disabled).toBe(false);
  act(() => button('Changer le mot de passe').click());
  expect(container.querySelector('#security-current-password')).not.toBeNull();
  expect(auth.getUser).not.toHaveBeenCalled();
  expect(auth.getSession).not.toHaveBeenCalled();
  expect(client.setSession).toHaveBeenCalledWith({ access_token: initial.access_token, refresh_token: initial.refresh_token });
  expect(container.querySelector('#security-session-timeout').disabled).toBe(true);
  expect(container.querySelector('[aria-label="Authentification 2FA"]').disabled).toBe(true);
});

test('aucun compte : aucune lecture ni écriture Auth et aucun formulaire', async () => {
  account.user = null;
  await show();
  expect(auth.getSession).not.toHaveBeenCalled();
  expect(createPasswordClient).not.toHaveBeenCalled();
  expect(button('Changer le mot de passe').disabled).toBe(true);
  expect(container.querySelector('form')).toBeNull();
});

test('une vérification fournisseur refusée garde le formulaire fermé et permet de réessayer', async () => {
  client.setSession.mockResolvedValueOnce({ data: { session: null }, error: { message: 'expired' } });
  await show();
  expect(button('Changer le mot de passe').disabled).toBe(true);
  expect(client.stopAutoRefresh).toHaveBeenCalled();
  await act(async () => button('Actualiser les réglages').click());
  expect(button('Changer le mot de passe').disabled).toBe(false);
});

test('la lecture MFA distingue les facteurs TOTP vérifiés des autres facteurs et de la politique serveur', async () => {
  client.setSession.mockResolvedValue({ data: { session: { ...initial, user: { ...initial.user, factors: [
    { id: 'one', factor_type: 'totp', status: 'verified' },
    { id: 'two', factor_type: 'totp', status: 'unverified' },
    { id: 'three', factor_type: 'phone', status: 'verified' },
  ] } } }, error: null });
  await show();
  expect(container.textContent).toContain('Applications TOTP vérifiées sur ce compte : 1.');
  expect(container.textContent).toContain('ne confirme pas les règles d’accès du serveur');
});

test('les champs invalides ne déclenchent aucune écriture', async () => {
  const form = await passwordForm();
  enter('security-confirm-password', 'different');
  await act(async () => form.requestSubmit());
  expect(client.updateUser).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/identiques/);
});

test('un double envoi produit une seule écriture isolée puis efface les secrets', async () => {
  const pending = deferred(); client.updateUser.mockReturnValueOnce(pending.promise);
  const form = await passwordForm();
  await act(async () => { form.requestSubmit(); form.requestSubmit(); });
  expect(client.updateUser).toHaveBeenCalledTimes(1);
  expect(client.updateUser).toHaveBeenCalledWith({ current_password: valid.currentPassword, password: valid.password });
  expect(auth.updateUser).not.toHaveBeenCalled();
  expect(auth.setSession).not.toHaveBeenCalled();
  await act(async () => pending.resolve({ data: { user: initial.user }, error: null }));
  expect(container.textContent).toContain('a confirmé le changement');
  expect(container.querySelector('input[type="password"]')).toBeNull();
  act(() => button('Changer le mot de passe').click());
  expect([...container.querySelectorAll('input')].every(input => input.value === '')).toBe(true);
});

test.each([
  ['réponse vide', undefined],
  ['mauvais compte', { data: { user: { id: 'another-account' } }, error: null }],
  ['refus fournisseur', { data: null, error: { message: valid.password } }],
])('%s : aucun faux succès et aucune donnée sensible dans le message', async (_name, response) => {
  client.updateUser.mockResolvedValueOnce(response);
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  expect(container.textContent).toContain('Résultat non confirmé');
  expect(container.textContent).not.toContain('a confirmé le changement');
  expect(container.textContent).not.toContain(valid.password);
});

test('une erreur réseau permet un nouvel essai sans exposer son contenu', async () => {
  client.updateUser.mockRejectedValueOnce(new Error(valid.password));
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  expect(container.textContent).not.toContain(valid.password);
  expect(form.querySelector('fieldset').disabled).toBe(false);
  await act(async () => form.requestSubmit());
  expect(container.textContent).toContain('a confirmé le changement');
});

test('le nonce demandé par le serveur est envoyé seulement après confirmation et peut être refusé puis remplacé', async () => {
  client.updateUser.mockResolvedValueOnce({ data: null, error: { code: 'reauthentication_needed' } });
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  expect(client.reauthenticate).not.toHaveBeenCalled();
  await act(async () => button('Envoyer un code de confirmation').click());
  expect(client.reauthenticate).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('demande de code a été acceptée');
  client.updateUser.mockResolvedValueOnce({ data: null, error: { code: 'reauthentication_not_valid' } });
  enter('security-password-code', '123456');
  await act(async () => form.requestSubmit());
  expect(container.textContent).toContain('Code refusé ou expiré');
  expect(container.querySelector('#security-password-code').value).toBe('');
  expect(client.updateUser).toHaveBeenLastCalledWith({ current_password: valid.currentPassword, password: valid.password, nonce: '123456' });
  enter('security-password-code', '654321');
  await act(async () => form.requestSubmit());
  expect(container.textContent).toContain('a confirmé le changement');
});

test('une demande de code refusée ne prétend pas avoir envoyé un code', async () => {
  client.updateUser.mockResolvedValueOnce({ data: null, error: { code: 'reauthentication_needed' } });
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  client.reauthenticate.mockResolvedValueOnce({ error: { message: 'refused' } });
  await act(async () => button('Envoyer un code de confirmation').click());
  expect(container.textContent).toContain('Résultat non confirmé');
  expect(container.textContent).not.toContain('demande de code a été acceptée');
});

test('une déconnexion pendant une écriture efface le formulaire et ignore la réponse tardive', async () => {
  const pending = deferred(); client.updateUser.mockReturnValueOnce(pending.promise);
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  act(() => emit('SIGNED_OUT', null));
  expect(container.querySelector('input[type="password"]')).toBeNull();
  await act(async () => pending.resolve({ data: { user: initial.user }, error: null }));
  expect(container.textContent).not.toContain('a confirmé le changement');
  expect(button('Changer le mot de passe').disabled).toBe(true);
});

test('le passage à un autre compte ne réutilise ni champs ni réponse du compte précédent', async () => {
  const pending = deferred(); client.updateUser.mockReturnValueOnce(pending.promise);
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  const next = session('account-b', 'session-b');
  account.user = next.user; account.session = next;
  auth.getSession.mockResolvedValue({ data: { session: next }, error: null });
  auth.getUser.mockResolvedValue({ data: { user: next.user }, error: null });
  client.setSession.mockResolvedValue({ data: { session: next }, error: null });
  client.getUser.mockResolvedValue({ data: { user: next.user }, error: null });
  await show();
  await act(async () => pending.resolve({ data: { user: initial.user }, error: null }));
  expect(container.textContent).not.toContain('a confirmé le changement');
  act(() => button('Changer le mot de passe').click());
  expect([...container.querySelectorAll('input')].every(input => input.value === '')).toBe(true);
});

test('un démontage pendant la vérification initiale empêche la création du client et toute écriture', async () => {
  const pending = deferred(); client.setSession.mockReturnValueOnce(pending.promise);
  await show();
  await act(async () => root.unmount()); root = null;
  await act(async () => pending.resolve({ data: { session: initial }, error: null }));
  expect(client.stopAutoRefresh).toHaveBeenCalled();
  expect(client.updateUser).not.toHaveBeenCalled();
  expect(listeners.size).toBe(0);
});

test('un démontage après l’envoi ne provoque aucune navigation, session partagée ou confirmation tardive', async () => {
  const pending = deferred(); client.updateUser.mockReturnValueOnce(pending.promise);
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  await act(async () => root.unmount()); root = null;
  await act(async () => pending.resolve({ data: { user: initial.user }, error: null }));
  expect(container.textContent).toBe('');
  expect(auth.setSession).not.toHaveBeenCalled();
  expect(listeners.size).toBe(0);
});

test('aucun mot de passe ou nonce n’est écrit dans les stockages ou journaux applicatifs', async () => {
  const write = vi.spyOn(Storage.prototype, 'setItem');
  const log = vi.spyOn(console, 'log'), warn = vi.spyOn(console, 'warn'), error = vi.spyOn(console, 'error');
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  expect(write).not.toHaveBeenCalled(); expect(log).not.toHaveBeenCalled(); expect(warn).not.toHaveBeenCalled(); expect(error).not.toHaveBeenCalled();
});

test('un démontage avant la vérification du jeton empêche toute écriture', async () => {
  const pending = deferred(); client.setSession.mockReturnValueOnce(pending.promise);
  const security = makeController();
  const result = security.changePassword(valid);
  security.dispose();
  pending.resolve({ data: { session: initial }, error: null });
  await expect(result).rejects.toThrow(/session a changé/);
  expect(client.updateUser).not.toHaveBeenCalled();
  expect(client.stopAutoRefresh).toHaveBeenCalled();
});

test('le compte courant change avant le prochain rendu : aucune écriture de A ne commence', async () => {
  const pending = deferred(); client.setSession.mockReturnValueOnce(pending.promise);
  const security = makeController();
  const result = security.changePassword(valid).then(value => ({ value }), error => ({ error }));
  // AuthProvider updates its synchronous snapshot in the existing auth callback,
  // before React commits the new account or unmounts the old settings view.
  account.session = session('account-b', 'session-b');
  pending.resolve({ data: { session: initial }, error: null });
  expect((await result).error?.message).toMatch(/session a changé/);
  expect(client.updateUser).not.toHaveBeenCalled();
  expect(auth.getUser).not.toHaveBeenCalled();
  expect(auth.getSession).not.toHaveBeenCalled();
  expect(auth.onAuthStateChange).not.toHaveBeenCalled();
});

test('une nouvelle session du même compte recrée la vue et ignore son ancienne réponse', async () => {
  const pending = deferred(); client.updateUser.mockReturnValueOnce(pending.promise);
  const form = await passwordForm();
  await act(async () => form.requestSubmit());
  const next = session('account-a', 'new-session');
  client.setSession.mockResolvedValue({ data: { session: next }, error: null });
  await act(async () => emit('SIGNED_IN', next));
  await act(async () => pending.resolve({ data: { user: initial.user }, error: null }));
  expect(container.textContent).not.toContain('a confirmé le changement');
  expect(container.querySelector('input[type="password"]')).toBeNull();
});

test('le transport refuse un autre compte et tout rafraîchissement de jeton partagé', async () => {
  const security = makeController(); await security.status();
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  await expect(request('https://auth.example.test/auth/v1/user', {
    method: 'PUT', headers: { Authorization: `Bearer ${session('account-b', 'session-b').access_token}` },
  })).rejects.toThrow(/session a changé/);
  const refused = await request('https://auth.example.test/auth/v1/token?grant_type=refresh_token', { method: 'POST' });
  expect(refused.status).toBe(401);
  expect(fetch).not.toHaveBeenCalled();
});

test('le transport interrompt une réponse tardive avant son retour au SDK isolé', async () => {
  const security = makeController(); await security.status();
  const pending = deferred(); vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending.promise));
  const result = request('https://auth.example.test/auth/v1/user', { method: 'PUT', headers: { Authorization: `Bearer ${initial.access_token}` } });
  security.dispose(); pending.resolve(new Response('{}'));
  await expect(result).rejects.toThrow(/session a changé/);
});
