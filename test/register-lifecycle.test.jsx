// @vitest-environment jsdom
import { act, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Register from '../src/pages/Register';

const { signUp } = vi.hoisted(() => ({ signUp: vi.fn() }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ signUp }) }));

let root, container;
const sessionResult = { data: { session: { user: { id: 'fixture' } } }, error: null };
const confirmedResult = { data: { session: null, user: { id: 'fixture' } }, error: null };
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};
const enter = (input, value) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
const submit = () => container.querySelector('form').dispatchEvent(new Event('submit', {
  bubbles: true, cancelable: true,
}));

function LoginFixture() {
  const navigate = useNavigate();
  return <><h1>Login fixture</h1><button onClick={() => navigate('/')}>Réouvrir l'inscription</button></>;
}

function show(strict = false) {
  const app = <MemoryRouter><Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<LoginFixture />} />
    <Route path="/dashboard" element={<h1>Dashboard fixture</h1>} />
  </Routes></MemoryRouter>;
  act(() => root.render(strict ? <StrictMode>{app}</StrictMode> : app));
}

function fill(email = 'camille@example.test') {
  for (const [name, value] of Object.entries({
    prenom: 'Camille', nom: 'Durand', email, organisation: 'Organisation test',
    password: ' Example1234 ', confirmPassword: ' Example1234 ',
  })) enter(container.querySelector(`[name="${name}"]`), value);
  act(() => container.querySelector('[type=checkbox]').click());
}

function leave() {
  const login = [...container.querySelectorAll('span')].find(node => node.textContent === 'Se connecter');
  act(() => login.click());
  expect(container.querySelector('h1').textContent).toBe('Login fixture');
}

beforeEach(() => {
  signUp.mockReset();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount()); container.remove(); vi.unstubAllGlobals();
});

test('deux soumissions rapprochées gardent une seule inscription et le contrat original', async () => {
  show(); fill('  camille@example.test  ');
  const request = deferred(); signUp.mockReturnValue(request.promise);
  act(() => { submit(); submit(); });
  const requests = signUp.mock.calls.length;
  expect(container.querySelector('[type=submit]').disabled).toBe(true);
  await act(async () => request.resolve(sessionResult));
  expect(requests).toBe(1);
  expect(signUp).toHaveBeenCalledWith('camille@example.test', ' Example1234 ', {
    prenom: 'Camille', nom: 'Durand', organisation: 'Organisation test',
  });
  expect(container.querySelector('h1').textContent).toBe('Dashboard fixture');
});

test('une réponse tardive respecte le départ vers la connexion', async () => {
  show(); fill();
  const request = deferred(); signUp.mockReturnValue(request.promise);
  act(submit); leave();
  await act(async () => request.resolve(sessionResult));
  expect(container.querySelector('h1').textContent).toBe('Login fixture');
});

test('un rejet après le départ reste géré sans modifier la nouvelle page', async () => {
  show(); fill();
  const request = deferred(); signUp.mockReturnValue(request.promise);
  act(submit); leave();
  await act(async () => request.reject(new Error('offline')));
  expect(container.querySelector('h1').textContent).toBe('Login fixture');
  expect(container.querySelector('[role=alert]')).toBeNull();
});

test.each(['success', 'error'])('le remontage isole une ancienne réponse %s du nouvel envoi', async outcome => {
  show(); fill();
  const oldRequest = deferred(); const newRequest = deferred();
  signUp.mockReturnValueOnce(oldRequest.promise).mockReturnValueOnce(newRequest.promise);
  act(submit); leave();
  act(() => container.querySelector('button').click());
  fill('second@example.test'); act(submit);
  expect(signUp).toHaveBeenCalledTimes(2);
  await act(async () => {
    if (outcome === 'success') oldRequest.resolve(sessionResult);
    else oldRequest.reject(new Error('previous request failed'));
  });
  expect(container.querySelector('h1').textContent).toBe('Créer un compte');
  expect(container.querySelector('[name=email]').value).toBe('second@example.test');
  expect(container.querySelector('[role=alert]')).toBeNull();
  expect(container.querySelector('[type=submit]').disabled).toBe(true);
  await act(async () => newRequest.resolve(confirmedResult));
  expect(container.querySelector('h1').textContent).toBe('Compte créé !');
  expect(container.textContent).toContain('second@example.test');
});

test.each(['returned', 'rejected'])('une erreur %s permet un nouvel essai sans perdre la saisie', async outcome => {
  show(); fill();
  if (outcome === 'returned') signUp.mockResolvedValueOnce({ data: null, error: { message: 'Inscription indisponible' } });
  else signUp.mockRejectedValueOnce(new Error('offline'));
  await act(async () => submit());
  expect(container.querySelector('[role=alert]').textContent).toMatch(/indisponible|réessayer/);
  expect(container.querySelector('[name=email]').value).toBe('camille@example.test');
  expect(container.querySelector('[type=submit]').disabled).toBe(false);
  signUp.mockResolvedValueOnce(confirmedResult);
  await act(async () => submit());
  expect(signUp).toHaveBeenCalledTimes(2);
  expect(container.querySelector('h1').textContent).toBe('Compte créé !');
});

test('StrictMode garde une inscription utilisable après le cycle de nettoyage initial', async () => {
  show(true); fill();
  const request = deferred(); signUp.mockReturnValue(request.promise);
  act(() => { submit(); submit(); });
  const requests = signUp.mock.calls.length;
  await act(async () => request.resolve(sessionResult));
  expect(requests).toBe(1);
  expect(container.querySelector('h1').textContent).toBe('Dashboard fixture');
});

test('une validation refusée ne verrouille pas la prochaine inscription valide', async () => {
  show(); act(submit);
  expect(signUp).not.toHaveBeenCalled();
  fill(); signUp.mockResolvedValueOnce(confirmedResult);
  await act(async () => submit());
  expect(signUp).toHaveBeenCalledTimes(1);
  expect(container.querySelector('h1').textContent).toBe('Compte créé !');
});

test('la confirmation garde l’adresse réellement envoyée si le formulaire change pendant l’attente', async () => {
  show(); fill('original@example.test');
  const request = deferred(); signUp.mockReturnValue(request.promise);
  act(submit);
  enter(container.querySelector('[name=email]'), 'modified@example.test');
  await act(async () => request.resolve(confirmedResult));
  expect(signUp.mock.calls[0][0]).toBe('original@example.test');
  expect(container.querySelector('strong').textContent).toBe('original@example.test');
});
