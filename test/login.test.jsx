// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Login from '../src/pages/Login';

const { signIn } = vi.hoisted(() => ({ signIn: vi.fn() }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ signIn }) }));

let root, container;
const enter = (input, value) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
const submit = () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
function fill(email = 'fixture@example.test', password = 'fixture-password') {
  enter(container.querySelector('[type=email]'), email);
  enter(container.querySelector('[placeholder="Votre mot de passe"]'), password);
}
beforeEach(() => {
  signIn.mockReset();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<MemoryRouter><Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<h1>Dashboard fixture</h1>} />
    <Route path="/register" element={<h1>Register fixture</h1>} />
  </Routes></MemoryRouter>));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

test('les champs vides ne lancent aucune requête', () => {
  act(submit);
  expect(signIn).not.toHaveBeenCalled();
  fill('fixture@example.test', '');
  act(submit);
  expect(signIn).not.toHaveBeenCalled();
});

test('un rejet réseau libère le bouton et conserve la saisie pour un nouvel essai', async () => {
  fill();
  signIn.mockRejectedValueOnce(new Error('offline'));
  await act(async () => submit());
  expect(container.querySelector('[type=submit]').disabled).toBe(false);
  expect(container.querySelector('[role=alert]').textContent).toMatch(/réessayer/i);
  expect(container.querySelector('[type=email]').value).toBe('fixture@example.test');
  expect(container.querySelector('[type=password]').value).toBe('fixture-password');
  signIn.mockResolvedValueOnce({ data: { session: { user: { id: 'fixture' } } }, error: null });
  await act(async () => submit());
  expect(signIn).toHaveBeenCalledTimes(2);
  expect(container.textContent).toBe('Dashboard fixture');
});

test('deux soumissions rapprochées ne déclenchent qu’une connexion', async () => {
  fill();
  let finish;
  signIn.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  act(() => { submit(); submit(); });
  expect(signIn).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[type=submit]').disabled).toBe(true);
  await act(async () => finish({ data: { session: { user: { id: 'fixture' } } }, error: null }));
  expect(container.textContent).toBe('Dashboard fixture');
});

test('les erreurs de connexion restent traduites et accessibles', async () => {
  fill();
  signIn.mockResolvedValueOnce({ data: null, error: { message: 'Invalid login credentials' } });
  await act(async () => submit());
  expect(container.querySelector('[role=alert]').textContent).toBe('Email ou mot de passe incorrect');
  expect(container.querySelector('[type=submit]').disabled).toBe(false);
});

test('normalise seulement les espaces de l’adresse, jamais ceux du mot de passe', async () => {
  fill('  fixture@example.test  ', ' password with spaces ');
  signIn.mockResolvedValueOnce({ data: { session: { user: { id: 'fixture' } } }, error: null });
  await act(async () => submit());
  expect(signIn).toHaveBeenCalledWith('fixture@example.test', ' password with spaces ');
});

test('une réponse tardive respecte une navigation déjà effectuée', async () => {
  fill();
  let finish;
  signIn.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  act(submit);
  const registration = [...container.querySelectorAll('span')].find(node => node.textContent === 'Créer un compte');
  act(() => registration.click());
  expect(container.textContent).toBe('Register fixture');
  await act(async () => finish({ data: { session: { user: { id: 'fixture' } } }, error: null }));
  expect(container.textContent).toBe('Register fixture');
});
