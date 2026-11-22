// @vitest-environment jsdom
import { StrictMode, act, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AuthProvider } from '../src/contexts/AuthProvider';
import { useAuth } from '../src/contexts/AuthContext';

const { auth } = vi.hoisted(() => ({ auth: {
  getSession: vi.fn(), onAuthStateChange: vi.fn(), signUp: vi.fn(),
  signInWithPassword: vi.fn(), signOut: vi.fn(),
} }));
vi.mock('../src/lib/supabase', () => ({ supabase: { auth } }));

let root, container, context, subscriptions, requests;
const session = id => ({ user: { id }, access_token: `synthetic-${id}` });
function Probe() {
  const authContext = useAuth();
  useLayoutEffect(() => { context = authContext; }, [authContext]);
  return <output>{authContext.loading ? 'loading' : (authContext.user?.id ?? 'signed-out')}</output>;
}
const show = strict => act(() => root.render(strict
  ? <StrictMode><AuthProvider><Probe /></AuthProvider></StrictMode>
  : <AuthProvider><Probe /></AuthProvider>));
const finish = async (index, value) => act(async () => requests[index].resolve(value));
const emit = (event, value, index = subscriptions.length - 1) => act(() => subscriptions[index].callback(event, value));

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  context = undefined;
  subscriptions = [];
  requests = [];
  auth.getSession.mockImplementation(() => new Promise((resolve, reject) => requests.push({ resolve, reject })));
  auth.onAuthStateChange.mockImplementation(callback => {
    const subscription = { callback, unsubscribe: vi.fn() };
    subscriptions.push(subscription);
    return { data: { subscription } };
  });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

test('attend la lecture initiale puis expose la session', async () => {
  show();
  expect(container.textContent).toBe('loading');
  const initial = session('initial');
  await finish(0, { data: { session: initial }, error: null });
  expect(context.session).toBe(initial);
  expect(container.textContent).toBe('initial');
});

test('une absence de session termine le chargement', async () => {
  show();
  await finish(0, { data: { session: null }, error: null });
  expect(context.session).toBeNull();
  expect(container.textContent).toBe('signed-out');
});

test('le getter de session est actualisé dans le callback avant le prochain rendu', async () => {
  show();
  const initial = session('account-a');
  await finish(0, { data: { session: initial }, error: null });
  const getter = context.getCurrentSession;
  const next = session('account-b');
  act(() => {
    subscriptions.at(-1).callback('SIGNED_IN', next);
    expect(context.session).toBe(initial);
    expect(getter()).toBe(next);
  });
  expect(context.getCurrentSession).toBe(getter);
  act(() => {
    subscriptions.at(-1).callback('SIGNED_OUT', null);
    expect(getter()).toBeNull();
  });
});

test.each(['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'])('%s récent prévaut sur une lecture initiale tardive', async event => {
  show();
  const recent = session('recent');
  emit(event, recent);
  await finish(0, { data: { session: session('stale') }, error: null });
  expect(context.session).toBe(recent);
  expect(container.textContent).toBe('recent');
});

test('une déconnexion ne restaure jamais une ancienne session', async () => {
  show();
  emit('SIGNED_OUT', null);
  await finish(0, { data: { session: session('stale') }, error: null });
  expect(context.user).toBeNull();
  expect(context.session).toBeNull();
  expect(container.textContent).toBe('signed-out');
});

test('INITIAL_SESSION termine le chargement même si la lecture attend toujours', () => {
  show();
  emit('INITIAL_SESSION', null);
  expect(context.loading).toBe(false);
  expect(container.textContent).toBe('signed-out');
});

test('une erreur retournée ne présente aucune session comme valide', async () => {
  show();
  await finish(0, { data: { session: session('untrusted') }, error: new Error('unavailable') });
  expect(context.user).toBeNull();
  expect(container.textContent).toBe('signed-out');
});

test('un rejet de lecture termine le chargement sans rejet non géré', async () => {
  show();
  await act(async () => requests[0].reject(new Error('offline')));
  expect(context.loading).toBe(false);
  expect(context.session).toBeNull();
});

test('un rejet tardif ne détruit pas une connexion plus récente', async () => {
  show();
  const recent = session('recent');
  emit('SIGNED_IN', recent);
  await act(async () => requests[0].reject(new Error('offline')));
  expect(context.session).toBe(recent);
  expect(context.loading).toBe(false);
});

test('StrictMode libère le premier abonnement et ignore sa réponse tardive', async () => {
  show(true);
  expect(subscriptions).toHaveLength(2);
  expect(subscriptions[0].unsubscribe).toHaveBeenCalledTimes(1);
  await finish(1, { data: { session: session('current') }, error: null });
  await finish(0, { data: { session: session('obsolete') }, error: null });
  expect(container.textContent).toBe('current');
});

test('StrictMode ignore un événement tardif provenant du premier abonnement', async () => {
  show(true);
  await finish(1, { data: { session: session('current') }, error: null });
  emit('SIGNED_IN', session('obsolete'), 0);
  expect(container.textContent).toBe('current');
});

test('les événements courants restent actifs après la lecture initiale', async () => {
  show();
  await finish(0, { data: { session: session('initial') }, error: null });
  emit('SIGNED_OUT', null);
  expect(container.textContent).toBe('signed-out');
  emit('SIGNED_IN', session('next'));
  expect(container.textContent).toBe('next');
  emit('PASSWORD_RECOVERY', session('recovery'));
  expect(context.loading).toBe(false);
  expect(container.textContent).toBe('recovery');
});

test('les actions conservent les contrats Supabase existants', async () => {
  show();
  await finish(0, { data: { session: null }, error: null });
  const data = { session: session('created') };
  const metadata = { organisation: 'Fixture' };
  auth.signUp.mockResolvedValueOnce({ data, error: null });
  auth.signInWithPassword.mockResolvedValueOnce({ data, error: null });
  auth.signOut.mockResolvedValueOnce({ error: null });
  expect(await context.signUp('fixture@example.test', 'test-only-password', metadata)).toEqual({ data, error: null });
  expect(auth.signUp).toHaveBeenCalledWith({ email: 'fixture@example.test', password: 'test-only-password', options: { data: metadata } });
  expect(await context.signIn('fixture@example.test', 'test-only-password')).toEqual({ data, error: null });
  expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: 'fixture@example.test', password: 'test-only-password' });
  expect(await context.signOut()).toEqual({ error: null });
});
