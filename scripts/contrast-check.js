#!/usr/bin/env node
/**
 * scripts/contrast-check.js
 * WCAG 2.2 Contrast Checker — DopDop Landing
 *
 * Valida las combinaciones de color críticas definidas en el Design System 2026.
 * Para superficies glass con alpha, calcula el color efectivo por alpha-blend
 * sobre --color-bg y --color-bg-dark.
 *
 * Uso:
 *   node scripts/contrast-check.js          # salida legible
 *   node scripts/contrast-check.js --json   # salida JSON
 *
 * Exit code:
 *   0 = todas las combinaciones pasan WCAG 2.2
 *  !0 = al menos una combinación falla
 */

'use strict';

// ---------------------------------------------------------------------------
// 1. Colores del Design System (PR 0 tokens)
// ---------------------------------------------------------------------------

const COLORS = {
  // Backgrounds base
  bg:              '#ffffff',
  bgDark:          '#0a0a0a',

  // Surfaces
  surface1:        '#ffffff',
  surface2:        '#f9fafb',
  surfaceFooter:   '#020617',

  // Glass surfaces (alpha channels; se resuelven contra bg)
  glassNavbar:     { r: 0, g: 0, b: 0, a: 0.95 },   // navbar bg-black/95
  glassHero:       { r: 0, g: 0, b: 0, a: 0.70 },   // overlay hero

  // Text
  textPrimary:     '#171717',
  textSecondary:   '#374151',  // gray-700
  textMuted:       '#6b7280',  // gray-500
  textOnDark:      '#ffffff',
  textOnDarkMuted: '#d1d5db',  // gray-300
  textFooter:      '#9ca3af',  // gray-400

  // Brand
  brand:           '#010194',

  // Feedback — green-600 (#16a34a) para cumplir WCAG 3:1 sobre blanco
  // NOTA: el código actual usa text-green-500 (#22c55e) que falla 3:1. Corregir en PR 1.
  success:         '#16a34a',  // green-600 (checkmark — WCAG compliant)

  // Focus ring (Tailwind default blue-500)
  focusRing:       '#3b82f6',
};

// ---------------------------------------------------------------------------
// 2. WCAG Contrast Math
// ---------------------------------------------------------------------------

/**
 * Convierte hex a { r, g, b } en rango 0–255.
 * @param {string} hex — e.g. '#010194' o '010194'
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * Lineariza un canal sRGB (0–255) → linear light (0–1).
 * @param {number} channel — valor 0–255
 */
function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calcula luminancia relativa WCAG de un color { r, g, b } (0–255).
 * @param {{ r: number, g: number, b: number }} rgb
 */
function relativeLuminance({ r, g, b }) {
  return (
    0.2126 * linearize(r) +
    0.7152 * linearize(g) +
    0.0722 * linearize(b)
  );
}

/**
 * Calcula contrast ratio WCAG entre dos luminancias.
 * @param {number} L1
 * @param {number} L2
 */
function contrastRatio(L1, L2) {
  const lighter = Math.max(L1, L2);
  const darker  = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Alpha-blend: compone un color con alpha sobre un fondo opaco.
 * @param {{ r, g, b, a }} fg — color foreground con alpha (0–1)
 * @param {{ r, g, b }} bg — color background opaco
 * @returns {{ r, g, b }} — color efectivo opaco
 */
function alphaBlend(fg, bg) {
  const a = fg.a;
  return {
    r: Math.round(a * fg.r + (1 - a) * bg.r),
    g: Math.round(a * fg.g + (1 - a) * bg.g),
    b: Math.round(a * fg.b + (1 - a) * bg.b),
  };
}

/**
 * Resuelve un color (hex string o rgba object) a { r, g, b } opaco.
 * Si es rgba, compone sobre el bg indicado.
 * @param {string | { r, g, b, a }} color
 * @param {{ r, g, b }} bg — fondo para composición de glass (por defecto #fff)
 */
function resolveColor(color, bg = hexToRgb(COLORS.bg)) {
  if (typeof color === 'string') return hexToRgb(color);
  if (typeof color === 'object' && 'a' in color) return alphaBlend(color, bg);
  throw new Error(`Unknown color format: ${JSON.stringify(color)}`);
}

// ---------------------------------------------------------------------------
// 3. Definición de pares a validar
// ---------------------------------------------------------------------------

/**
 * Cada entrada define:
 *   label:   nombre legible del par
 *   fg:      color del texto (hex o rgba obj)
 *   bg:      superficie (hex o rgba obj)
 *   bgBase:  fondo base para resolver glass (por defecto COLORS.bg)
 *   type:    'normal' | 'large' | 'ui'
 *            normal → mín 4.5:1
 *            large  → mín 3.0:1  (texto ≥18pt/24px o ≥14pt bold)
 *            ui     → mín 3.0:1  (componentes UI / foco)
 */
const PAIRS = [
  // --- Texto sobre surface-1 (blanco) ---
  {
    label:  'texto-primario (#171717) sobre surface-1 (#ffffff)',
    fg:     COLORS.textPrimary,
    bg:     COLORS.surface1,
    type:   'normal',
  },
  {
    label:  'texto-secundario (#374151) sobre surface-1 (#ffffff)',
    fg:     COLORS.textSecondary,
    bg:     COLORS.surface1,
    type:   'normal',
  },
  {
    label:  'texto-muted (#6b7280) sobre surface-1 (#ffffff)',
    fg:     COLORS.textMuted,
    bg:     COLORS.surface1,
    type:   'normal',
  },
  {
    label:  'brand (#010194) sobre surface-1 (#ffffff) — botones CTA',
    fg:     COLORS.brand,
    bg:     COLORS.surface1,
    type:   'normal',
  },
  {
    label:  'éxito / checkmark (#16a34a / green-600) sobre surface-1 (#ffffff)',
    fg:     COLORS.success,
    bg:     COLORS.surface1,
    type:   'ui',
  },

  // --- Texto sobre surface-2 (gray-50) ---
  {
    label:  'texto-primario (#171717) sobre surface-2 (#f9fafb)',
    fg:     COLORS.textPrimary,
    bg:     COLORS.surface2,
    type:   'normal',
  },
  {
    label:  'texto-secundario (#374151) sobre surface-2 (#f9fafb)',
    fg:     COLORS.textSecondary,
    bg:     COLORS.surface2,
    type:   'normal',
  },
  {
    label:  'brand (#010194) sobre surface-2 — highlight box border',
    fg:     COLORS.brand,
    bg:     COLORS.surface2,
    type:   'ui',
  },

  // --- Texto sobre glass navbar (bg-black/0.95) — base clara ---
  {
    label:  'texto-on-dark (#ffffff) sobre glass-navbar/bg-claro (efectivo ~#0d0d0d)',
    fg:     COLORS.textOnDark,
    bg:     COLORS.glassNavbar,
    bgBase: COLORS.bg,
    type:   'normal',
  },
  {
    label:  'texto-on-dark-muted (#d1d5db) sobre glass-navbar/bg-claro',
    fg:     COLORS.textOnDarkMuted,
    bg:     COLORS.glassNavbar,
    bgBase: COLORS.bg,
    type:   'normal',
  },

  // --- Texto sobre glass navbar (bg-black/0.95) — base oscura ---
  {
    label:  'texto-on-dark (#ffffff) sobre glass-navbar/bg-oscuro (efectivo ~#0d0d0d)',
    fg:     COLORS.textOnDark,
    bg:     COLORS.glassNavbar,
    bgBase: COLORS.bgDark,
    type:   'normal',
  },

  // --- Texto sobre glass hero overlay (black/0.70) ---
  {
    label:  'texto-on-dark (#ffffff) sobre glass-hero-overlay/bg-claro (efectivo ~#4d4d4d)',
    fg:     COLORS.textOnDark,
    bg:     COLORS.glassHero,
    bgBase: COLORS.bg,
    type:   'normal',
  },

  // --- Texto sobre footer (slate-950) ---
  {
    label:  'texto-on-dark (#ffffff) sobre footer (#020617)',
    fg:     COLORS.textOnDark,
    bg:     COLORS.surfaceFooter,
    type:   'normal',
  },
  {
    label:  'texto-footer (#9ca3af) sobre footer (#020617)',
    fg:     COLORS.textFooter,
    bg:     COLORS.surfaceFooter,
    type:   'normal',
  },
  {
    label:  'texto-on-dark-muted (#d1d5db) sobre footer (#020617)',
    fg:     COLORS.textOnDarkMuted,
    bg:     COLORS.surfaceFooter,
    type:   'normal',
  },

  // --- Focus ring ---
  {
    label:  'focus-ring (#3b82f6) sobre surface-1 (#ffffff) — visibilidad mínima 3:1',
    fg:     COLORS.focusRing,
    bg:     COLORS.surface1,
    type:   'ui',
  },
  {
    label:  'focus-ring (#3b82f6) sobre glass-navbar (efectivo ~#0d0d0d)',
    fg:     COLORS.focusRing,
    bg:     COLORS.glassNavbar,
    bgBase: COLORS.bg,
    type:   'ui',
  },
];

// ---------------------------------------------------------------------------
// 4. Evaluación
// ---------------------------------------------------------------------------

const MIN_NORMAL = 4.5;
const MIN_LARGE  = 3.0;
const MIN_UI     = 3.0;

function minimumFor(type) {
  if (type === 'normal') return MIN_NORMAL;
  if (type === 'large')  return MIN_LARGE;
  if (type === 'ui')     return MIN_UI;
  throw new Error(`Unknown type: ${type}`);
}

function evaluate(pair) {
  const baseBg = pair.bgBase ? hexToRgb(pair.bgBase) : hexToRgb(COLORS.bg);
  const fgRgb  = resolveColor(pair.fg,  baseBg);
  const bgRgb  = resolveColor(pair.bg,  baseBg);

  const Lfg    = relativeLuminance(fgRgb);
  const Lbg    = relativeLuminance(bgRgb);
  const ratio  = contrastRatio(Lfg, Lbg);
  const min    = minimumFor(pair.type);
  const pass   = ratio >= min;

  return { ...pair, ratio, min, pass, fgRgb, bgRgb };
}

// ---------------------------------------------------------------------------
// 5. Output
// ---------------------------------------------------------------------------

const results = PAIRS.map(evaluate);
const failures = results.filter((r) => !r.pass);
const useJson  = process.argv.includes('--json');

if (useJson) {
  console.log(JSON.stringify(results.map((r) => ({
    label:    r.label,
    type:     r.type,
    ratio:    +r.ratio.toFixed(2),
    min:      r.min,
    pass:     r.pass,
    fg:       `rgb(${r.fgRgb.r},${r.fgRgb.g},${r.fgRgb.b})`,
    bg:       `rgb(${r.bgRgb.r},${r.bgRgb.g},${r.bgRgb.b})`,
  })), null, 2));
} else {
  const PASS = '✅ PASS';
  const FAIL = '❌ FAIL';

  console.log('\n=== DopDop — WCAG 2.2 Contrast Check ===\n');
  console.log(`${'Resultado'.padEnd(8)} ${'Ratio'.padEnd(8)} ${'Mínimo'.padEnd(8)} Combinación`);
  console.log('─'.repeat(100));

  results.forEach((r) => {
    const status = r.pass ? PASS : FAIL;
    const ratio  = r.ratio.toFixed(2).padEnd(8);
    const min    = `${r.min}:1`.padEnd(8);
    console.log(`${status}  ${ratio} ${min} ${r.label}`);
  });

  console.log('\n' + '─'.repeat(100));

  if (failures.length === 0) {
    console.log(`\n✅  Todos los ${results.length} pares pasan WCAG 2.2. Sin fallos de contraste.\n`);
  } else {
    console.log(`\n❌  ${failures.length} de ${results.length} pares FALLAN WCAG 2.2:\n`);
    failures.forEach((r) => {
      console.log(`  → ${r.label}`);
      console.log(`     Ratio: ${r.ratio.toFixed(2)}:1  |  Requerido: ${r.min}:1  |  Tipo: ${r.type}`);
      console.log(`     Color efectivo FG: rgb(${r.fgRgb.r},${r.fgRgb.g},${r.fgRgb.b})`);
      console.log(`     Color efectivo BG: rgb(${r.bgRgb.r},${r.bgRgb.g},${r.bgRgb.b})\n`);
    });
  }
}

process.exit(failures.length > 0 ? 1 : 0);
