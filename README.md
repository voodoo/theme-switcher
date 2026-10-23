# theme-switcher

A framework-agnostic, zero-dependency `<theme-switcher>` web component. One icon button cycles six themes:
**light → dark → winter → spring → summer → fall**. Ported from habit-tracker (commit b6593f7).

- Persists the choice in `localStorage` (key set with `storage-key`, default `theme-switcher:theme`).
- First visit follows `prefers-color-scheme` (light or dark).
- Sets `data-theme` on `<html>`; `themes.css` maps each theme to CSS custom properties.
- Accessible: a native `<button>` (Enter and Space work), `aria-label` says the current and next theme, visible focus ring.
- Dispatches a `theme-change` event.
- Includes a no-flash init snippet for `<head>`.

## install

```sh
npm install file:../theme-switcher
# later, once the repo is published:
npm install github:voodoo/theme-switcher
```

## exports

| import | what |
| --- | --- |
| `theme-switcher` | registers `<theme-switcher>`; exports `ThemeSwitcher` |
| `theme-switcher/themes.css` | CSS custom properties for each `[data-theme]` |
| `theme-switcher/init` | `initTheme(key, themes)` and `initSnippet(key, themes)` (returns an inline script string) |
| `theme-switcher/init-snippet.html` | copy-paste `<script>` for plain HTML |

## usage: astro

```astro
---
import 'theme-switcher/themes.css';
import { initSnippet } from 'theme-switcher/init';
---
<html lang="en">
  <head>
    <script is:inline set:html={initSnippet('my-app:theme')}></script>
  </head>
  <body>
    <theme-switcher storage-key="my-app:theme" button-class="btn"></theme-switcher>
    <script>import 'theme-switcher';</script>
  </body>
</html>
```

## usage: plain html

```html
<head>
  <!-- paste src/init-snippet.html here, set data-storage-key -->
  <script data-storage-key="my-app:theme">/* … */</script>
  <link rel="stylesheet" href="node_modules/theme-switcher/src/themes.css">
  <script type="module" src="node_modules/theme-switcher/src/theme-switcher.js"></script>
</head>
<body>
  <theme-switcher storage-key="my-app:theme"></theme-switcher>
</body>
```

Use the same storage key in the init snippet and on the element.

## attributes

| attribute | default | notes |
| --- | --- | --- |
| `storage-key` | `theme-switcher:theme` | localStorage key |
| `themes` | `light dark winter spring summer fall` | space- or comma-separated cycle order |
| `button-class` | none | extra classes on the inner `<button>` (it always has `theme-switcher-button`) |

The element sets `data-current` on itself. The inner button holds `<span class="theme-icon">`.

## events

`theme-change` bubbles (and is composed) whenever the theme changes:

```js
document.addEventListener('theme-change', (e) => console.log(e.detail.theme, e.detail.previous));
```

## javascript api

`el.theme` (get or set), `el.nextTheme`, `el.cycle()`.

## demo

```sh
npm run demo   # http://127.0.0.1:4338/
```
