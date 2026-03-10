# UI_MAP.md — DopDop Landing (Auditoría 2026)

> Generado: 2026-03-10 | Stack: Next.js 16.1.4 + Tailwind CSS v4 + lucide-react

---

## 1. Stack Detectado

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.1.4 (App Router, React Compiler habilitado) |
| Runtime | React 19.2.3 |
| CSS Engine | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Íconos | lucide-react ^0.562.0 |
| Linting | ESLint ^9 + eslint-config-next 16.1.4 |
| Testing | **No existe suite** (jest/vitest/playwright no instalados) |
| Bundler | Next.js integrado (webpack/turbopack vía next) |
| Fuentes | Geist Sans + Geist Mono (next/font/google) |

---

## 2. Contrato de Verificación — Comandos Detectados

```bash
# Desarrollo
npm run dev          # next dev

# Build de producción
npm run build        # next build

# Servidor de producción
npm run start        # next start

# Lint
npm run lint         # eslint

# Tests
# ⚠️  NO EXISTE suite de tests en el repositorio.
# Para agregar: ver UI_PR_PLAN.md sección PR 0 (checklist de verificación manual)
```

---

## 3. Mapa de Rutas → Archivos Fuente

| Ruta URL | Archivo | Tipo | Descripción |
|----------|---------|------|-------------|
| `/` | `src/app/page.jsx` | Client Component (`'use client'`) | Landing page principal, componente `DopDopLanding` (428 líneas) |
| `_layout_` | `src/app/layout.jsx` | Server Component | Root layout: fuentes Geist, metadatos globales |
| `_styles_` | `src/app/globals.css` | CSS | Estilos globales: Tailwind import + theme variables |

### Secciones en `page.jsx` (anchors de navegación)

| Sección | ID del DOM | Tipo | Posición |
|---------|-----------|------|----------|
| Header / Navbar | _(fixed, sin ID)_ | Navegación fija | top-0 z-50 |
| Hero | _(sin ID de sección)_ | Hero full-height | Primera sección |
| Quiénes Somos | `#quienes-somos` | Contenido | Sección 2 |
| Nuestros Servicios (título) | _(sin ID)_ | Separador visual | Sección 3 |
| Venta | `#venta` | Money page | Sección 4 |
| Arriendo | `#arriendo` | Money page | Sección 5 |
| Tasación | `#tasacion` | Money page | Sección 6 |
| Administración | `#administracion` | Money page | Sección 7 |
| Contacto | `#contacto` | CTA / Money page | Sección 8 |
| Footer | _(sin ID)_ | Pie de página | Última sección |

### Money Pages identificadas

| Flujo | Secciones | Criticidad |
|-------|-----------|-----------|
| Conversión principal | Hero → Venta → Arriendo → Contacto | 🔴 Alta |
| Servicio secundario | Tasación → Administración | 🟡 Media |
| Cierre de conversión | Contacto (WhatsApp + Email) | 🔴 Alta |

---

## 4. Inventario de Assets

| Archivo | Ruta | Uso |
|---------|------|-----|
| `santiago-portada.jpg` | `public/` | Imagen de fondo del Hero |
| `geist-sans-latin.woff2` | `public/fonts/` | Fuente Geist Sans (copiada de next/dist — fix build offline) |
| `geist-mono-latin.woff2` | `public/fonts/` | Fuente Geist Mono (copiada de next/dist — fix build offline) |
| `file.svg` | `public/` | Template (sin uso en app) |
| `globe.svg` | `public/` | Template (sin uso en app) |
| `next.svg` | `public/` | Template (sin uso en app) |
| `vercel.svg` | `public/` | Template (sin uso en app) |
| `window.svg` | `public/` | Template (sin uso en app) |
| `favicon.ico` | `src/app/` | Favicon (template por defecto) |

---

## 5. Inventario de Componentes

| Componente | Archivo | Estado | Notas |
|-----------|---------|--------|-------|
| `DopDopLanding` | `page.jsx` | Client | Componente principal, monolítico (428 líneas) |
| `ServiceItem` | `page.jsx` (inline) | Server-like | Helper para ítems de servicio con checkmark |
| `RootLayout` | `layout.jsx` | Server | Root layout estándar Next.js |

---

## 6. Contrato de Breakpoints

> **Fuente de verdad:** Tailwind CSS v4 — breakpoints por defecto (sin `tailwind.config.*` personalizado)

| Token | Valor | Uso detectado en código |
|-------|-------|------------------------|
| `sm` | `640px` | `sm:flex-row` (botones CTA) |
| `md` | `768px` | `md:flex`, `md:hidden`, `md:text-*`, `md:grid-cols-4` |
| `lg` | `1024px` | No detectado en uso actual |
| `xl` | `1280px` | No detectado en uso actual |
| `2xl` | `1536px` | No detectado en uso actual |

**⚠️ Nota:** Solo se usan `sm` y `md` actualmente. Los breakpoints `lg`, `xl`, `2xl` no están en uso. Prohibido usar breakpoints no declarados en esta tabla.

---

## 7. Inventario de Tokens Actuales vs Propuestos (PR 0)

### 7.1 Tokens Actuales (hardcoded / sin sistema)

| Tipo | Valor Actual | Ubicación | Problema |
|------|-------------|-----------|---------|
| Color brand | `#010194` | inline styles en page.jsx | Sin token, repetido 6+ veces |
| Color brand hover | `#010194` + `hover:opacity-90` | inline + Tailwind | Sin consistencia |
| z-index navbar | `z-50` | Tailwind class | Sin escala formal |
| z-index hero bg | `z-0` | Tailwind class | Sin escala formal |
| z-index hero content | `z-10` | Tailwind class | Sin escala formal |
| Surface navbar | `bg-black/95 backdrop-blur-sm` | Tailwind class | Sin token glass |
| Surface footer | `bg-slate-950` | Tailwind class | Sin token |
| Surface sección alt | `bg-gray-50` | Tailwind class | Sin token |
| Border color | `border-gray-800` | Tailwind class | Sin token |
| Text primary | `text-black`, `#171717` | Tailwind + CSS var | Inconsistencia |
| Text secondary | `text-gray-700` | Tailwind class | Sin token semántico |
| Text muted dark | `text-gray-300`, `text-gray-400` | Tailwind class | Sin token |
| Success | `text-green-500` | Tailwind class | Sin token semántico |
| Border brand | inline `borderLeftColor: '#010194'` | inline style | Sin token |
| Transición | `transition-colors duration-200`, `transition-opacity` | Tailwind | Sin token de duración |
| Padding sección | `py-20` (5rem) | Tailwind class | Sin token fluid |
| Padding sección alt | `py-12` (3rem) | Tailwind class | Sin token fluid |

### 7.2 Tokens Propuestos (PR 0)

```
-- BRAND --
--color-brand:           #010194
--color-brand-hover:     #0101b8

-- SURFACES --
--color-bg:              #ffffff
--color-bg-dark:         #0a0a0a
--color-surface-1:       #ffffff   (secciones blancas)
--color-surface-2:       #f9fafb   (secciones gris claro)
--color-surface-footer:  #020617   (slate-950)

-- GLASS --
--color-surface-glass-1: rgba(0,0,0,0.95)   (navbar)
--color-surface-glass-2: rgba(0,0,0,0.70)   (overlay hero)
--glass-blur:            blur(8px)

-- TEXT --
--color-text-primary:    #171717
--color-text-secondary:  #374151   (gray-700)
--color-text-muted:      #6b7280   (gray-500)
--color-text-on-dark:    #ffffff
--color-text-on-dark-muted: #d1d5db (gray-300)
--color-text-footer:     #9ca3af   (gray-400)

-- BORDERS --
--color-border-subtle:   #1f2937   (gray-800)
--color-border-brand:    #010194

-- FEEDBACK --
--color-success:         #22c55e   (green-500)
--color-info-bg:         #eff6ff   (blue-50)
--color-info-bg-2:       #dbeafe   (blue-100)

-- SHADOWS --
--shadow-sm:    0 1px 2px rgba(0,0,0,0.05)
--shadow-md:    0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)
--shadow-glass: 0 4px 24px rgba(0,0,0,0.15)

-- RADIOS --
--radius-sm:   0.375rem   (6px)
--radius-md:   0.5rem     (8px)
--radius-lg:   0.75rem    (12px)

-- TIPOGRAFÍA FLUIDA --
--text-hero:     clamp(3.75rem, 8vw, 6rem)
--text-h1:       clamp(2.25rem, 5vw, 3rem)
--text-h2:       clamp(1.875rem, 4vw, 2.25rem)
--text-body-lg:  clamp(1.0625rem, 2vw, 1.25rem)
--text-body:     1rem
--text-sm:       0.875rem

-- SPACING --
--space-section:  clamp(3rem, 8vw, 5rem)
--offset-1:       4px
--offset-2:       8px
--offset-3:       16px

-- MOTION --
--duration-fast:   150ms
--duration-base:   200ms
--duration-slow:   300ms
--ease-default:    cubic-bezier(0.4, 0, 0.2, 1)
--ease-out:        cubic-bezier(0, 0, 0.2, 1)

-- Z-INDEX --
--z-0:   0
--z-10:  10
--z-20:  20
--z-30:  30
--z-40:  40
--z-50:  50    (navbar actual)
--z-60:  60

-- VARIACIÓN HUMANA --
--rotate-cw-1:     1deg
--rotate-ccw-1:   -1deg
--rotate-cw-2:     2deg
--rotate-ccw-2:   -2deg
--offset-human-sm: 4px
--offset-human-md: 8px
--offset-human-lg: 16px
```

---

## 8. Inventario de Z-Index

| Elemento | Valor Actual | Token Propuesto |
|---------|-------------|----------------|
| Hero background overlay | `z-0` | `--z-0` |
| Hero content | `z-10` | `--z-10` |
| Navbar (header fixed) | `z-50` | `--z-50` |

**⚠️ Sin modales/tooltips/overlays adicionales detectados.**

---

## 9. Handlers y Selectores Protegidos

> Estos nodos NO deben tener alterada su jerarquía, semántica, ni handlers:

| Elemento | Handler | Notas |
|---------|---------|-------|
| Botón hamburger | `onClick={() => setMenuOpen(!menuOpen)}` | `aria-label="Toggle menu"` |
| Botones nav (desktop/mobile) | `onClick={() => scrollToSection(item.id)}` | 6 botones nav |
| Botones WhatsApp (×4) | `onClick={() => handleWhatsApp(...)}` | Venta, Arriendo, Adm, Contacto |
| Botones Email (×4) | `onClick={() => handleEmail(...)}` | Venta, Arriendo, Adm, Contacto |
| Links servicios footer | `onClick={() => scrollToSection(...)}` | 4 links |
| Link email footer | `href={mailto:...}` | Ancla HTML |
| Link WhatsApp footer | `href={https://wa.me/...}` | Ancla HTML |
| Links RRSS footer | `href="#"` | 6 links (Facebook, IG, LinkedIn, WA, YT, TikTok) |

**Regla:** Ninguna refactorización puede alterar estos handlers ni degradar `<button>` a `<div>`.

---

## 10. Problemas de Accesibilidad Detectados

| Problema | Severidad | Elemento | Acción |
|---------|-----------|---------|--------|
| `lang="en"` en sitio en español | 🔴 Alta | `<html lang="en">` en layout.jsx | Cambiar a `lang="es"` |
| Metadata por defecto (template) | 🟡 Media | `title: "Create Next App"` | Actualizar a título real |
| Hero sin ID de sección | 🟡 Media | `<section>` sin `id` | Agregar `id="inicio"` |
| Sección servicios-title sin ID | 🟡 Media | `<section>` sin `id` | Agregar `id="servicios"` |
| `alt="Modern house"` en imagen hero | 🟡 Media | `<img alt="Modern house">` | Usar texto descriptivo en español |
| Tasación sin botones CTA | 🟡 Media | Sección `#tasacion` | Agregar CTA consistente |
| Focus ring no definido explícitamente | 🟡 Media | Todos los botones | Agregar `:focus-visible` styles |

---

## 11. Observaciones Técnicas

1. **Tailwind v4 sin config file:** No existe `tailwind.config.js/ts`. El tema se define en `globals.css` con `@theme inline {}`. Los tokens del PR 0 deben ir en `:root {}`.
2. **`bg-linear-to-r` (Tailwind v4):** Equivale al antiguo `bg-gradient-to-r` de Tailwind v3. Usar con precaución — no está documentado en v4 estable.
3. **`inline styles` para color brand:** `style={{ color: '#010194' }}` se repite 6+ veces. Consolidar en PR 1.
4. **`export default` ausente al final de page.jsx:** El archivo termina en el componente `ServiceItem` sin `export default` explícito para `DopDopLanding`. **Sin embargo**, el componente sí es exportado por defecto en línea 5 (`const DopDopLanding = () => {...}`) — revisar si Next.js lo procesa correctamente como default export al no tener `export default DopDopLanding` al final.
   - **CORRECCIÓN:** El archivo SÍ tiene `export default DopDopLanding;` en la línea 429. No hay problema de export.
