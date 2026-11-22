// Real Chrome/CDP qualification of the anonymous, already-built landing page.
// Run in the disposable GitHub Actions runner: node scripts/verify-motion-browser.mjs
// No package installation, login, provider mock, payment, deployment or sandbox bypass.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'qa/browser-motion');
const expectedStats = [
  { label: 'Organisations actives', value: '2400+' },
  { label: 'Taux de satisfaction', value: '98%' },
  { label: 'Gagnées par semaine', value: '3h' },
];
const report = {
  status: 'FAIL', startedAt: new Date().toISOString(),
  scope: 'Real anonymous production landing page; Chrome with normal sandbox; widths 360/768/1440 in both motion preferences, plus 360/reduced/light',
  expectedStats, scenarios: [],
  limitations: [
    'Anonymous landing only: no authenticated workflow or backend provider is qualified.',
    'Viewport and reduced-motion emulation do not qualify physical mobile hardware or vibration.',
    'Displayed statistic values are the existing UI contract, not evidence for the marketing figures.',
    'Computed focus visibility and screenshots do not replace a complete accessibility audit.',
  ],
};

class PipeCdp extends EventEmitter {
  constructor(child) {
    super();
    this.child = child;
    this.nextId = 0;
    this.pending = new Map();
    this.buffer = Buffer.alloc(0);
    this.closed = false;
    child.stdio[4].on('data', chunk => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      if (this.buffer.length > 64 * 1024 * 1024) return this.fail(new Error('CDP pipe exceeded 64 MiB'));
      for (let end; (end = this.buffer.indexOf(0)) !== -1;) {
        const frame = this.buffer.subarray(0, end);
        this.buffer = this.buffer.subarray(end + 1);
        if (!frame.length) continue;
        let message;
        try { message = JSON.parse(frame.toString('utf8')); }
        catch (error) { this.fail(error); return; }
        if (message.id) {
          const pending = this.pending.get(message.id);
          if (!pending) continue;
          this.pending.delete(message.id);
          clearTimeout(pending.timer);
          if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
          else pending.resolve(message.result ?? {});
        } else this.emit('protocol', message);
      }
    });
    child.stdio[3].on('error', error => this.fail(error));
    child.stdio[4].on('error', error => this.fail(error));
    child.once('error', error => this.fail(error));
    child.once('exit', (code, signal) => this.fail(new Error(`Chrome exited (${code ?? signal})`)));
  }
  fail(error) {
    this.closed = true;
    for (const { reject, timer } of this.pending.values()) { clearTimeout(timer); reject(error); }
    this.pending.clear();
  }
  send(method, params = {}, sessionId) {
    if (this.closed) return Promise.reject(new Error(`Chrome CDP is closed: ${method}`));
    const id = ++this.nextId;
    return new Promise((resolveResult, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout after 15 seconds: ${method}`));
      }, 15_000);
      this.pending.set(id, { method, timer, resolve: resolveResult, reject });
      this.child.stdio[3].write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + '\0');
    });
  }
}

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json',
};

function chromeExecutable() {
  const candidates = process.env.CHROME_BIN
    ? [process.env.CHROME_BIN]
    : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  for (const command of candidates) {
    const found = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 5_000 });
    if (found.status === 0 && /Chrom(?:e|ium)/i.test(found.stdout)) return { command, version: found.stdout.trim() };
  }
  throw new Error('A working runner Chrome/Chromium executable is required; none was found. No browser was installed or simulated.');
}

function check(scenario, name, ok, details) {
  scenario.checks.push({ name, status: ok ? 'PASS' : 'FAIL', details });
}

async function evaluate(cdp, session, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, session);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(cdp, session, expression, label, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  do {
    if (await evaluate(cdp, session, expression)) return;
    await delay(50);
  } while (Date.now() < deadline);
  throw new Error(`Timed out waiting for ${label}`);
}

async function click(cdp, session, selector) {
  await evaluate(cdp, session, `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error('Missing control'); el.scrollIntoView({block:'center',behavior:'instant'}); })()`);
  await evaluate(cdp, session, frames);
  const point = await evaluate(cdp, session, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)}); const box = el.getBoundingClientRect();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const top = document.elementFromPoint(x,y);
    return {x,y,visible:box.width>0 && box.height>0 && (top===el || el.contains(top))};
  })()`);
  assert.ok(point.visible, `Control is visible and unobstructed: ${selector}`);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y }, session);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 }, session);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1 }, session);
  await evaluate(cdp, session, frames);
}

function expanderExpression(selector) {
  return `(() => {
    const button = document.querySelector(${JSON.stringify(selector)});
    if (!button) return null;
    const id = button.getAttribute('aria-controls'); const panel = id ? document.getElementById(id) : null;
    return { expanded: button.getAttribute('aria-expanded'), controls: id,
      panelVisible: !!panel && panel.getClientRects().length > 0 && getComputedStyle(panel).visibility !== 'hidden',
      panelText: panel?.textContent.trim().slice(0,180) ?? null };
  })()`;
}

const frames = 'new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))';
const statsExpression = `(${JSON.stringify(expectedStats)}).map(expected => {
  const label = [...document.querySelectorAll('section div')].find(el => el.children.length === 0 && el.textContent.trim() === expected.label);
  return { label: expected.label, value: label?.previousElementSibling?.textContent.replace(/\\s/g, '') ?? null };
})`;

async function waitForFocusedControl(cdp, session) {
  return evaluate(cdp, session, `new Promise(resolve => {
    const started = performance.now(), deadlineMs = 2000, requiredStableMs = 100;
    const focused = document.activeElement;
    let previous = null, stableSince = null, firstState = null, current = null, samples = 0, frame;
    let finished = false;
    const read = () => {
      const el = document.activeElement, style = getComputedStyle(el), box = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(innerWidth - 1, box.left + box.width / 2));
      const y = Math.max(0, Math.min(innerHeight - 1, box.top + box.height / 2));
      const top = document.elementFromPoint(x, y);
      return { tag:el.tagName, text:(el.getAttribute('aria-label') || el.textContent).trim().slice(0,90),
        sameFocusedControl:el === focused, focusVisible:el.matches(':focus-visible'), outline:style.outline,
        hasOutline:!['none','hidden'].includes(style.outlineStyle) && parseFloat(style.outlineWidth)>0 && !['transparent','rgba(0, 0, 0, 0)'].includes(style.outlineColor),
        inViewport:box.left>=-1 && box.right<=innerWidth+1 && box.top>=0 && box.bottom<=innerHeight+1,
        uncovered:top===el || el.contains(top),
        geometry:[box.left,box.top,box.right,box.bottom,scrollX,scrollY] };
    };
    const finish = timedOut => {
      if (finished) return;
      finished = true; clearTimeout(timer); cancelAnimationFrame(frame);
      const now = performance.now();
      resolve({...current, stable:stableSince!==null && now-stableSince>=requiredStableMs,
        timedOut, elapsedMs:Math.round(now-started), deadlineMs, requiredStableMs, samples, firstState});
    };
    const sample = () => {
      current = read(); samples++; firstState ??= current;
      const now = performance.now();
      const unchanged = previous && current.sameFocusedControl && current.geometry.every((coordinate,index) => Math.abs(coordinate-previous.geometry[index])<=0.25);
      stableSince = unchanged ? (stableSince ?? now) : null;
      const visible = current.tag!=='BODY' && current.focusVisible && current.hasOutline && current.inViewport && current.uncovered;
      if (visible && stableSince!==null && now-stableSince>=requiredStableMs) { finish(false); return; }
      previous = current;
      frame = requestAnimationFrame(sample);
    };
    const timer = setTimeout(() => { current = read(); finish(true); }, deadlineMs);
    frame = requestAnimationFrame(sample);
  })`);
}

async function screenshot(cdp, session, name) {
  await evaluate(cdp, session, 'window.scrollTo({top:0,left:0,behavior:"instant"})');
  await evaluate(cdp, session, frames);
  const scrollOrigin = await evaluate(cdp, session, '({x:scrollX,y:scrollY})');
  assert.ok(Math.abs(scrollOrigin.x) <= 0.5 && Math.abs(scrollOrigin.y) <= 0.5, 'Full-page screenshots must start at the document origin');
  const metrics = await cdp.send('Page.getLayoutMetrics', {}, session);
  const height = Math.ceil(metrics.cssContentSize.height);
  assert.ok(height > 0 && height <= 24_000, `Unexpected screenshot height: ${height}`);
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: Math.ceil(metrics.cssLayoutViewport.clientWidth), height, scale: 1 },
  }, session);
  const bytes = Buffer.from(data, 'base64');
  await writeFile(join(output, name), bytes);
  return { file: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), scrollOrigin };
}

async function scenario(cdp, base, width, reduced, theme = 'dark') {
  const suffix = `${width}-${reduced ? 'reduced' : 'normal'}${theme === 'light' ? '-light' : ''}`;
  const result = { width, height: 900, reducedMotion: reduced, theme, checks: [], errors: [], fontErrors: [], blockedRequests: [], fontRequests: [] };
  report.scenarios.push(result);
  const { browserContextId } = await cdp.send('Target.createBrowserContext');
  let session;
  let listener;
  try {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', browserContextId });
    session = (await cdp.send('Target.attachToTarget', { targetId, flatten: true })).sessionId;
    const requests = new Map();
    listener = message => {
      if (message.sessionId !== session) return;
      const event = message.params;
      if (message.method === 'Runtime.exceptionThrown') result.errors.push({ kind: 'pageerror', message: event.exceptionDetails.exception?.description ?? event.exceptionDetails.text });
      if (message.method === 'Runtime.consoleAPICalled' && event.type === 'error') result.errors.push({ kind: 'console', message: event.args.map(arg => arg.value ?? arg.description ?? arg.type).join(' ') });
      if (message.method === 'Network.requestWillBeSent') requests.set(event.requestId, event.request.url);
      if (message.method === 'Network.webSocketCreated') {
        const url = new URL(event.url);
        result.blockedRequests.push({ method: 'WEBSOCKET', url: url.origin + url.pathname });
      }
      if (message.method === 'Network.responseReceived' && event.response.status >= 400) {
        const url = new URL(event.response.url);
        (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) ? result.fontErrors : result.errors).push({ kind: 'http', url: url.origin + url.pathname, status: event.response.status });
      }
      if (message.method === 'Network.loadingFailed' && !event.canceled) {
        const rawUrl = requests.get(event.requestId);
        const url = rawUrl ? new URL(rawUrl) : null;
        (url && /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) ? result.fontErrors : result.errors).push({ kind: 'network', url: url ? url.origin + url.pathname : null, message: event.errorText });
      }
      if (message.method === 'Fetch.requestPaused') {
        const request = event.request;
        const url = new URL(request.url);
        const staticRead = url.origin === base && ['GET', 'HEAD'].includes(request.method);
        const fontRead = url.protocol === 'https:' && ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname) && request.method === 'GET';
        const allowed = staticRead || fontRead;
        if (fontRead) result.fontRequests.push(url.origin + url.pathname);
        if (!allowed) result.blockedRequests.push({ method: request.method, url: url.origin + url.pathname });
        void cdp.send(allowed ? 'Fetch.continueRequest' : 'Fetch.failRequest',
          { requestId: event.requestId, ...(allowed ? {} : { errorReason: 'BlockedByClient' }) }, session)
          .catch(error => result.errors.push({ kind: 'request-interception', message: error.message }));
      }
    };
    cdp.on('protocol', listener);
    await Promise.all([
      cdp.send('Runtime.enable', {}, session), cdp.send('Page.enable', {}, session),
      cdp.send('Network.enable', {}, session),
      cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false }, session),
      cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] }, session),
      cdp.send('Emulation.setLocaleOverride', { locale: 'fr-FR' }, session),
      cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] }, session),
    ]);
    await cdp.send('Network.setBypassServiceWorker', { bypass: true }, session);
    await cdp.send('Network.setBlockedURLs', { urls: ['ws://*', 'wss://*'] }, session);
    if (theme === 'light') await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `if (location.origin === ${JSON.stringify(base)}) localStorage.setItem('lumios-theme','light');` }, session);
    const navigation = await cdp.send('Page.navigate', { url: base + '/' }, session);
    assert.equal(navigation.errorText, undefined, 'The local production landing must navigate successfully');
    await cdp.send('Page.bringToFront', {}, session);
    await waitFor(cdp, session, "document.readyState === 'complete' && !!document.querySelector('h1')", 'the real landing');
    await evaluate(cdp, session, 'document.fonts.ready.then(() => true)');
    await evaluate(cdp, session, frames);
    check(result, 'heading', await evaluate(cdp, session, "document.querySelector('h1')?.textContent.includes('LUMIOS')"), 'Original landing heading is rendered');
    check(result, 'motion-media', await evaluate(cdp, session, "matchMedia('(prefers-reduced-motion: reduce)').matches") === reduced, { expected: reduced });
    check(result, 'theme-applied', await evaluate(cdp, session, "document.documentElement.getAttribute('data-theme')") === theme, { expected: theme });

    const initialStats = await evaluate(cdp, session, statsExpression);
    if (reduced) check(result, 'counters-final-without-scroll-or-animation', JSON.stringify(initialStats) === JSON.stringify(expectedStats), initialStats);
    else {
      for (const expected of expectedStats) {
        await evaluate(cdp, session, `(() => {
          const label = [...document.querySelectorAll('section div')].find(el => el.children.length === 0 && el.textContent.trim() === ${JSON.stringify(expected.label)});
          if (!label) throw new Error('Counter label missing');
          label.parentElement.scrollIntoView({ block: 'center', behavior: 'instant' });
        })()`);
        await waitFor(cdp, session, `(${statsExpression}).find(stat => stat.label === ${JSON.stringify(expected.label)})?.value === ${JSON.stringify(expected.value)}`, `final counter ${expected.label}`, 4_000);
      }
      check(result, 'normal-counters-reach-target', true, await evaluate(cdp, session, statsExpression));
    }

    const statText = await evaluate(cdp, session, `(() => {
      const rectData = rect => ({left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height});
      const inside = (inner,outer) => inner.left>=outer.left-0.5 && inner.right<=outer.right+0.5 && inner.top>=outer.top-0.5 && inner.bottom<=outer.bottom+0.5;
      const counters = [...document.querySelectorAll('.landing-stat')].map(cell => {
        const value = cell.querySelector('.landing-stat-value') || cell.firstElementChild;
        const range = document.createRange(); range.selectNodeContents(value);
        const textBounds = rectData(range.getBoundingClientRect());
        const valueBox = rectData(value.getBoundingClientRect()), cellBox = rectData(cell.getBoundingClientRect());
        const fragments = [], walker = document.createTreeWalker(value, NodeFilter.SHOW_TEXT);
        for (let node; (node = walker.nextNode());) {
          if (!node.textContent.trim()) continue;
          const textRange = document.createRange(); textRange.selectNodeContents(node);
          fragments.push(...[...textRange.getClientRects()].filter(rect => rect.width>0 && rect.height>0).map(rectData));
        }
        return {label:cell.lastElementChild.textContent.trim(),value:value.textContent.replace(/\\s/g,''),
          textBounds,valueBox,cellBox,fragments,font:getComputedStyle(value).font,
          fullyContained:fragments.length>0 && textBounds.width>0 && textBounds.height>0 && inside(textBounds,valueBox) && inside(textBounds,cellBox) && fragments.every(rect => inside(rect,valueBox) && inside(rect,cellBox))};
      });
      const overlaps = [];
      for (let left=0;left<counters.length;left++) for (let right=left+1;right<counters.length;right++) {
        const a=counters[left].textBounds,b=counters[right].textBounds;
        if (Math.min(a.right,b.right)-Math.max(a.left,b.left)>0.5 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>0.5)
          overlaps.push([counters[left].label,counters[right].label]);
      }
      return {counters,overlaps,toleranceCssPx:0.5};
    })()`);
    check(result, 'counter-text-fits-without-clipping-or-overlap',
      statText.counters.length === expectedStats.length && statText.counters.every((counter,index) => counter.fullyContained && counter.label === expectedStats[index].label && counter.value === expectedStats[index].value) && statText.overlaps.length === 0, statText);

    const layout = await evaluate(cdp, session, `(() => {
      const width = document.documentElement.clientWidth;
      const overflow = [...document.querySelectorAll('body *')].flatMap(el => {
        if (el instanceof SVGElement) return [];
        const box = el.getBoundingClientRect(); const style = getComputedStyle(el);
        if (box.width === 0 || box.height === 0 || style.visibility === 'hidden' || style.display === 'none') return [];
        // Absolute, non-interactive decorative glows are clipped intentionally by their section.
        if (style.position === 'absolute' && style.pointerEvents === 'none' && !el.textContent.trim()) return [];
        return box.left < -1 || box.right > width + 1
          ? [{ tag: el.tagName, className: String(el.className).slice(0, 100), text: el.textContent.trim().slice(0, 90), left: box.left, right: box.right }] : [];
      });
      return { viewport: innerWidth, client: width, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, overflow: overflow.slice(0, 30) };
    })()`);
    check(result, 'no-horizontal-overflow', layout.document <= layout.client + 1 && layout.body <= layout.client + 1 && layout.overflow.length === 0, layout);

    await evaluate(cdp, session, 'window.scrollTo({top:0,left:0,behavior:"instant"})');
    const focusChecks = [];
    for (let index = 0; index < 12; index++) {
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, session);
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, session);
      focusChecks.push(await waitForFocusedControl(cdp, session));
    }
    check(result, 'keyboard-visible-focus-first-12-stops', focusChecks.every(f => !f.timedOut && f.stable && f.sameFocusedControl && f.tag !== 'BODY' && f.focusVisible && f.hasOutline && f.inViewport && f.uncovered), focusChecks);

    // Exercise the actual native buttons and React state with real browser input.
    const menuVisible = await evaluate(cdp, session, "!!document.querySelector('.landing-menu-toggle')?.getClientRects().length");
    check(result, 'responsive-menu-visibility', menuVisible === (width <= 900), { menuVisible });
    if (menuVisible) {
      const selector = '.landing-menu-toggle';
      check(result, 'mobile-menu-initially-closed', (await evaluate(cdp, session, expanderExpression(selector)))?.expanded === 'false', null);
      await click(cdp, session, selector);
      const opened = await evaluate(cdp, session, expanderExpression(selector));
      check(result, 'mobile-menu-opens-with-linked-panel', opened?.expanded === 'true' && opened.panelVisible && Boolean(opened.panelText), opened);
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, session);
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, session);
      await evaluate(cdp, session, frames);
      check(result, 'mobile-menu-keyboard-enters-panel', await evaluate(cdp, session, "document.getElementById('landing-navigation-links').contains(document.activeElement)"), 'Escape is exercised from a focused menu link, not from the toggle');
      if (theme === 'light') {
        const contrast = await evaluate(cdp, session, `(() => {
          const menu = document.querySelector('.landing-menu-toggle');
          const style = getComputedStyle(menu); const icon = getComputedStyle(menu.querySelector('svg'));
          const foreground = icon.stroke === 'currentcolor' ? style.color : icon.stroke;
          const background = getComputedStyle(document.querySelector('.landing-navigation')).backgroundColor;
          const parse = value => { const match = value.match(/^rgba?\\((.+)\\)$/); if (!match) return null; const parts = match[1].split(/[,\\s/]+/).filter(Boolean).map(Number); return {rgb:parts.slice(0,3),alpha:parts[3]??1}; };
          const fg = parse(foreground), bg = parse(background);
          const luminance = color => color.rgb.map(channel => { const s = channel/255; return s<=0.04045 ? s/12.92 : ((s+0.055)/1.055)**2.4; }).reduce((sum,channel,index) => sum+channel*[0.2126,0.7152,0.0722][index],0);
          const valid = fg && bg && fg.alpha === 1 && bg.alpha === 1 && fg.rgb.length === 3 && bg.rgb.length === 3;
          const a = valid ? luminance(fg) : null, b = valid ? luminance(bg) : null;
          return { foreground, buttonColor:style.color, background, opaque:!!valid, ratio:valid ? (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05) : null };
        })()`);
        check(result, 'light-menu-icon-contrast', contrast.opaque && contrast.ratio >= 3, contrast);
        result.openMenuScreenshot = await screenshot(cdp, session, `menu-open-${suffix}.png`);
      }
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 }, session);
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 }, session);
      await evaluate(cdp, session, frames);
      const escaped = await evaluate(cdp, session, expanderExpression(selector));
      check(result, 'mobile-menu-closes-with-escape', escaped?.expanded === 'false' && !escaped.panelVisible, escaped);
      check(result, 'mobile-menu-escape-returns-focus', await evaluate(cdp, session, "document.activeElement === document.querySelector('.landing-menu-toggle')"), 'Focus returns to the visible toggle after leaving the now-hidden menu link');
      await click(cdp, session, selector);
      await click(cdp, session, selector);
      const toggled = await evaluate(cdp, session, expanderExpression(selector));
      check(result, 'mobile-menu-closes-with-toggle', toggled?.expanded === 'false' && !toggled.panelVisible, toggled);
    }

    const faqSelector = '#faq button[aria-controls][aria-expanded]';
    await evaluate(cdp, session, `(() => { const el = document.querySelector(${JSON.stringify(faqSelector)}); el.scrollIntoView({block:'center',behavior:'instant'}); el.focus(); })()`);
    for (const modifiers of [8, 0]) {
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9, modifiers }, session);
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9, modifiers }, session);
    }
    await evaluate(cdp, session, frames);
    const faqFocus = await evaluate(cdp, session, `(() => { const el = document.querySelector(${JSON.stringify(faqSelector)}); const style = getComputedStyle(el); return { active:document.activeElement===el, visible:el.matches(':focus-visible'), style:style.outlineStyle, width:parseFloat(style.outlineWidth), offset:parseFloat(style.outlineOffset) }; })()`);
    check(result, 'faq-closed-focus-ring-within-clipped-card', faqFocus.active && faqFocus.visible && faqFocus.style === 'solid' && faqFocus.width >= 2 && faqFocus.offset <= -faqFocus.width, faqFocus);
    await click(cdp, session, faqSelector);
    const faqOpened = await evaluate(cdp, session, expanderExpression(faqSelector));
    check(result, 'faq-opens-with-linked-answer', faqOpened?.expanded === 'true' && faqOpened.panelVisible && Boolean(faqOpened.panelText), faqOpened);
    if (reduced) {
      const durations = await evaluate(cdp, session, `(() => { const el = document.getElementById(document.querySelector(${JSON.stringify(faqSelector)}).getAttribute('aria-controls')); const style = getComputedStyle(el); return {duration:style.animationDuration,iterations:style.animationIterationCount}; })()`);
      check(result, 'faq-reduced-animation', durations.duration.split(',').every(value => parseFloat(value) <= (value.trim().endsWith('ms') ? 1 : 0.001)) && durations.iterations.split(',').every(value => Number(value) <= 1), durations);
    }
    await click(cdp, session, faqSelector);
    const faqClosed = await evaluate(cdp, session, expanderExpression(faqSelector));
    check(result, 'faq-closes-and-updates-aria', faqClosed?.expanded === 'false' && !faqClosed.panelVisible, faqClosed);

    result.images = await evaluate(cdp, session, "[...document.images].map(image => ({source:image.currentSrc || image.src,complete:image.complete,width:image.naturalWidth,height:image.naturalHeight}))");
    if (result.images.length) check(result, 'rendered-images-loaded', result.images.every(image => image.complete && image.width > 0 && image.height > 0), result.images);
    else result.imageCheck = 'NOT_APPLICABLE: no raster image element on this landing; SVG/network errors remain checked';

    const motionStyles = await evaluate(cdp, session, `(() => {
      const toSeconds = value => value.split(',').map(v => v.trim().endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v));
      const probes = ['animate-fade-in', 'animate-slide-in'].map(className => {
        const el = document.createElement('span'); el.className = className;
        el.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;height:1px;pointer-events:none';
        document.body.append(el); const style = getComputedStyle(el);
        const data = { className, animationName: style.animationName, durations: toSeconds(style.animationDuration), delays: toSeconds(style.animationDelay), iterations: style.animationIterationCount };
        el.remove(); return data;
      });
      const transitions = [...document.querySelectorAll('button,a,.glass-card')].map(el => Math.max(...toSeconds(getComputedStyle(el).transitionDuration)));
      const delays = [...document.querySelectorAll('button,a,.glass-card')].map(el => Math.max(...toSeconds(getComputedStyle(el).transitionDelay)));
      return { scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, probes, longestControlTransition: Math.max(0,...transitions), longestControlTransitionDelay: Math.max(0,...delays) };
    })()`);
    check(result, 'computed-motion-styles', reduced
      ? motionStyles.scrollBehavior === 'auto' && motionStyles.probes.every(p => p.durations.every(d => d <= 0.001) && p.delays.every(d => d <= 0.001) && p.iterations.split(',').every(n => Number(n) <= 1)) && motionStyles.longestControlTransition <= 0.001 && motionStyles.longestControlTransitionDelay <= 0.001
      : motionStyles.probes.every(p => p.animationName !== 'none' && p.durations.some(d => d > 0.001)), motionStyles);

    await evaluate(cdp, session, 'window.scrollTo({top:0,left:0,behavior:"instant"})');
    const primaryIndex = await evaluate(cdp, session, `(() => { const buttons = [...document.querySelectorAll('.btn-primary')]; const index = buttons.findIndex(el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'); if (index < 0) throw new Error('Visible primary control missing'); buttons[index].scrollIntoView({block:'center',behavior:'instant'}); return index; })()`);
    await evaluate(cdp, session, frames);
    const buttonExpression = `document.querySelectorAll('.btn-primary')[${primaryIndex}]`;
    const button = await evaluate(cdp, session, `(() => { const el = ${buttonExpression}; const box = el.getBoundingClientRect(); return { x: box.x+box.width/2, y: box.y+box.height/2, width: box.width, height: box.height, transform: getComputedStyle(el).transform }; })()`);
    check(result, 'primary-control-visible-for-hover', button.width > 0 && button.height > 0 && button.x >= 0 && button.x < width && button.y >= 0 && button.y < 900, button);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: button.x, y: button.y }, session);
    await evaluate(cdp, session, frames);
    if (reduced) {
      const hover = await evaluate(cdp, session, `({ transform: getComputedStyle(${buttonExpression}).transform, active: ${buttonExpression}.matches(':hover') })`);
      check(result, 'reduced-motion-no-hover-lift', hover.active && hover.transform === button.transform, { before: button.transform, hover });
    }
    result.screenshot = await screenshot(cdp, session, `landing-${suffix}.png`);
    check(result, 'no-application-errors', result.errors.length === 0, result.errors);
    check(result, 'fonts-loaded-without-errors', result.fontErrors.length === 0, { errors: result.fontErrors, requested: [...new Set(result.fontRequests)] });
    check(result, 'no-unexpected-network-request', result.blockedRequests.length === 0, result.blockedRequests);
  } catch (error) {
    check(result, 'scenario-completed', false, { message: error.message });
    if (session) {
      try { result.failureScreenshot = await screenshot(cdp, session, `failure-${suffix}.png`); }
      catch (captureError) { result.captureError = captureError.message; }
    }
  } finally {
    if (listener) cdp.off('protocol', listener);
    await cdp.send('Target.disposeBrowserContext', { browserContextId });
  }
  result.status = result.checks.length > 0 && result.checks.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL';
}

let server;
let child;
let cdp;
let profile;
let childExit;
let executionTimeout;
let stderr = '';
try {
  assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Run this real-browser gate only in its disposable GitHub Actions runner');
  assert.ok(Number(process.versions.node.split('.')[0]) >= 24, 'Node 24+ is required');
  await mkdir(output, { recursive: true });
  const dist = await realpath(join(root, 'dist'));
  const index = await readFile(join(dist, 'index.html'));
  report.buildIndexSha256 = createHash('sha256').update(index).digest('hex');
  report.node = process.version;
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', timeout: 5_000 });
  const tree = spawnSync('git', ['rev-parse', 'HEAD^{tree}'], { cwd: root, encoding: 'utf8', timeout: 5_000 });
  assert.equal(head.status, 0, 'The runner checkout commit must be readable');
  assert.equal(tree.status, 0, 'The runner checkout tree must be readable');
  report.checkout = { head: head.stdout.trim(), tree: tree.stdout.trim(), githubSha: process.env.GITHUB_SHA ?? null };
  report.chrome = chromeExecutable();
  profile = await mkdtemp(join(tmpdir(), 'impact-motion-chrome-'));
  server = createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const path = await realpath(resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname)));
      const within = relative(dist, path);
      if (within.startsWith('..') || isAbsolute(within) || !((await stat(path)).isFile())) { response.writeHead(404); response.end(); return; }
      const body = await readFile(path);
      response.writeHead(200, { 'content-type': mime[extname(path)] || 'application/octet-stream', 'content-length': body.length, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise((resolveReady, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveReady);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => ['PATH', 'HOME', 'LANG', 'LC_ALL', 'TZ', 'XDG_RUNTIME_DIR', 'DISPLAY'].includes(key)));
  child = spawn(report.chrome.command, [
    '--headless=new', '--remote-debugging-pipe', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    '--disable-component-update', '--disable-sync', '--disable-extensions', 'about:blank',
  ], { env, stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
  childExit = new Promise(resolveExit => { child.once('exit', resolveExit); child.once('error', resolveExit); });
  child.stderr.on('data', bytes => { stderr = (stderr + bytes.toString()).slice(-65_536); });
  cdp = new PipeCdp(child);
  executionTimeout = setTimeout(() => {
    const error = new Error('The complete real-browser gate exceeded 180 seconds');
    report.fatalError = error.message;
    cdp.fail(error);
    child.kill('SIGTERM');
  }, 180_000);
  executionTimeout.unref();
  report.browserProtocol = await cdp.send('Browser.getVersion');
  for (const width of [360, 768, 1440]) {
    for (const reduced of [false, true]) await scenario(cdp, base, width, reduced);
  }
  await scenario(cdp, base, 360, true, 'light');
  report.status = report.scenarios.length === 7 && report.scenarios.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL';
} catch (error) {
  report.fatalError = error.message;
} finally {
  clearTimeout(executionTimeout);
  if (cdp && !cdp.closed) await cdp.send('Browser.close').catch(() => {});
  if (child?.pid && child.exitCode === null && child.signalCode === null) {
    const finished = await Promise.race([childExit.then(() => true), delay(3_000).then(() => false)]);
    if (!finished) {
      child.kill('SIGTERM');
      const stopped = await Promise.race([childExit.then(() => true), delay(2_000).then(() => false)]);
      if (!stopped) { child.kill('SIGKILL'); await childExit; }
    }
  }
  if (server) { server.closeAllConnections(); await new Promise(resolveClosed => server.close(resolveClosed)); }
  if (profile) await rm(profile, { recursive: true, force: true });
  report.finishedAt = new Date().toISOString();
  report.cleanup = { ownedBrowserStopped: !child?.pid || child.exitCode !== null || child.signalCode !== null, temporaryProfileRemoved: Boolean(profile) };
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'chrome.stderr.log'), stderr);
  await writeFile(join(output, 'receipt.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ status: report.status, receipt: relative(root, join(output, 'receipt.json')), scenarios: report.scenarios.map(item => ({ width: item.width, reducedMotion: item.reducedMotion, theme: item.theme, status: item.status, failed: item.checks.filter(check => check.status === 'FAIL').map(check => check.name) })), fatalError: report.fatalError }, null, 2) + '\n');
  if (report.status !== 'PASS') process.exitCode = 1;
}
