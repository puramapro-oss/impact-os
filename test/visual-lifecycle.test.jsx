// @vitest-environment jsdom
import { act, StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useAnimatedCounter } from '../src/hooks/useAnimatedCounter';
import { ThemeProvider } from '../src/contexts/ThemeProvider';
import { ThemeContext } from '../src/contexts/ThemeContext';
import Landing from '../src/pages/Landing';

let root, container, frames, observers, media, listeners, nextFrame;

function Counter({ target = 100, duration = 1000 }) {
  const { count, ref } = useAnimatedCounter(target, duration);
  return <output ref={ref}>{count}</output>;
}

function ThemeControl() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button type="button" onClick={toggleTheme}>{theme}</button>;
}

async function render(element) { await act(async () => root.render(element)); }
async function intersect(observer = observers.at(-1)) {
  await act(async () => observer.callback([{ isIntersecting: true }]));
}
async function frame(at) {
  const pending = [...frames.values()];
  frames.clear();
  await act(async () => { for (const callback of pending) callback(at); });
}
async function reduceMotion(value) {
  media.matches = value;
  await act(async () => { for (const callback of [...listeners]) callback({ matches: value }); });
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  frames = new Map(); observers = []; listeners = new Set(); nextFrame = 0;
  media = {
    matches: false,
    addEventListener: vi.fn((_type, listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_type, listener) => listeners.delete(listener)),
    addListener: vi.fn(listener => listeners.add(listener)),
    removeListener: vi.fn(listener => listeners.delete(listener)),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  vi.stubGlobal('requestAnimationFrame', vi.fn(callback => { frames.set(++nextFrame, callback); return nextFrame; }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn(id => frames.delete(id)));
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback) {
      this.callback = callback; this.observe = vi.fn(); this.disconnect = vi.fn();
      observers.push(this);
    }
  });
  vi.spyOn(performance, 'now').mockReturnValue(100);
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  container = document.createElement('div'); document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals();
});

test('montre la valeur finale sans lancer de mouvement quand la préférence est réduite', async () => {
  media.matches = true;
  await render(<Counter target={87} />);
  expect(container.textContent).toBe('87');
  expect(frames.size).toBe(0);
});

test('attend la visibilité, termine exactement et ne relance pas au second passage', async () => {
  await render(<Counter target={80} />);
  expect(container.textContent).toBe('0'); expect(frames.size).toBe(0);
  await intersect(); await frame(600);
  expect(Number(container.textContent)).toBeGreaterThan(0);
  expect(Number(container.textContent)).toBeLessThan(80);
  await frame(1100); expect(container.textContent).toBe('80');
  await intersect(); expect(frames.size).toBe(0);
});

test('annule les frames à la sortie de la page et ignore un ancien rappel déjà livré', async () => {
  await render(<Counter />); await intersect();
  const stale = [...frames.values()][0];
  await render(<p>Autre page</p>);
  expect(frames.size).toBe(0);
  await act(async () => stale(600));
  expect(frames.size).toBe(0); expect(container.textContent).toBe('Autre page');
});

test('retient la dernière cible quand elle change pendant une animation', async () => {
  await render(<Counter target={100} />); await intersect(); await frame(400);
  const stale = [...frames.values()][0];
  await render(<Counter target={250} />);
  await act(async () => stale(1100));
  await frame(1100);
  expect(container.textContent).toBe('250'); expect(frames.size).toBe(0);
});

test('actualise une valeur déjà animée sans attendre une nouvelle intersection', async () => {
  await render(<Counter target={80} />); await intersect(); await frame(1100);
  await render(<Counter target={140} />); await frame(1100);
  expect(container.textContent).toBe('140');
});

test('arrête immédiatement un mouvement lorsque la préférence change', async () => {
  await render(<Counter target={99} />); await intersect(); await frame(400);
  await reduceMotion(true);
  expect(container.textContent).toBe('99'); expect(frames.size).toBe(0);
});

test('réactiver les animations et changer de cible ensemble ne réaffiche jamais l’ancienne valeur', async () => {
  media.matches = true;
  await render(<StrictMode><Counter target={100} /></StrictMode>);
  expect(container.textContent).toBe('100');
  await act(async () => {
    media.matches = false;
    for (const callback of [...listeners]) callback({ matches: false });
    root.render(<StrictMode><Counter target={200} /></StrictMode>);
  });
  expect(container.textContent).toBe('200');
  await frame(100); expect(container.textContent).toBe('200');
  expect(frames.size).toBe(0);
  await render(<StrictMode><Counter target={300} /></StrictMode>);
  await intersect(); await frame(1100);
  expect(container.textContent).toBe('300');
});

test.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])('durée invalide %s : valeur finale, aucune boucle', async duration => {
  await render(<Counter target={42} duration={duration} />);
  expect(container.textContent).toBe('42'); expect(frames.size).toBe(0);
});

test('affiche la valeur finale si IntersectionObserver n’est pas disponible', async () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  await render(<Counter target={75} />);
  expect(container.textContent).toBe('75'); expect(frames.size).toBe(0);
});

test('un double montage StrictMode ne crée ni écouteur ni animation orpheline', async () => {
  await render(<StrictMode><Counter target={50} /></StrictMode>);
  await intersect(); await frame(1100);
  expect(container.textContent).toBe('50');
  await render(<p>Fin</p>);
  expect(listeners.size).toBe(0); expect(frames.size).toBe(0);
});

test('les anciennes API de préférence restent écoutées puis nettoyées', async () => {
  delete media.addEventListener; delete media.removeEventListener;
  await render(<Counter target={73} />); await intersect(); await reduceMotion(true);
  expect(container.textContent).toBe('73');
  await render(<p>Fin</p>); expect(listeners.size).toBe(0);
});

test('une lecture du stockage refusée ne fait pas tomber l’application', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Denied', 'SecurityError'); });
  await render(<ThemeProvider><ThemeControl /></ThemeProvider>);
  expect(container.textContent).toBe('dark');
  await act(async () => container.querySelector('button').click());
  expect(container.textContent).toBe('light');
});

test('le thème change en mémoire même lorsque la persistance est refusée', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
  await render(<ThemeProvider><ThemeControl /></ThemeProvider>);
  await act(async () => container.querySelector('button').click());
  expect(container.textContent).toBe('light');
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('une préférence inconnue est ignorée sans retirer les couleurs du thème', async () => {
  localStorage.setItem('lumios-theme', 'invalide');
  await render(<ThemeProvider><ThemeControl /></ThemeProvider>);
  expect(container.textContent).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('le thème clair déjà enregistré reste conservé', async () => {
  localStorage.setItem('lumios-theme', 'light');
  await render(<ThemeProvider><ThemeControl /></ThemeProvider>);
  expect(container.textContent).toBe('light');
});

test('fermer le menu par Échap restitue le focus au bouton qui le rouvre', async () => {
  media.matches = true;
  await render(<MemoryRouter><Landing /></MemoryRouter>);
  const menu = container.querySelector('.landing-menu-toggle');
  await act(async () => menu.click());
  expect(menu.getAttribute('aria-expanded')).toBe('true');
  const link = container.querySelector('#landing-navigation-links a');
  await act(async () => {
    link.focus();
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
  expect(menu.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(menu);
  await act(async () => menu.click());
  expect(menu.getAttribute('aria-expanded')).toBe('true');
});

test('les commandes annuelles et FAQ annoncent leur état et leur contenu lié', async () => {
  media.matches = true;
  await render(<MemoryRouter><Landing /></MemoryRouter>);
  const annual = container.querySelector('[role="switch"][aria-label="Facturation annuelle"]');
  expect(annual.getAttribute('aria-checked')).toBe('false');
  await act(async () => annual.click());
  expect(annual.getAttribute('aria-checked')).toBe('true');
  const question = container.querySelector('#faq button');
  expect(question.getAttribute('aria-expanded')).toBe('false');
  await act(async () => question.click());
  expect(question.getAttribute('aria-expanded')).toBe('true');
  expect(document.getElementById(question.getAttribute('aria-controls')).textContent).toContain('LUMIOS');
  await act(async () => question.click());
  expect(question.getAttribute('aria-expanded')).toBe('false');
});
