const $ = id => document.getElementById(id);

const STORAGE_KEYS = {
  notes:         'writer-notes-by-date',
  lineTypes:     'writer-line-types-by-date',
  theme:         'writer-theme',
  font:          'writer-font',
  fontSize:      'writer-font-size',
  legacyContent: 'writer-content',
};

// Editor (now a single contenteditable div)
const editor = $('editor');

// Corner trigger + overlay
const cornerTrigger      = $('cornerTrigger');
const overlayBackdrop    = $('overlayBackdrop');
const overlayStreakMain  = $('overlayStreakMain');
const overlayStreakSub   = $('overlayStreakSub');
const overlayNoteList    = $('overlayNoteList');
const overlayFocusToggle = $('overlayFocusToggle');
const overlayDarkToggle  = $('overlayDarkToggle');
const overlayFontSelect  = $('overlayFontSelect');
const overlayFontSizeDec = $('overlayFontSizeDec');
const overlayFontSizeVal = $('overlayFontSizeVal');
const overlayFontSizeInc = $('overlayFontSizeInc');
const overlayStats       = $('overlayStats');

// Palette
const paletteBackdrop = $('paletteBackdrop');
const paletteInput    = $('paletteInput');
const paletteList     = $('paletteList');

// Inline format toolbar
const fmtToolbar = $('fmtToolbar');

// Slash menu
const slashMenu = $('slashMenu');

// Link dialog
const linkDialogBackdrop = $('linkDialogBackdrop');
const linkDialogInput    = $('linkDialogInput');
const linkDialogOk       = $('linkDialogOk');
const linkDialogCancel   = $('linkDialogCancel');

// ─── Date formatters ────────────────────────────────────────────────────────

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short', month: 'short', day: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric',
});

// ─── Font list ───────────────────────────────────────────────────────────────

const FONTS = [
  { label: 'Georgia',            value: 'Georgia',            google: false, cat: 'Serif' },
  { label: 'Lora',               value: 'Lora',               google: true,  cat: 'Serif' },
  { label: 'Merriweather',       value: 'Merriweather',       google: true,  cat: 'Serif' },
  { label: 'Playfair Display',   value: 'Playfair Display',   google: true,  cat: 'Serif' },
  { label: 'EB Garamond',        value: 'EB Garamond',        google: true,  cat: 'Serif' },
  { label: 'Crimson Text',       value: 'Crimson Text',       google: true,  cat: 'Serif' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond', google: true,  cat: 'Serif' },
  { label: 'Libre Baskerville',  value: 'Libre Baskerville',  google: true,  cat: 'Serif' },
  { label: 'Spectral',           value: 'Spectral',           google: true,  cat: 'Serif' },
  { label: 'Bitter',             value: 'Bitter',             google: true,  cat: 'Serif' },
  { label: 'Alegreya',           value: 'Alegreya',           google: true,  cat: 'Serif' },
  { label: 'Vollkorn',           value: 'Vollkorn',           google: true,  cat: 'Serif' },
  { label: 'Zilla Slab',         value: 'Zilla Slab',         google: true,  cat: 'Serif' },
  { label: 'Inter',              value: 'Inter',              google: true,  cat: 'Sans-serif' },
  { label: 'Source Sans 3',      value: 'Source Sans 3',      google: true,  cat: 'Sans-serif' },
  { label: 'Nunito',             value: 'Nunito',             google: true,  cat: 'Sans-serif' },
  { label: 'Lato',               value: 'Lato',               google: true,  cat: 'Sans-serif' },
  { label: 'Open Sans',          value: 'Open Sans',          google: true,  cat: 'Sans-serif' },
  { label: 'Jost',               value: 'Jost',               google: true,  cat: 'Sans-serif' },
  { label: 'DM Sans',            value: 'DM Sans',            google: true,  cat: 'Sans-serif' },
  { label: 'Outfit',             value: 'Outfit',             google: true,  cat: 'Sans-serif' },
  { label: 'Plus Jakarta Sans',  value: 'Plus Jakarta Sans',  google: true,  cat: 'Sans-serif' },
  { label: 'Figtree',            value: 'Figtree',            google: true,  cat: 'Sans-serif' },
  { label: 'Mulish',             value: 'Mulish',             google: true,  cat: 'Sans-serif' },
  { label: 'Karla',              value: 'Karla',              google: true,  cat: 'Sans-serif' },
  { label: 'IBM Plex Mono',      value: 'IBM Plex Mono',      google: true,  cat: 'Monospace' },
  { label: 'Inconsolata',        value: 'Inconsolata',        google: true,  cat: 'Monospace' },
  { label: 'Fira Code',          value: 'Fira Code',          google: true,  cat: 'Monospace' },
  { label: 'Source Code Pro',    value: 'Source Code Pro',    google: true,  cat: 'Monospace' },
  { label: 'JetBrains Mono',     value: 'JetBrains Mono',     google: true,  cat: 'Monospace' },
  { label: 'Space Mono',         value: 'Space Mono',         google: true,  cat: 'Monospace' },
  { label: 'DM Serif Display',   value: 'DM Serif Display',   google: true,  cat: 'Display' },
  { label: 'Fraunces',           value: 'Fraunces',           google: true,  cat: 'Display' },
  { label: 'Libre Caslon Text',  value: 'Libre Caslon Text',  google: true,  cat: 'Display' },
  { label: 'Yeseva One',         value: 'Yeseva One',         google: true,  cat: 'Display' },
];

// ─── Slash commands ──────────────────────────────────────────────────────────

const SLASH_CMDS = [
  { label: 'Heading 1',  icon: 'H1',  blockType: 'h1',              aliases: ['h1', 'heading'],  group: 'Headings' },
  { label: 'Heading 2',  icon: 'H2',  blockType: 'h2',              aliases: ['h2', 'heading'],  group: 'Headings' },
  { label: 'Heading 3',  icon: 'H3',  blockType: 'h3',              aliases: ['h3', 'heading'],  group: 'Headings' },
  { label: 'Bullet',     icon: '·',   prefix: '- ',                 aliases: ['bullet', 'list'], group: 'Lists'    },
  { label: 'Numbered',   icon: '1.',  prefix: '1. ',                aliases: ['numbered', 'ol'], group: 'Lists'    },
  { label: 'To-do',      icon: '☐',   prefix: '- [ ] ',             aliases: ['todo', 'task'],   group: 'Lists'    },
  { label: 'Quote',      icon: '"',   prefix: '> ',                 aliases: ['quote', 'bq'],    group: 'Blocks'   },
  { label: 'Code',       icon: '<>',  prefix: '```', suffix: '```',                              group: 'Blocks'   },
  { label: 'Divider',    icon: '—',   prefix: '---',                aliases: ['divider', 'hr'],  group: 'Blocks'   },
];

// ─── State ───────────────────────────────────────────────────────────────────

let notesByDate      = {};
let lineTypesByDate  = {};
let activeDate       = '';
let noteViewState    = {};
let lineTypes        = [];
let isFocus          = false;
let isDark           = false;
let currentFontSize  = 19;
let writeTimer;
let slashState   = { start: -1, active: 0, filtered: [], block: null };
let commandState = { active: 0, filtered: [] };
let pendingLinkSelection = null;

// ─── Boot ────────────────────────────────────────────────────────────────────

init();

function init() {
  document.body.classList.add('idle');
  loadNotesState();
  populateFontOptions();
  bindEvents();

  if (localStorage.getItem(STORAGE_KEYS.theme) === 'dark') applyTheme(true);

  const savedFont = localStorage.getItem(STORAGE_KEYS.font);
  const savedSize = localStorage.getItem(STORAGE_KEYS.fontSize);
  if (savedFont) applyFont(savedFont);
  if (savedSize) applyFontSize(+savedSize);

  loadActiveNote({ focus: true, moveCaretToEnd: true });
}

// ─── Events ──────────────────────────────────────────────────────────────────

function bindEvents() {
  // Editor
  editor.addEventListener('input', handleEditorInput);
  editor.addEventListener('scroll', handleEditorScroll);
  editor.addEventListener('keydown', handleEditorKeydown);
  editor.addEventListener('paste', handleEditorPaste);
  editor.addEventListener('mouseup', () => setTimeout(showFmtToolbar, 10));
  editor.addEventListener('keyup', () => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && editor.contains(sel.anchorNode)) {
      showFmtToolbar();
    } else {
      hideFmtToolbar();
    }
  });

  // Corner trigger
  cornerTrigger.addEventListener('click', openOverlay);

  // Overlay
  overlayBackdrop.addEventListener('click', e => {
    if (e.target === overlayBackdrop) closeOverlay();
  });
  overlayFocusToggle.addEventListener('click', () => {
    toggleFocus();
    overlayFocusToggle.dataset.on = isFocus.toString();
  });
  overlayDarkToggle.addEventListener('click', () => {
    applyTheme(!isDark);
    overlayDarkToggle.dataset.on = isDark.toString();
  });
  overlayFontSelect.addEventListener('change', () => applyFont(overlayFontSelect.value));
  overlayFontSizeInc.addEventListener('click', () => {
    applyFontSize(currentFontSize + 1);
    overlayFontSizeVal.textContent = currentFontSize;
  });
  overlayFontSizeDec.addEventListener('click', () => {
    applyFontSize(currentFontSize - 1);
    overlayFontSizeVal.textContent = currentFontSize;
  });
  overlayNoteList.addEventListener('click', handleNoteListClick);

  // Format toolbar
  fmtToolbar.addEventListener('mousedown', e => e.preventDefault());
  fmtToolbar.addEventListener('click', handleFmtToolbarClick);

  // Slash menu
  slashMenu.addEventListener('mousedown', e => e.preventDefault());
  slashMenu.addEventListener('click', handleSlashMenuClick);

  // Dismiss on outside click
  document.addEventListener('mousedown', e => {
    if (!fmtToolbar.contains(e.target)) hideFmtToolbar();
    if (!slashMenu.contains(e.target)) hideSlashMenu();
  });

  // Global keyboard
  document.addEventListener('keydown', handleGlobalShortcuts);

  // Sync focus mode if user exits fullscreen via browser Esc
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFocus) {
      isFocus = false;
      document.body.classList.remove('focus-mode');
      overlayFocusToggle.dataset.on = 'false';
    }
  });

  // Command palette
  paletteBackdrop.addEventListener('click', e => {
    if (e.target === paletteBackdrop) closePalette();
  });
  paletteInput.addEventListener('input', () => renderCommandPalette(paletteInput.value));
  paletteInput.addEventListener('keydown', handlePaletteKeydown);
  paletteList.addEventListener('click', handlePaletteClick);

  // Link dialog
  linkDialogOk.addEventListener('click', confirmLink);
  linkDialogCancel.addEventListener('click', () => {
    closeLinkDialog();
    editor.focus();
    pendingLinkSelection = null;
  });
  linkDialogBackdrop.addEventListener('click', e => {
    if (e.target === linkDialogBackdrop) {
      closeLinkDialog();
      editor.focus();
      pendingLinkSelection = null;
    }
  });
  linkDialogInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); confirmLink(); }
    if (e.key === 'Escape') { e.preventDefault(); closeLinkDialog(); editor.focus(); pendingLinkSelection = null; }
  });
}

// ─── Notes state ─────────────────────────────────────────────────────────────

function safeParse(raw, fallback) {
  try { const p = JSON.parse(raw); return p ?? fallback; } catch { return fallback; }
}

function pad(v) { return String(v).padStart(2, '0'); }

function formatDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function todayKey() { return formatDateKey(new Date()); }

function parseDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function normalizeDateInput(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const alias = raw.toLowerCase();
  if (alias === 'today')     return todayKey();
  if (alias === 'yesterday') return shiftDateKey(todayKey(), -1);
  if (alias === 'tomorrow')  return shiftDateKey(todayKey(), 1);
  const parsed = parseDateKey(raw);
  return parsed ? formatDateKey(parsed) : null;
}

function shiftDateKey(dateKey, delta) {
  const date = parseDateKey(dateKey);
  if (!date) return todayKey();
  date.setDate(date.getDate() + delta);
  return formatDateKey(date);
}

function ensureNote(dateKey) {
  if (typeof notesByDate[dateKey] !== 'string') notesByDate[dateKey] = '';
}

function persistNotes() {
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notesByDate));
  localStorage.setItem(STORAGE_KEYS.lineTypes, JSON.stringify(lineTypesByDate));
}

function loadNotesState() {
  const rawNotes = safeParse(localStorage.getItem(STORAGE_KEYS.notes), {});
  notesByDate = rawNotes && typeof rawNotes === 'object' && !Array.isArray(rawNotes) ? rawNotes : {};

  const rawTypes = safeParse(localStorage.getItem(STORAGE_KEYS.lineTypes), {});
  lineTypesByDate = rawTypes && typeof rawTypes === 'object' && !Array.isArray(rawTypes) ? rawTypes : {};

  // Legacy single-note migration
  const legacyContent = localStorage.getItem(STORAGE_KEYS.legacyContent);
  if (!Object.keys(notesByDate).length && legacyContent) {
    notesByDate[todayKey()] = legacyContent;
    localStorage.removeItem(STORAGE_KEYS.legacyContent);
  }

  activeDate = todayKey();
  ensureNote(activeDate);
  persistNotes();
}

// ─── Note navigation ─────────────────────────────────────────────────────────

function noteDatesWithContent() {
  return Object.keys(notesByDate)
    .filter(d => notesByDate[d].trim())
    .sort();
}

function prevNoteDate(from) {
  const dates = noteDatesWithContent().filter(d => d < from);
  return dates.length ? dates[dates.length - 1] : null;
}

function nextNoteDate(from) {
  const today = todayKey();
  const dates = noteDatesWithContent().filter(d => d > from);
  const next = dates[0];
  if (next && next <= today) return next;
  return from < today ? today : null;
}

// ─── Streak ──────────────────────────────────────────────────────────────────

function computeStreak() {
  const today = todayKey();
  const filled = new Set(noteDatesWithContent());
  let check = filled.has(today) ? today : shiftDateKey(today, -1);
  let streak = 0;
  while (filled.has(check)) {
    streak++;
    check = shiftDateKey(check, -1);
  }
  return streak;
}

// ─── Contenteditable block helpers ───────────────────────────────────────────

function createBlock(type = 'normal', text = '') {
  const div = document.createElement('div');
  div.dataset.type = type;
  if (text) {
    div.textContent = text;
  } else {
    div.appendChild(document.createElement('br'));
    div.dataset.empty = '';
  }
  return div;
}

function getBlockText(block) {
  if (!block) return '';
  if (block.childNodes.length === 1 && block.firstChild.nodeName === 'BR') return '';
  return block.textContent || '';
}

function setBlockText(block, text) {
  if (!text) {
    block.innerHTML = '';
    block.appendChild(document.createElement('br'));
    block.dataset.empty = '';
  } else {
    block.textContent = text;
    delete block.dataset.empty;
  }
}

function getCurrentBlock() {
  const sel = window.getSelection();
  if (!sel || !sel.anchorNode) return null;
  let node = sel.anchorNode;
  while (node && node !== editor) {
    if (node.parentElement === editor && node.nodeType === Node.ELEMENT_NODE) return node;
    node = node.parentNode;
  }
  return null;
}

function getBlockIndex(block) {
  return Array.from(editor.children).indexOf(block);
}

function getCaretTextOffset(block) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return getBlockText(block).length;
  const range = sel.getRangeAt(0);
  const preRange = document.createRange();
  preRange.selectNodeContents(block);
  preRange.setEnd(range.startContainer, range.startOffset);
  return preRange.toString().length;
}

function setCaretAt(block, position = 'end') {
  if (!block) return;
  const sel = window.getSelection();
  const range = document.createRange();
  const text = getBlockText(block);

  if (!text || position === 'start') {
    if (block.firstChild && block.firstChild.nodeName === 'BR') {
      range.setStartBefore(block.firstChild);
    } else if (block.firstChild) {
      range.setStart(block.firstChild, 0);
    } else {
      range.setStart(block, 0);
    }
  } else {
    const lastChild = block.lastChild;
    if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
      range.setStart(lastChild, lastChild.length);
    } else {
      range.selectNodeContents(block);
      range.collapse(false);
    }
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function setCaretToOffset(block, offset) {
  if (!block) return;
  const sel = window.getSelection();
  const range = document.createRange();
  const textNode = block.firstChild;

  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    const safeOffset = Math.min(offset, textNode.length);
    range.setStart(textNode, safeOffset);
  } else if (block.firstChild && block.firstChild.nodeName === 'BR') {
    range.setStartBefore(block.firstChild);
  } else {
    range.setStart(block, 0);
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function setCaretToRange(block, start, end) {
  if (!block) return;
  const sel = window.getSelection();
  const range = document.createRange();
  const textNode = block.firstChild;

  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    range.setStart(textNode, Math.min(start, textNode.length));
    range.setEnd(textNode, Math.min(end, textNode.length));
  } else {
    range.setStart(block, 0);
    range.collapse(true);
  }
  sel.removeAllRanges();
  sel.addRange(range);
}

function serializeEditor() {
  const blocks = Array.from(editor.children);
  if (!blocks.length) return { text: '', types: [] };
  const text  = blocks.map(getBlockText).join('\n');
  const types = blocks.map(b => b.dataset.type || 'normal');
  return { text, types };
}

function setEditorContent(text, types) {
  editor.innerHTML = '';
  const lines = text === '' ? [''] : text.split('\n');
  lines.forEach((line, i) => {
    editor.appendChild(createBlock(types[i] || 'normal', line));
  });
}

function normalizeEditorBlocks() {
  if (editor.childNodes.length === 0) {
    editor.appendChild(createBlock('normal'));
    return;
  }
  let child = editor.firstChild;
  while (child) {
    const next = child.nextSibling;
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent) {
        editor.insertBefore(createBlock('normal', child.textContent), child);
      }
      editor.removeChild(child);
    } else if (child.nodeName !== 'DIV') {
      const div = createBlock('normal');
      div.textContent = child.textContent;
      editor.insertBefore(div, child);
      editor.removeChild(child);
    } else if (!child.dataset.type) {
      child.dataset.type = 'normal';
    }
    child = next;
  }
}

function updateEmptyAttrs() {
  for (const block of editor.children) {
    if (getBlockText(block) === '') {
      block.dataset.empty = '';
    } else {
      delete block.dataset.empty;
    }
  }
}

// ─── Load note ───────────────────────────────────────────────────────────────

function saveCurrentViewState() {
  const block = getCurrentBlock();
  const blockIndex  = block ? getBlockIndex(block) : -1;
  const caretOffset = block ? getCaretTextOffset(block) : 0;
  noteViewState[activeDate] = {
    scrollTop: editor.scrollTop,
    blockIndex,
    caretOffset,
  };
}

function migrateNoteHeadings(date) {
  if (lineTypesByDate[date]) return;
  const text  = notesByDate[date] || '';
  const lines = text.split('\n');
  const types = [];
  const cleanLines = lines.map(line => {
    if (/^### /.test(line)) { types.push('h3'); return line.slice(4); }
    if (/^## /.test(line))  { types.push('h2'); return line.slice(3); }
    if (/^# /.test(line))   { types.push('h1'); return line.slice(2); }
    types.push('normal');
    return line;
  });
  notesByDate[date]     = cleanLines.join('\n');
  lineTypesByDate[date] = types;
}

function loadActiveNote(options = {}) {
  ensureNote(activeDate);
  migrateNoteHeadings(activeDate);

  if (!lineTypesByDate[activeDate]) lineTypesByDate[activeDate] = [];
  lineTypes = lineTypesByDate[activeDate];

  const text  = notesByDate[activeDate];
  const lines = text === '' ? [''] : text.split('\n');
  while (lineTypes.length < lines.length) lineTypes.push('normal');
  if (lineTypes.length > lines.length) lineTypes.length = lines.length;

  setEditorContent(text, lineTypes);

  const savedState    = noteViewState[activeDate];
  const moveCaretToEnd = options.moveCaretToEnd || !savedState;

  if (savedState && !moveCaretToEnd) {
    editor.scrollTop = savedState.scrollTop || 0;
    const blocks = Array.from(editor.children);
    const block  = blocks[savedState.blockIndex] || blocks[blocks.length - 1];
    if (block) setCaretToOffset(block, savedState.caretOffset || 0);
  } else {
    editor.scrollTop = 0;
    const last = editor.lastElementChild;
    if (last) setCaretAt(last, 'end');
  }

  hideFmtToolbar();
  hideSlashMenu();
  if (options.focus) editor.focus();
}

function switchToDate(dateKey, options = {}) {
  const normalized = normalizeDateInput(dateKey);
  if (!normalized || normalized === activeDate) return;
  saveCurrentViewState();
  activeDate = normalized;
  ensureNote(activeDate);
  persistNotes();
  loadActiveNote({ focus: options.focus !== false, moveCaretToEnd: !!options.moveCaretToEnd });
}

// ─── Overlay ─────────────────────────────────────────────────────────────────

function openOverlay() {
  renderOverlay();
  overlayBackdrop.classList.add('open');
}

function closeOverlay() {
  overlayBackdrop.classList.remove('open');
  editor.focus();
}

function renderOverlay() {
  const streak    = computeStreak();
  const noteCount = noteDatesWithContent().length;
  overlayStreakMain.textContent = `🔥 ${streak}`;
  overlayStreakSub.textContent  = `day streak · ${noteCount} note${noteCount !== 1 ? 's' : ''}`;

  overlayFocusToggle.dataset.on = isFocus.toString();
  overlayDarkToggle.dataset.on  = isDark.toString();

  overlayFontSelect.value        = localStorage.getItem(STORAGE_KEYS.font) || 'Georgia';
  overlayFontSizeVal.textContent = currentFontSize;

  const text    = notesByDate[activeDate] || '';
  const trimmed = text.trim();
  const words   = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  overlayStats.textContent = `${words.toLocaleString()} words · ${text.length.toLocaleString()} chars`;

  const today     = todayKey();
  const noteDates = noteDatesWithContent().reverse();
  const allDates  = noteDates.includes(today) ? noteDates : [today, ...noteDates];

  overlayNoteList.innerHTML = allDates.map(d => {
    const isActive  = d === activeDate;
    const isToday   = d === today;
    const content   = notesByDate[d] || '';
    const wCount    = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    const firstLine = content.split('\n').find(l => l.trim()) || '';
    const preview   = esc(firstLine.slice(0, 72)) || '<span style="opacity:0.4">Empty</span>';
    const dateObj   = parseDateKey(d);
    const dateLabel = isToday ? 'Today' : (dateObj ? shortDateFormatter.format(dateObj) : d);

    return `
      <div class="overlay-note-row${isActive ? ' active' : ''}" data-date="${d}">
        <div class="overlay-note-date">
          ${isToday ? '<span class="today-dot"></span>' : ''}
          ${dateLabel}
        </div>
        <div class="overlay-note-preview">${preview}</div>
        ${wCount ? `<div class="overlay-note-words">${wCount} word${wCount !== 1 ? 's' : ''}</div>` : ''}
      </div>
    `;
  }).join('');
}

function handleNoteListClick(e) {
  const row = e.target.closest('.overlay-note-row[data-date]');
  if (!row) return;
  closeOverlay();
  switchToDate(row.dataset.date, { focus: true });
}

// ─── Font options ─────────────────────────────────────────────────────────────

function populateFontOptions() {
  const groups = {};
  FONTS.forEach(f => { (groups[f.cat] = groups[f.cat] || []).push(f); });
  Object.entries(groups).forEach(([cat, fonts]) => {
    const group = document.createElement('optgroup');
    group.label = cat;
    fonts.forEach(f => {
      const opt = document.createElement('option');
      opt.value       = f.value;
      opt.textContent = f.label;
      group.appendChild(opt);
    });
    overlayFontSelect.appendChild(group);
  });
}

// ─── Editor input ────────────────────────────────────────────────────────────

function handleEditorInput() {
  normalizeEditorBlocks();
  updateEmptyAttrs();

  const { text, types } = serializeEditor();
  notesByDate[activeDate]     = text;
  lineTypesByDate[activeDate] = types;
  lineTypes = lineTypesByDate[activeDate];
  persistNotes();

  document.body.classList.remove('idle');
  document.body.classList.add('writing');
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    document.body.classList.remove('writing');
    document.body.classList.add('idle');
  }, 1500);

  if (isFocus) scrollToCursor();
  checkSlashCommand();
}

function handleEditorScroll() {
  saveCurrentViewState();
}

function handleEditorPaste(e) {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  if (!text) return;

  const block = getCurrentBlock();
  if (!block) return;

  const fullText   = getBlockText(block);
  const offset     = getCaretTextOffset(block);
  const beforeCaret = fullText.slice(0, offset);
  const afterCaret  = fullText.slice(offset);
  const lines = text.split('\n');

  if (lines.length === 1) {
    setBlockText(block, beforeCaret + text + afterCaret);
    setCaretToOffset(block, (beforeCaret + text).length);
  } else {
    setBlockText(block, beforeCaret + lines[0]);
    let lastBlock = block;
    for (let i = 1; i < lines.length - 1; i++) {
      const nb = createBlock('normal', lines[i]);
      lastBlock.after(nb);
      lastBlock = nb;
    }
    const lastText = lines[lines.length - 1] + afterCaret;
    const lastLineBlock = createBlock('normal', lastText);
    lastBlock.after(lastLineBlock);
    setCaretToOffset(lastLineBlock, lines[lines.length - 1].length);
  }
  emitInputEvent();
}

function emitInputEvent() {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

// ─── Keydown ──────────────────────────────────────────────────────────────────

function handleEditorKeydown(e) {
  // Slash menu navigation takes priority
  if (slashMenu.classList.contains('visible')) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      slashState.active = (slashState.active + 1) % slashState.filtered.length;
      slashMenu.querySelectorAll('.sm-item').forEach((item, i) => item.classList.toggle('active', i === slashState.active));
      slashMenu.querySelector('.sm-item.active')?.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      slashState.active = (slashState.active - 1 + slashState.filtered.length) % slashState.filtered.length;
      slashMenu.querySelectorAll('.sm-item').forEach((item, i) => item.classList.toggle('active', i === slashState.active));
      slashMenu.querySelector('.sm-item.active')?.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      applySlashCommand(slashState.filtered[slashState.active]);
      return;
    }
    if (e.key === 'Escape') { hideSlashMenu(); return; }
  }

  if (e.key === 'Backspace') {
    if (handleBackspace()) { e.preventDefault(); return; }
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    handleEnter();
    return;
  }

  // Navigate between notes
  if (e.key === 'ArrowLeft' && e.altKey) {
    e.preventDefault();
    const prev = prevNoteDate(activeDate);
    if (prev) switchToDate(prev);
    return;
  }
  if (e.key === 'ArrowRight' && e.altKey) {
    e.preventDefault();
    const next = nextNoteDate(activeDate);
    if (next) switchToDate(next);
    return;
  }

  if (e.key === 'Tab') { e.preventDefault(); handleSmartIndent(e.shiftKey); }
}

// ─── Block editing ───────────────────────────────────────────────────────────

function handleEnter() {
  const block = getCurrentBlock();
  if (!block) return;

  const text        = getBlockText(block);
  const offset      = getCaretTextOffset(block);
  const beforeCaret = text.slice(0, offset);
  const afterCaret  = text.slice(offset);

  // Smart list continuation
  const marker = getListMarker(text);
  if (marker && offset >= marker.indent.length + marker.marker.length) {
    if (!marker.body.trim()) {
      // Empty list item: clear the marker
      setBlockText(block, marker.indent || '');
      if (marker.indent) setCaretToOffset(block, marker.indent.length);
      else setCaretAt(block, 'start');
      emitInputEvent();
      return;
    }
    // Split: keep this block up to caret, new block gets continuation prefix + rest
    setBlockText(block, beforeCaret);
    const newBlock = createBlock('normal', marker.indent + marker.next + afterCaret);
    block.after(newBlock);
    setCaretToOffset(newBlock, (marker.indent + marker.next).length);
    emitInputEvent();
    return;
  }

  // Default split: new block is always 'normal' (headings don't continue)
  setBlockText(block, beforeCaret);
  const newBlock = createBlock('normal', afterCaret);
  block.after(newBlock);
  setCaretAt(newBlock, 'start');
  emitInputEvent();
}

function handleBackspace() {
  const sel = window.getSelection();
  if (!sel || !sel.isCollapsed) return false;

  const block = getCurrentBlock();
  if (!block) return false;

  const offset = getCaretTextOffset(block);

  if (offset === 0) {
    // At the start of the block
    const type = block.dataset.type || 'normal';

    // If it's a heading: clear heading type, don't merge
    if (type !== 'normal') {
      block.dataset.type = 'normal';
      setCaretAt(block, 'start');
      emitInputEvent();
      return true;
    }

    // First block: nothing above to merge into
    const prev = block.previousElementSibling;
    if (!prev) return false;

    // Merge into previous block
    const prevText = getBlockText(prev);
    const curText  = getBlockText(block);
    setBlockText(prev, prevText + curText);
    setCaretToOffset(prev, prevText.length);
    block.remove();
    emitInputEvent();
    return true;
  }

  return false;
}

function handleSmartIndent(outdent = false) {
  const block = getCurrentBlock();
  if (!block) return;

  const text   = getBlockText(block);
  const offset = getCaretTextOffset(block);
  let newText;

  if (outdent) {
    if (text.startsWith('  '))  newText = text.slice(2);
    else if (text.startsWith(' ')) newText = text.slice(1);
    else newText = text;
  } else {
    newText = '  ' + text;
  }

  const delta = newText.length - text.length;
  setBlockText(block, newText);
  setCaretToOffset(block, Math.max(0, offset + delta));
  emitInputEvent();
}

// ─── Focus mode ───────────────────────────────────────────────────────────────

function toggleFocus() {
  isFocus = !isFocus;
  document.body.classList.toggle('focus-mode', isFocus);
  if (isFocus) {
    scrollToCursor();
    editor.focus();
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
}

function scrollToCursor() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);
  const rect      = range.getBoundingClientRect();
  const editorRect = editor.getBoundingClientRect();
  const relTop    = rect.top - editorRect.top + editor.scrollTop;
  editor.scrollTop = relTop - editor.clientHeight / 2 + rect.height / 2;
  saveCurrentViewState();
}

// ─── Theme ───────────────────────────────────────────────────────────────────

function applyTheme(dark) {
  isDark = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem(STORAGE_KEYS.theme, dark ? 'dark' : 'light');
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Caret position ──────────────────────────────────────────────────────────

function getCaretPos() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return { top: 0, left: 0, bottom: 0 };
  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);
  const rect = range.getBoundingClientRect();
  return { top: rect.top, left: rect.left, bottom: rect.bottom };
}

// ─── Inline format toolbar ───────────────────────────────────────────────────

function wrapSelection(prefix, suffix) {
  const closing = suffix ?? prefix;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return;

  const block = getCurrentBlock();
  if (!block) return;

  const fullText = getBlockText(block);
  const range = sel.getRangeAt(0);

  const preRange = document.createRange();
  preRange.selectNodeContents(block);
  preRange.setEnd(range.startContainer, range.startOffset);
  const start    = preRange.toString().length;
  const selected = range.toString();
  const end      = start + selected.length;

  let newText, newStart, newEnd;

  // Toggle off if already wrapped
  if (
    fullText.slice(start - prefix.length, start) === prefix &&
    fullText.slice(end, end + closing.length) === closing
  ) {
    newText  = fullText.slice(0, start - prefix.length) + selected + fullText.slice(end + closing.length);
    newStart = start - prefix.length;
    newEnd   = newStart + selected.length;
  } else {
    newText  = fullText.slice(0, start) + prefix + selected + closing + fullText.slice(end);
    newStart = start + prefix.length;
    newEnd   = newStart + selected.length;
  }

  setBlockText(block, newText);
  setCaretToRange(block, newStart, newEnd);
  emitInputEvent();
  editor.focus();
}

function insertLink() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const block = getCurrentBlock();
  if (!block) return;

  const fullText = getBlockText(block);
  const range    = sel.getRangeAt(0);

  const preRange = document.createRange();
  preRange.selectNodeContents(block);
  preRange.setEnd(range.startContainer, range.startOffset);
  const start     = preRange.toString().length;
  const selection = range.toString() || 'link text';
  const end       = start + range.toString().length;

  pendingLinkSelection = { block, start, end, selection };
  hideFmtToolbar();
  linkDialogInput.value = '';
  linkDialogBackdrop.classList.add('open');
  setTimeout(() => linkDialogInput.focus(), 0);
}

function confirmLink() {
  const url = linkDialogInput.value.trim();
  closeLinkDialog();
  if (!url || !pendingLinkSelection) { editor.focus(); pendingLinkSelection = null; return; }

  const { block, start, end, selection } = pendingLinkSelection;
  pendingLinkSelection = null;
  const fullText    = getBlockText(block);
  const replacement = `[${selection}](${url})`;
  const newText     = fullText.slice(0, start) + replacement + fullText.slice(end);
  setBlockText(block, newText);
  setCaretToRange(block, start, start + replacement.length);
  emitInputEvent();
  editor.focus();
}

function closeLinkDialog() {
  linkDialogBackdrop.classList.remove('open');
  linkDialogInput.value = '';
}

function handleFmtToolbarClick(event) {
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'bold')   wrapSelection('**');
  if (action === 'italic') wrapSelection('*');
  if (action === 'strike') wrapSelection('~~');
  if (action === 'code')   wrapSelection('`');
  if (action === 'link')   { insertLink(); return; }
  hideFmtToolbar();
}

function showFmtToolbar() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) { hideFmtToolbar(); return; }

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) { hideFmtToolbar(); return; }

  const rect = range.getBoundingClientRect();
  const w    = fmtToolbar.offsetWidth || 210;
  const x    = rect.left + rect.width / 2;
  const y    = rect.top;
  const left = Math.min(Math.max(x - w / 2, 8), window.innerWidth - w - 8);
  const top  = Math.max(y - 56, 8);
  fmtToolbar.style.left = left + 'px';
  fmtToolbar.style.top  = top  + 'px';
  fmtToolbar.classList.add('visible');
}

function hideFmtToolbar() { fmtToolbar.classList.remove('visible'); }

// ─── List marker helpers ─────────────────────────────────────────────────────

function getListMarker(line) {
  const todo = line.match(/^(\s*)- \[([ xX])\] (.*)$/);
  if (todo) return { indent: todo[1], marker: `- [${todo[2]}] `, body: todo[3], next: '- [ ] ', checked: todo[2].toLowerCase() === 'x' };

  const bullet = line.match(/^(\s*)([-*+] )(.*)$/);
  if (bullet) return { indent: bullet[1], marker: bullet[2], body: bullet[3], next: bullet[2] };

  const numbered = line.match(/^(\s*)(\d+)\. (.*)$/);
  if (numbered) return { indent: numbered[1], marker: `${numbered[2]}. `, body: numbered[3], next: `${Number(numbered[2]) + 1}. ` };

  const quote = line.match(/^(\s*> )(.*)$/);
  if (quote) return { indent: '', marker: quote[1], body: quote[2], next: quote[1] };

  return null;
}

// ─── Slash menu ──────────────────────────────────────────────────────────────

function checkSlashCommand() {
  const block = getCurrentBlock();
  if (!block) { if (slashState.start !== -1) hideSlashMenu(); return; }

  const text   = getBlockText(block);
  const offset = getCaretTextOffset(block);
  const textBeforeCaret = text.slice(0, offset);

  const slashMatch = textBeforeCaret.match(/^(\s*)\/([^\n]*)$/);
  if (!slashMatch) {
    if (slashState.start !== -1) hideSlashMenu();
    return;
  }

  slashState.start = slashMatch[1].length;
  slashState.block = block;
  renderSlashMenu(slashMatch[2].toLowerCase());
}

function renderSlashMenu(query) {
  if (query) {
    const q = query.toLowerCase();
    slashState.filtered = SLASH_CMDS.filter(cmd => {
      const terms = [cmd.label, ...(cmd.aliases || [])].join(' ').toLowerCase();
      return terms.includes(q);
    });
    if (!slashState.filtered.length) { hideSlashMenu(); return; }
    slashState.active = Math.max(0, Math.min(slashState.active, slashState.filtered.length - 1));
    slashMenu.innerHTML = slashState.filtered.map((cmd, i) => `
      <div class="sm-item${i === slashState.active ? ' active' : ''}" data-index="${i}">
        <span class="sm-badge">${cmd.icon}</span>
        <span class="sm-name">${cmd.label}</span>
      </div>`).join('');
  } else {
    slashState.filtered = [...SLASH_CMDS];
    slashState.active   = Math.max(0, Math.min(slashState.active, slashState.filtered.length - 1));
    const groups = ['Headings', 'Lists', 'Blocks'];
    slashMenu.innerHTML = groups.map(g => {
      const items = slashState.filtered
        .map((cmd, i) => ({ cmd, i }))
        .filter(({ cmd }) => cmd.group === g)
        .map(({ cmd, i }) => `
          <div class="sm-item${i === slashState.active ? ' active' : ''}" data-index="${i}">
            <span class="sm-badge">${cmd.icon}</span>
            <span class="sm-name">${cmd.label}</span>
          </div>`).join('');
      return `<div class="sm-group"><div class="sm-group-label">${g}</div>${items}</div>`;
    }).join('');
  }

  positionSlashMenu();
  slashMenu.classList.add('visible');
}

function positionSlashMenu() {
  const pos   = getCaretPos();
  const W     = window.innerWidth;
  const H     = window.innerHeight;
  const menuW = 220;
  const estH  = slashState.filtered.length > 0
    ? Math.min(320, slashState.filtered.length * 36 + 40)
    : 320;
  const gutter = 12;
  let top  = pos.bottom + 8;
  let left = pos.left;
  if (top + estH > H - gutter) top = Math.max(gutter, pos.top - estH - 8);
  if (left + menuW > W - gutter) left = Math.max(gutter, W - menuW - gutter);
  slashMenu.style.top  = top  + 'px';
  slashMenu.style.left = left + 'px';
}

function applySlashCommand(command) {
  const block = slashState.block || getCurrentBlock();
  if (!block) return;

  if (command.blockType) {
    // Clear the /query text, set this block as a heading
    const text        = getBlockText(block);
    const beforeSlash = text.slice(0, slashState.start);
    setBlockText(block, beforeSlash);
    block.dataset.type = command.blockType;
    setCaretAt(block, 'end');
    hideSlashMenu();
    emitInputEvent();
    editor.focus();
    return;
  }

  const text        = getBlockText(block);
  const offset      = getCaretTextOffset(block);
  const beforeSlash = text.slice(0, slashState.start);
  const afterCaret  = text.slice(offset);

  // Multi-line prefix (code block, divider)
  if (command.prefix.includes('\n') || command.suffix) {
    const parts = command.prefix.split('\n').filter((_, i, a) => !(i === a.length - 1 && a[i] === ''));
    setBlockText(block, beforeSlash + (parts[0] || ''));
    let lastBlock = block;
    for (let i = 1; i < parts.length; i++) {
      const nb = createBlock('normal', parts[i]);
      lastBlock.after(nb);
      lastBlock = nb;
    }
    if (command.suffix) {
      const suffixParts = command.suffix.split('\n');
      const cursorBlock = createBlock('normal', afterCaret);
      lastBlock.after(cursorBlock);
      lastBlock = cursorBlock;
      for (const sp of suffixParts) {
        const nb = createBlock('normal', sp);
        lastBlock.after(nb);
        lastBlock = nb;
      }
      setCaretAt(cursorBlock, 'start');
    } else {
      setCaretAt(lastBlock, 'end');
    }
  } else {
    const newText = beforeSlash + command.prefix + afterCaret;
    setBlockText(block, newText);
    setCaretToOffset(block, (beforeSlash + command.prefix).length);
  }

  hideSlashMenu();
  emitInputEvent();
  editor.focus();
}

function handleSlashMenuClick(event) {
  const item = event.target.closest('.sm-item');
  if (!item) return;
  applySlashCommand(slashState.filtered[+item.dataset.index]);
}

function hideSlashMenu() {
  slashMenu.classList.remove('visible');
  slashState = { start: -1, active: 0, filtered: [], block: null };
}

// ─── Command palette ──────────────────────────────────────────────────────────

function getCommands(query = '') {
  const normalizedDate = normalizeDateInput(query);
  const prev = prevNoteDate(activeDate);
  const next = nextNoteDate(activeDate);

  const commands = [
    { label: 'Open today',      desc: longDateFormatter.format(new Date()),        keys: '⌘⇧T', action: () => switchToDate(todayKey()) },
    ...(prev ? [{ label: 'Previous note', desc: shortDateFormatter.format(parseDateKey(prev)), keys: 'Alt ←', action: () => switchToDate(prev) }] : []),
    ...(next ? [{ label: 'Next note',     desc: shortDateFormatter.format(parseDateKey(next)), keys: 'Alt →', action: () => switchToDate(next) }] : []),
    { label: isFocus ? 'Turn focus off' : 'Focus on writing', desc: 'Fade text outside the active band', keys: '⌘⇧F', action: toggleFocus },
    { label: isDark  ? 'Use light mode' : 'Use dark mode',   desc: 'Switch palette',                    keys: '⌘⇧D', action: () => applyTheme(!isDark) },
    { label: 'Open menu',       desc: 'Notes, settings, streak',   keys: '⌘\\', action: openOverlay },
    { label: 'Bigger text',     desc: `${Math.min(28, currentFontSize + 1)}px`,   keys: '', action: () => applyFontSize(currentFontSize + 1) },
    { label: 'Smaller text',    desc: `${Math.max(14, currentFontSize - 1)}px`,   keys: '', action: () => applyFontSize(currentFontSize - 1) },
  ];

  if (normalizedDate && normalizedDate !== activeDate) {
    commands.unshift({
      label: `Open ${normalizedDate}`,
      desc: longDateFormatter.format(parseDateKey(normalizedDate)),
      keys: 'Date', always: true,
      action: () => switchToDate(normalizedDate),
    });
  }

  return commands;
}

function commandMatches(cmd, query) {
  if (cmd.always) return true;
  if (!query) return true;
  return `${cmd.label} ${cmd.desc} ${cmd.keys}`.toLowerCase().includes(query.toLowerCase());
}

function renderCommandPalette(query = '') {
  commandState.filtered = getCommands(query).filter(cmd => commandMatches(cmd, query));
  commandState.active   = Math.max(0, Math.min(commandState.active, commandState.filtered.length - 1));

  if (!commandState.filtered.length) {
    paletteList.innerHTML = '<div class="palette-row"><div><div class="palette-title">No commands</div><div class="palette-desc">Try a date like 2026-05-15.</div></div></div>';
    return;
  }

  paletteList.innerHTML = commandState.filtered.map((cmd, i) => `
    <div class="palette-row${i === commandState.active ? ' active' : ''}" data-index="${i}">
      <div>
        <div class="palette-title">${esc(cmd.label)}</div>
        <div class="palette-desc">${esc(cmd.desc)}</div>
      </div>
      ${cmd.keys ? `<span class="palette-keys"><kbd class="key">${esc(cmd.keys)}</kbd></span>` : ''}
    </div>
  `).join('');
}

function runPaletteCommand(index = commandState.active) {
  const cmd = commandState.filtered[index];
  if (!cmd) return;
  closePalette();
  cmd.action();
  if (!overlayBackdrop.classList.contains('open')) editor.focus();
}

function handlePaletteKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (!commandState.filtered.length) return;
    commandState.active = (commandState.active + 1) % commandState.filtered.length;
    renderCommandPalette(paletteInput.value);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (!commandState.filtered.length) return;
    commandState.active = (commandState.active - 1 + commandState.filtered.length) % commandState.filtered.length;
    renderCommandPalette(paletteInput.value);
    return;
  }
  if (event.key === 'Enter')  { event.preventDefault(); runPaletteCommand(); return; }
  if (event.key === 'Escape') { event.preventDefault(); closePalette(); }
}

function handlePaletteClick(event) {
  const row = event.target.closest('.palette-row[data-index]');
  if (!row) return;
  runPaletteCommand(+row.dataset.index);
}

function openPalette() {
  commandState = { active: 0, filtered: [] };
  paletteInput.value = '';
  renderCommandPalette('');
  paletteBackdrop.classList.add('open');
  setTimeout(() => paletteInput.focus(), 0);
}

function closePalette() {
  paletteBackdrop.classList.remove('open');
  paletteInput.value = '';
}

// ─── Global shortcuts ────────────────────────────────────────────────────────

function handleGlobalShortcuts(event) {
  const mod = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();

  if (event.key === 'Escape') {
    closePalette();
    hideSlashMenu();
    hideFmtToolbar();
    if (overlayBackdrop.classList.contains('open')) { closeOverlay(); return; }
    if (linkDialogBackdrop.classList.contains('open')) { closeLinkDialog(); editor.focus(); pendingLinkSelection = null; }
    return;
  }

  if (mod && !event.shiftKey && key === 'k')  { event.preventDefault(); paletteBackdrop.classList.contains('open') ? closePalette() : openPalette(); return; }
  if (mod && !event.shiftKey && key === '\\') { event.preventDefault(); overlayBackdrop.classList.contains('open')  ? closeOverlay()  : openOverlay();  return; }
  if (mod && !event.shiftKey && key === 'b')  { event.preventDefault(); wrapSelection('**'); return; }
  if (mod && !event.shiftKey && key === 'i')  { event.preventDefault(); wrapSelection('*');  return; }

  if (!mod || !event.shiftKey) return;

  const shiftMap = {
    F: toggleFocus,
    D: () => applyTheme(!isDark),
    T: () => switchToDate(todayKey()),
  };
  const fn = shiftMap[event.key.toUpperCase()];
  if (fn) { event.preventDefault(); fn(); }
}

// ─── Font & size ─────────────────────────────────────────────────────────────

function loadGoogleFont(name) {
  const id = 'gf-' + name.replace(/\s+/g, '-');
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id   = id;
  link.rel  = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:ital,wght@0,400;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

function applyFont(name) {
  const font = FONTS.find(f => f.value === name);
  if (!font) return;
  if (font.google) loadGoogleFont(name);
  const stack = font.google ? `'${name}', Georgia, serif` : `Georgia, 'Times New Roman', serif`;
  document.documentElement.style.setProperty('--editor-font', stack);
  overlayFontSelect.value = name;
  localStorage.setItem(STORAGE_KEYS.font, name);
}

function applyFontSize(size) {
  currentFontSize = Math.min(28, Math.max(14, size));
  document.documentElement.style.setProperty('--font-size', currentFontSize + 'px');
  document.documentElement.style.setProperty('--editor-lh', (currentFontSize * 1.82) + 'px');
  overlayFontSizeVal.textContent = currentFontSize;
  localStorage.setItem(STORAGE_KEYS.fontSize, currentFontSize);
}
