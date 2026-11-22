// @vitest-environment jsdom
import { act, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import RouteContent from '../src/components/ui/RouteContent';

let container, root, caught;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  caught = vi.fn();
  root = createRoot(container, { onCaughtError: caught });
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

test('annonce un chargement différé puis rend son contenu sans masquer le cadre', async () => {
  let finish;
  const Deferred = lazy(() => new Promise(resolve => { finish = resolve; }));
  await act(async () => root.render(<MemoryRouter>
    <aside>Navigation conservée</aside>
    <RouteContent><Deferred /></RouteContent>
  </MemoryRouter>));
  expect(container.querySelector('aside').textContent).toBe('Navigation conservée');
  const status = container.querySelector('[role="status"]');
  expect(status.textContent).toBe('Chargement de la page…');
  expect(status.getAttribute('aria-live')).toBe('polite');
  await act(async () => finish({ default: () => <h1>Page chargée</h1> }));
  expect(container.querySelector('h1').textContent).toBe('Page chargée');
  expect(container.querySelector('[role="status"]')).toBeNull();
  expect(caught).not.toHaveBeenCalled();
});

test('un import rejeté laisse un choix explicite et permet de revenir à l’accueil', async () => {
  let reject;
  const Deferred = lazy(() => new Promise((_resolve, rejectImport) => { reject = rejectImport; }));
  await act(async () => root.render(<MemoryRouter initialEntries={['/indisponible']}>
    <Routes>
      <Route path="/indisponible" element={<RouteContent><Deferred /></RouteContent>} />
      <Route path="/" element={<h1>Accueil conservé</h1>} />
    </Routes>
  </MemoryRouter>));
  await act(async () => reject(new Error('synthetic missing chunk')));
  expect(container.querySelector('[role="alert"]').textContent).toBe('La page n’a pas pu être chargée.');
  expect(container.querySelector('button').textContent).toBe('Recharger la page');
  expect(container.querySelector('[role="status"]')).toBeNull();
  expect(caught).toHaveBeenCalledTimes(1);
  await act(async () => container.querySelector('a').click());
  expect(container.querySelector('h1').textContent).toBe('Accueil conservé');
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

test('une erreur dans une page ne condamne pas les autres pages du même cadre', async () => {
  const Broken = lazy(() => Promise.reject(new Error('synthetic missing chunk')));
  await act(async () => root.render(<MemoryRouter initialEntries={['/indisponible']}>
    <nav><Link to="/disponible">Autre page</Link></nav>
    <RouteContent><Routes>
      <Route path="/indisponible" element={<Broken />} />
      <Route path="/disponible" element={<h1>Page disponible</h1>} />
    </Routes></RouteContent>
  </MemoryRouter>));
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
  await act(async () => container.querySelector('nav a').click());
  expect(container.querySelector('h1').textContent).toBe('Page disponible');
  expect(container.querySelector('[role="alert"]')).toBeNull();
});
