// <theme-switcher> — framework-agnostic, zero-dependency theme cycler.
const DEFAULT_THEMES = ['light', 'dark', 'winter', 'spring', 'summer', 'fall'];
const DEFAULT_KEY = 'theme-switcher:theme';
const ICONS = { light: '☀️', dark: '🌙', winter: '❄️', spring: '🌸', summer: '🏖️', fall: '🍂' };

const css = `theme-switcher{display:inline-block}
theme-switcher .theme-switcher-button{cursor:pointer}
theme-switcher .theme-switcher-button:focus-visible{outline:3px solid var(--primary,currentColor);outline-offset:2px}`;

function systemDefault(themes) {
  const t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return themes.includes(t) ? t : themes[0];
}

export class ThemeSwitcher extends HTMLElement {
  static get observedAttributes() { return ['themes', 'storage-key', 'button-class']; }

  get themes() {
    const a = (this.getAttribute('themes') || '').split(/[\s,]+/).filter(Boolean);
    return a.length ? a : DEFAULT_THEMES;
  }
  get storageKey() { return this.getAttribute('storage-key') || DEFAULT_KEY; }
  get theme() {
    const t = document.documentElement.getAttribute('data-theme');
    return this.themes.includes(t) ? t : this.themes[0];
  }
  set theme(t) { this.#apply(t, true); }
  get nextTheme() { const l = this.themes; return l[(l.indexOf(this.theme) + 1) % l.length]; }

  connectedCallback() {
    if (!document.getElementById('theme-switcher-style')) {
      const s = document.createElement('style'); s.id = 'theme-switcher-style'; s.textContent = css;
      document.head.appendChild(s);
    }
    if (!this.button) {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.icon = document.createElement('span');
      this.icon.className = 'theme-icon';
      this.icon.setAttribute('aria-hidden', 'true');
      this.button.appendChild(this.icon);
      // native <button> already handles Enter and Space as click
      this.button.addEventListener('click', () => this.cycle());
      this.appendChild(this.button);
    }
    this.button.className = ('theme-switcher-button ' + (this.getAttribute('button-class') || '')).trim();
    let saved = null;
    try { saved = localStorage.getItem(this.storageKey); } catch (e) {}
    const cur = document.documentElement.getAttribute('data-theme');
    if (this.themes.includes(saved)) this.#apply(saved, false);
    else if (!this.themes.includes(cur)) this.#apply(systemDefault(this.themes), false);
    this._onExternal = () => this.#sync();
    document.addEventListener('theme-change', this._onExternal);
    this.#sync();
  }
  disconnectedCallback() { document.removeEventListener('theme-change', this._onExternal); }
  attributeChangedCallback() { if (this.button) this.connectedCallback(); }

  cycle() { this.#apply(this.nextTheme, true); }

  #apply(t, persist) {
    if (!this.themes.includes(t)) return;
    const prev = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', t);
    if (persist) { try { localStorage.setItem(this.storageKey, t); } catch (e) {} }
    this.#sync();
    if (prev !== t) this.dispatchEvent(new CustomEvent('theme-change', { bubbles: true, composed: true, detail: { theme: t, previous: prev } }));
  }

  #sync() {
    if (!this.button) return;
    const t = this.theme, n = this.nextTheme;
    this.button.setAttribute('aria-label', `Theme: ${t}. Switch to ${n} theme`);
    this.button.title = `Theme: ${t} (next: ${n})`;
    this.icon.textContent = ICONS[t] || '🎨';
    this.setAttribute('data-current', t);
  }
}

if (!customElements.get('theme-switcher')) customElements.define('theme-switcher', ThemeSwitcher);
export default ThemeSwitcher;
