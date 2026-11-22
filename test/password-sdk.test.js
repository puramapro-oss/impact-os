// @vitest-environment jsdom
import { AuthClient } from '@supabase/supabase-js';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createPasswordClient } from '../src/lib/supabase';
import { createPasswordSecurity } from '../src/lib/passwordSecurity';

// Real SDK, local HTTP responses only. No account, token signature or live
// provider configuration is validated by these protocol and isolation tests.
const credentials = { currentPassword: 'Fixture-old-1', password: 'Fixture-new-2', confirmation: 'Fixture-new-2' };
let security, user, captured, current, wire, onUpdate, backgroundClients;
function token(id = 'account-a', sessionId = 'session-a', expires = Math.floor(Date.now() / 1000) + 3600) {
  const encode = value => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: id, session_id: sessionId, aal: 'aal1', exp: expires })}.${btoa('fixture-signature').replace(/=/g, '')}`;
}
function response(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: {
    'Content-Type': 'application/json', 'X-Supabase-Api-Version': '2024-01-01',
  } });
}
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('BroadcastChannel', undefined);
  user = { id: 'account-a', email: 'fixture@example.test', factors: [] };
  captured = { user, access_token: token(), refresh_token: 'fixture-refresh-a' };
  current = captured;
  backgroundClients = []; wire = []; onUpdate = async () => response(user);
  vi.stubGlobal('fetch', vi.fn(async (url, init) => {
    const path = new URL(url).pathname;
    const method = init?.method || 'GET';
    wire.push({ path, method, authorization: new Headers(init?.headers).get('authorization'), body: init?.body && JSON.parse(init.body) });
    if (path.endsWith('/user') && method === 'GET') return response(user);
    if (path.endsWith('/user') && method === 'PUT') return onUpdate();
    if (path.endsWith('/reauthenticate') && method === 'GET') return response({});
    throw new Error(`Unexpected fixture endpoint: ${method} ${path}`);
  }));
  security = createPasswordSecurity({ session: captured, getCurrentSession: () => current, createClient: createPasswordClient, userId: user.id });
});
afterEach(async () => {
  security.dispose();
  for (const client of backgroundClients) await client.stopAutoRefresh();
  localStorage.clear(); vi.restoreAllMocks(); vi.unstubAllGlobals();
});

test('le SDK réel envoie le changement sur la session capturée, sans stockage ou journaux applicatifs', async () => {
  const storage = vi.spyOn(Storage.prototype, 'setItem');
  const log = vi.spyOn(console, 'log'), warn = vi.spyOn(console, 'warn'), error = vi.spyOn(console, 'error');
  await expect(security.changePassword(credentials)).resolves.toEqual({ changed: true });
  const update = wire.filter(item => item.method === 'PUT');
  expect(update).toHaveLength(1);
  expect(update[0].body).toMatchObject({ current_password: credentials.currentPassword, password: credentials.password });
  expect(wire.every(item => item.authorization === `Bearer ${captured.access_token}`)).toBe(true);
  expect(wire.filter(item => item.method === 'GET')).toHaveLength(1);
  expect(storage).not.toHaveBeenCalled(); expect(log).not.toHaveBeenCalled(); expect(warn).not.toHaveBeenCalled(); expect(error).not.toHaveBeenCalled();
});

test('le SDK réel transmet la réauthentification et le nonce avec le contrat du fournisseur', async () => {
  onUpdate = async () => response({ code: 'reauthentication_needed', message: 'Confirmation required' }, 400);
  await expect(security.changePassword(credentials)).resolves.toEqual({ needsNonce: true, invalidNonce: false });
  await security.requestCode();
  expect(wire.filter(item => item.path.endsWith('/reauthenticate'))).toHaveLength(1);
  onUpdate = async () => response(user);
  await expect(security.changePassword({ ...credentials, nonce: '123456' })).resolves.toEqual({ changed: true });
  expect(wire.filter(item => item.method === 'PUT').at(-1).body.nonce).toBe('123456');
});

test('un jeton expiré ne déclenche ni rotation du jeton partagé ni répétition réseau', async () => {
  security.dispose();
  const expired = { ...captured, access_token: token('account-a', 'session-a', Math.floor(Date.now() / 1000) - 60) };
  current = expired;
  security = createPasswordSecurity({ session: expired, getCurrentSession: () => current, createClient: createPasswordClient, userId: user.id });
  await expect(security.changePassword(credentials)).rejects.toThrow(/session ne peut pas être vérifiée/);
  expect(fetch).not.toHaveBeenCalled();
});

test('une erreur session_not_found tardive de A ne déconnecte pas B dans le client partagé réel', async () => {
  const userB = { id: 'account-b', email: 'other@example.test' };
  const tokenB = token('account-b', 'session-b');
  let completeA;
  fetch.mockImplementation(async (_url, init) => {
    const authorization = new Headers(init.headers).get('authorization');
    if (authorization === `Bearer ${captured.access_token}`) return new Promise(resolve => { completeA = resolve; });
    if (authorization === `Bearer ${tokenB}`) return response(userB);
    throw new Error('Unexpected fixture session');
  });
  const main = new AuthClient({
    url: 'https://auth.example.test/auth/v1', headers: { apikey: 'fixture-public-key' },
    storageKey: 'fixture-main-client', persistSession: true, autoRefreshToken: false, detectSessionInUrl: false,
    fetch: (input, init) => fetch(input, init),
  });
  backgroundClients.push(main);
  const result = security.status().then(value => ({ value }), error => ({ error }));
  await vi.waitFor(() => expect(completeA).toBeTypeOf('function'));
  const signedIn = await main.setSession({ access_token: tokenB, refresh_token: 'fixture-refresh-b' });
  expect(signedIn.data.user.id).toBe('account-b');
  // Deliberately keep the controller's snapshot unchanged here so the SDK
  // handles the A error even without help from the UI lifecycle guard.
  completeA(response({ code: 'session_not_found', message: 'Session missing' }, 401));
  expect((await result).error?.message).toMatch(/session ne peut pas être vérifiée/);
  const next = await main.getSession();
  expect(next.data.session.user.id).toBe('account-b');
  expect(next.data.session.access_token).toBe(tokenB);
  expect(JSON.parse(localStorage.getItem('fixture-main-client')).user.id).toBe('account-b');
});

test('l’écouteur du SDK est retiré après initialisation, même après un démontage précoce', async () => {
  let complete;
  fetch.mockImplementation(() => new Promise(resolve => { complete = resolve; }));
  const add = vi.spyOn(window, 'addEventListener');
  const remove = vi.spyOn(window, 'removeEventListener');
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  const result = security.status().then(value => ({ value }), error => ({ error }));
  await vi.waitFor(() => expect(complete).toBeTypeOf('function'));
  security.dispose();
  complete(response(user));
  expect((await result).error?.message).toMatch(/session a changé/);
  expect(add.mock.calls.some(([event]) => event === 'visibilitychange')).toBe(true);
  for (const [event, listener] of add.mock.calls.filter(([event]) => event === 'visibilitychange')) {
    expect(remove.mock.calls.some(([removedEvent, removedListener]) => removedEvent === event && removedListener === listener)).toBe(true);
  }
  expect(error.mock.calls.flat().map(String).join(' ')).not.toContain(credentials.password);
});
