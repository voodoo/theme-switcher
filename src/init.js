// No-flash theme init. Run before first paint (inline in <head>).
export const DEFAULT_THEMES = ['light', 'dark', 'winter', 'spring', 'summer', 'fall'];
export const DEFAULT_STORAGE_KEY = 'theme-switcher:theme';

export function initTheme(storageKey = DEFAULT_STORAGE_KEY, themes = DEFAULT_THEMES) {
  var t = null;
  try { t = localStorage.getItem(storageKey); } catch (e) {}
  if (themes.indexOf(t) === -1) {
    t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (themes.indexOf(t) === -1) t = themes[0];
  }
  document.documentElement.setAttribute('data-theme', t);
  return t;
}

// Returns a self-contained JS string to drop into an inline <script> in <head>.
export function initSnippet(storageKey = DEFAULT_STORAGE_KEY, themes = DEFAULT_THEMES) {
  return '(' + initTheme.toString() + ')(' + JSON.stringify(storageKey) + ',' + JSON.stringify(themes) + ');';
}
