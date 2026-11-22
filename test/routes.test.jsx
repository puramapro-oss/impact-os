// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from '../src/App';

const { auth } = vi.hoisted(() => ({ auth: {
  getSession: vi.fn(), onAuthStateChange: vi.fn(), signUp: vi.fn(),
  signInWithPassword: vi.fn(), signOut: vi.fn(),
} }));
vi.mock('../src/lib/supabase', () => ({ supabase: { auth } }));

let container, root, unsubscribe;
const heading = () => container.querySelector('h1')?.textContent;
async function waitForPage(expected) {
  await vi.waitFor(async () => {
    await act(async () => {});
    expect(heading()).toMatch(expected);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  }, { timeout: 4000, interval: 20 });
}
async function visit(path) {
  window.history.replaceState({}, '', path);
  await act(async () => root.render(<App />));
}
async function click(node) {
  expect(node).not.toBeNull();
  await act(async () => node.click());
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    disconnect() {}
    unobserve() {}
  });
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
    unobserve() {}
  });
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  unsubscribe = vi.fn();
  auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe } } });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

test.each([
  ['/', /^LUMIOS illumine votre mission\.$/],
  ['/login', /^Connexion$/],
  ['/register', /^Créer un compte$/],
  ['/dashboard', /, Sophie 👋$/],
  ['/resoutre', /RESOUTRE/],
  ['/inbox', /Inbox IA/],
  ['/agent', /Agent Exécutif/],
  ['/impact', /Impact & Financement/],
  ['/membres', /Membres & Bénévoles/],
  ['/documents', /Documents/],
  ['/audit', /Journal d'audit/],
  ['/parametres', /Paramètres/],
  ['/profil', /Mon profil/],
])('entrée directe sur %s : la vraie page reste accessible', async (path, title) => {
  await visit(path);
  await waitForPage(title);
  expect(window.location.pathname).toBe(path);
  expect(auth.onAuthStateChange).toHaveBeenCalledTimes(1);
  expect(auth.getSession).toHaveBeenCalledTimes(1);
});

test('la navigation entre pages garde le panneau replié et la souscription auth', async () => {
  await visit('/documents');
  await waitForPage(/Documents/);
  await click([...container.querySelectorAll('button')].find(node => node.textContent === 'Réduire'));
  const sidebar = container.querySelector('aside');
  expect(sidebar.style.width).toBe('64px');
  await click(container.querySelector('aside a[href="/audit"]'));
  await waitForPage(/Journal d'audit/);
  expect(container.querySelector('aside')).toBe(sidebar);
  expect(sidebar.style.width).toBe('64px');
  expect(auth.onAuthStateChange).toHaveBeenCalledTimes(1);
  expect(unsubscribe).not.toHaveBeenCalled();
});

test('navigation publique, connexion et historique conservent les providers', async () => {
  await visit('/');
  const publicTitle = heading();
  await click([...container.querySelectorAll('button')].find(node => /connexion|se connecter/i.test(node.textContent)));
  await waitForPage(/^Connexion$/);
  auth.signInWithPassword.mockResolvedValueOnce({ data: { session: null }, error: null });
  await act(async () => {
    const inputs = [[container.querySelector('[type="email"]'), 'route@example.test'], [container.querySelector('[type="password"]'), 'route-test-only']];
    for (const [input, value] of inputs) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await waitForPage(/, Sophie 👋$/);
  await act(async () => window.history.back());
  await waitForPage(/^Connexion$/);
  await act(async () => window.history.back());
  await waitForPage(new RegExp(publicTitle));
  expect(window.location.pathname).toBe('/');
  expect(auth.onAuthStateChange).toHaveBeenCalledTimes(1);
  expect(unsubscribe).not.toHaveBeenCalled();
});

test('une route inconnue revient à l’accueil sans écran de chargement bloqué', async () => {
  await visit('/route-inconnue');
  await waitForPage(/^LUMIOS illumine votre mission\.$/);
  expect(window.location.pathname).toBe('/');
  expect(container.querySelector('[role="status"]')).toBeNull();
});
