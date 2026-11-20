// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Register from '../src/pages/Register';
import Parametres from '../src/pages/Parametres';

const { signUp, addToast } = vi.hoisted(() => ({ signUp: vi.fn(), addToast: vi.fn() }));
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ signUp }) }));
vi.mock('../src/contexts/ToastContext', () => ({ useToast: () => ({ addToast }) }));

let root, container;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  vi.resetAllMocks();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

const show = (page) => act(() => root.render(<MemoryRouter>{page}</MemoryRouter>));
const enter = (input, value) => {
  // Model the browser updating the field before React receives its input event.
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  act(() => {
    setValue.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const registration = [
  ['Sophie', 'Camille'],
  ['Martin', 'Durand'],
  ['sophie@association.fr', 'camille@example.test'],
  ['Les Aigles de Lyon', 'Association test'],
  ['Minimum 8 caractères', 'Exemple1234'],
  ['Confirmez votre mot de passe', 'Exemple1234'],
];

function fillRegistration() {
  for (const [placeholder, text] of registration) {
    enter(container.querySelector(`[placeholder="${placeholder}"]`), text);
  }
}

test('les six champs restent montés et conservent le focus pendant la saisie', () => {
  show(<Register />);
  for (const [placeholder, text] of registration) {
    const input = container.querySelector(`[placeholder="${placeholder}"]`);
    input.focus();
    for (const character of text) {
      enter(input, input.value + character);
      expect(document.activeElement).toBe(input);
      expect(input.isConnected).toBe(true);
    }
    expect(input.value).toBe(text);
  }
});

test('l’inscription attend l’accord puis permet de réessayer après une erreur réseau', async () => {
  show(<Register />);
  fillRegistration();
  const form = container.querySelector('form');
  const terms = form.querySelector('[type=checkbox]');
  expect(terms.checked).toBe(false);
  act(() => form.requestSubmit());
  expect(signUp).not.toHaveBeenCalled();

  act(() => terms.click());
  signUp.mockRejectedValueOnce(new Error('offline'));
  await act(async () => form.requestSubmit());
  expect(form.querySelector('[type=submit]').disabled).toBe(false);
  expect(form.querySelector('[role=alert]').textContent).toMatch(/réessayer/i);

  signUp.mockResolvedValueOnce({ data: { user: { id: 'local' }, session: null }, error: null });
  await act(async () => form.requestSubmit());
  expect(signUp).toHaveBeenCalledTimes(2);
  expect(signUp).toHaveBeenLastCalledWith('camille@example.test', 'Exemple1234', {
    prenom: 'Camille', nom: 'Durand', organisation: 'Association test',
  });
  expect(container.querySelector('h1').textContent).toBe('Compte créé !');
});

test('une inscription en cours garde un seul envoi et une session active ouvre le tableau de bord', async () => {
  show(<Routes>
    <Route path="/" element={<Register />} />
    <Route path="/dashboard" element={<h1>Tableau de bord</h1>} />
  </Routes>);
  fillRegistration();
  const form = container.querySelector('form');
  const submit = form.querySelector('[type=submit]');
  act(() => form.querySelector('[type=checkbox]').click());
  let finish;
  signUp.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  act(() => submit.click());
  expect(submit.disabled).toBe(true);
  act(() => submit.click());
  expect(signUp).toHaveBeenCalledTimes(1);
  await act(async () => finish({ data: { session: { user: { id: 'local' } } }, error: null }));
  expect(container.querySelector('h1').textContent).toBe('Tableau de bord');
});

test('l’interrupteur de notifications garde le focus et expose son état', () => {
  show(<Parametres />);
  const tab = [...container.querySelectorAll('button')].find(button => button.textContent.trim() === 'Notifications');
  act(() => tab.click());
  const row = [...container.querySelectorAll('div')].find(node => node.textContent === 'Notifications par email').parentElement.parentElement;
  const control = row.querySelector('button');
  control.focus();
  act(() => control.click());
  expect(document.activeElement).toBe(control);
  expect(control.getAttribute('aria-checked')).toBe('false');
  expect(control.getAttribute('aria-label')).toBe('Notifications par email');
  act(() => control.click());
  expect(control.getAttribute('aria-checked')).toBe('true');
});
