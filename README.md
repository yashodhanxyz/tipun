# Tipun — Distraction-Free Writer

A minimalist, browser-based writing app inspired by [iA Writer](https://ia.net/writer). No installation, no account, no backend. Open `index.html` in any browser and start writing.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Features](#features)
  - [Daily Notes](#daily-notes)
  - [Writing Surface](#writing-surface)
  - [Live Markdown Highlighting](#live-markdown-highlighting)
  - [Inline Formatting Toolbar](#inline-formatting-toolbar)
  - [Slash Commands](#slash-commands)
  - [Command Palette](#command-palette)
  - [Focus Mode](#focus-mode)
  - [Dark Mode](#dark-mode)
  - [Fullscreen](#fullscreen)
  - [Settings Panel](#settings-panel)
  - [Word & Character Count](#word--character-count)
  - [Auto-Save](#auto-save)
  - [Toolbar](#toolbar)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [localStorage Keys](#localstorage-keys)

---

## Overview

Tipun is a single-file writing app built around **one note per date**. The entire application — HTML, CSS, and JavaScript — lives in one `index.html` file with no build step and no dependencies to install. You write in a full-screen editor and switch days from the calendar controls in the bottom toolbar.

---

## Getting Started

```
git clone https://github.com/yashodhan/tipun.git
cd tipun
open index.html        # macOS
# or double-click index.html in your file manager
```

No server required. Works entirely offline once loaded (except Google Fonts, which are fetched on demand when selected).

---

## Features

### Daily Notes

- Every note is keyed by date in `YYYY-MM-DD` format
- Changing the date switches the editor to that day’s note
- Notes are created lazily — opening a new date starts a blank page for that day
- `Today`, previous-day, next-day, and calendar controls are always available in the bottom toolbar

### Writing Surface

- Full-height writing area centred on the page for a focused, full-screen writing experience
- The first line starts near the vertical centre of the viewport, so the page feels open instead of top-heavy
- Text grows downward naturally as you write
- Georgia serif by default, configurable via Settings
- Hidden editor scrollbars keep the interface visually quiet

### Live Markdown Highlighting

The editor uses a two-layer rendering technique to show formatted text as you type — no `contenteditable`, no heavy library.

- A transparent `<textarea>` sits on top (you type here; your caret and selection work normally)
- A `<div>` sits directly behind it and receives parsed HTML on every keystroke

Markdown syntax is rendered live:

| You type | You see |
|---|---|
| `**bold**` | **bold** (markers dimmed to 30% opacity) |
| `*italic*` | *italic* |
| `~~strike~~` | ~~strikethrough~~ |
| `` `code` `` | `monospace` |
| `[text](url)` | link in accent colour |
| `# Heading` | **Bold heading** (`#` dimmed) |
| `> quote` | Italic muted blockquote |
| `- item` | Bullet prefix dimmed |
| `1. item` | Number prefix dimmed |
| ` ``` ` | Fenced code in monospace |
| `---` | Dimmed horizontal rule marker |

Syntax markers are visible but faded so they don't compete with your text.

### Inline Formatting Toolbar

Select any text in the editor and a floating toolbar appears above the selection with five actions:

| Button | Wraps selection in | Toggle |
|---|---|---|
| **B** | `**…**` | Yes — clicking again removes the markers |
| *I* | `*…*` | Yes |
| ~~S~~ | `~~…~~` | Yes |
| `</>` | `` `…` `` | Yes |
| Link | `[text](url)` — prompts for a URL | No |

The toolbar dismisses when you click elsewhere or collapse the selection. It respects the dark theme.

### Slash Commands

Type `/` at the **start of a line** (no other text on that line before the slash) and a menu appears listing block-level formatting options. Type further to filter the list.

| Command | Inserts |
|---|---|
| `/h1` or `/heading 1` | `# ` |
| `/h2` or `/heading 2` | `## ` |
| `/h3` or `/heading 3` | `### ` |
| `/bullet` | `- ` |
| `/numbered` | `1. ` |
| `/todo` or `/task` | `- [ ] ` |
| `/quote` | `> ` |
| `/code` | ` ```…``` ` block |
| `/divider` | `---` |

**Navigation:** `↑` / `↓` to move, `Enter` or `Tab` to apply, `Esc` to dismiss.

### Command Palette

Press `⌘K` / `Ctrl+K` to open the command palette. It is the main control surface for non-writing actions: jumping dates, toggling Focus/Dark/Fullscreen, opening Settings, changing text size, copying the note, and exporting Markdown.

You can also type a date such as `2026-04-28`, `today`, `yesterday`, or `tomorrow` to jump directly to that day’s note.

### Focus Mode

Applies a CSS gradient mask that fades out the text above and below the current region of the page, leaving a band of full-opacity text in the centre.

- Toggle with the **Focus** button in the toolbar or `⌘⇧F`
- The toolbar fades out automatically while writing in Focus mode; hover the bottom edge to reveal it

### Dark Mode

Switches the entire app — background, text, toolbar, settings panel, dropdowns — to a dark palette (`#181818` background, `#d0d0cc` text). Persists across sessions.

Toggle with the **Dark** / **Light** button or `⌘⇧D`.

### Fullscreen

Uses the native browser [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) to hide all browser chrome and fill the screen with your writing.

Toggle with the **Fullscreen** button or `⌘⇧G`. The button label updates to **Exit Fullscreen** while active.

### Settings Panel

Click the **⚙** button in the toolbar (or press `⌘,`) to open the settings panel, which slides in from the right side of the screen.

The toolbar stays fixed at the bottom so the writing surface remains full-screen and the calendar controls are always in the same place.

#### Font

Choose from a curated set of writing fonts. Google Fonts are loaded lazily the first time they are selected — no requests are made for fonts you never use.

| Font | Category |
|---|---|
| Georgia | Serif (system, no network request) |
| Lora | Serif |
| Playfair Display | Serif |
| Merriweather | Serif |
| EB Garamond | Serif |
| Crimson Text | Serif |
| Inter | Sans-serif |
| Source Sans 3 | Sans-serif |
| Nunito | Rounded sans-serif |
| IBM Plex Mono | Monospace |
| Inconsolata | Monospace |

#### Font Size

Increase or decrease the editor font size using the **+** and **−** buttons. Range: **14px – 28px**. The current value is shown live. The editor updates instantly.

### Word & Character Count

Displayed in the toolbar at all times:

- **Word count** — counts space-separated tokens for the current date’s note, ignoring leading/trailing whitespace. Shows "1 word" (singular) when appropriate.
- **Character count** — raw character count for the current note, including spaces and punctuation.

Both update on every keystroke as you switch between dates.

### Auto-Save

Every keystroke is saved to `localStorage` under a date-keyed notes object. The active date is also persisted, so your daily notes survive tab closes, refreshes, and browser restarts — no manual save required.

### Toolbar

The toolbar auto-hides while you are actively typing (after a 1.5 s idle timeout it reappears). It is always visible on hover. It includes:

- A native date picker for jumping to any note
- Previous-day and next-day navigation
- A quick jump back to today
- Focus, Dark mode, Fullscreen, and Settings

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘B` / `Ctrl+B` | Bold selected text |
| `⌘I` / `Ctrl+I` | Italic selected text |
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘,` / `Ctrl+,` | Open Settings |
| `⌘⇧F` / `Ctrl+Shift+F` | Toggle Focus mode |
| `⌘⇧D` / `Ctrl+Shift+D` | Toggle Dark mode |
| `⌘⇧G` / `Ctrl+Shift+G` | Toggle Fullscreen |
| `Alt+←` | Open previous day’s note |
| `Alt+→` | Open next day’s note |
| `Enter` in a list | Continue bullets, numbers, quotes, or todos |
| `Tab` / `Shift+Tab` | Indent / outdent current line or selection |
| `/` at line start | Open slash command menu |
| `↑` / `↓` | Navigate slash menu |
| `Enter` / `Tab` | Apply selected slash command |
| `Esc` | Close slash menu / command palette / settings |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, CSS Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES2020, no framework) |
| Fonts | Google Fonts (loaded on demand) |
| Storage | Browser `localStorage` with date-keyed notes and active date |
| Distribution | Single static file — no bundler, no server |

---

## Project Structure

```
tipun/
└── index.html      # The entire application
```

Everything is intentionally kept in one file to make it trivially portable — copy the file anywhere, open it, and it works.

---

## localStorage Keys

| Key | Type | Description |
|---|---|---|
| `writer-notes-by-date` | `Record<string, string>` | Date-keyed note contents, e.g. `{ "2026-04-07": "..." }` |
| `writer-active-date` | `string` | The active note date |
| `writer-theme` | `"light"` \| `"dark"` | Current colour theme |
| `writer-font` | `string` | Selected font name (e.g. `"Lora"`) |
| `writer-font-size` | `number` | Font size in px (14–28) |

To reset all settings and clear the document, run in the browser console:

```js
localStorage.clear(); location.reload();
```
