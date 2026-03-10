# UI_PR_PLAN.md — DopDop Landing (Plan de PRs 2026)

> Stack: Next.js 16.1.4 + Tailwind CSS v4 + lucide-react | Fecha: 2026-03-10

---

## Reglas globales de todos los PRs

- **No nuevas dependencias** sin justificación y aprobación. Stack actual es suficiente.
- **No cambiar toolchain/bundler.**
- **No tocar** lógica de negocio: `handleWhatsApp`, `handleEmail`, constantes de contacto.
- **No degradar semántica**: `<button>` permanece `<button>`, no reemplazar por `<div>`.
- **No alterar handlers ni `data-testid`** (aunque no existan tests aún, guardrail preventivo).
- **Contraste**: ejecutar `node scripts/contrast-check.js` antes de cada merge.
- **Lint**: ejecutar `npm run lint` antes de cada merge.
- **Build**: ejecutar `npm run build` antes de cada merge.

---

## PR 0 — Caja de Herramientas (Tokens + Scripts + Guardrails)

### Objetivo
Infraestructura invisible: tokens CSS, script de contraste, correcciones de accesibilidad críticas de metadatos. **Cero cambio visual en la UI renderizada.**

### Estado: ✅ IMPLEMENTADO

### Archivos tocados
| Archivo | Cambio | Visible |
|---------|--------|---------|
| `src/app/globals.css` | Design tokens 2026 en `:root {}` + fallbacks glass + prefers-reduced-motion | ❌ No |
| `src/app/layout.jsx` | `lang="en"` → `lang="es"`, metadata actualizada, fonts Google→local | ⚠️ Solo browser tab/SEO |
| `scripts/contrast-check.js` | Script WCAG 2.2 nuevo (Node.js) | ❌ No |
| `UI_MAP.md` | Documentación nueva | ❌ No |
| `UI_TRENDS_AUDIT.md` | Documentación nueva | ❌ No |
| `UI_PR_PLAN.md` | Documentación nueva | ❌ No |

### Entregables completados

- [x] **Design Tokens 2026** — CSS custom properties en `:root {}` de globals.css:
  - `--color-brand`, `--color-brand-hover`
  - Surfaces: `--color-surface-1/2`, `--color-surface-glass-1/2`, `--color-surface-footer`
  - Text: `--color-text-primary/secondary/muted/on-dark/on-dark-muted/footer`
  - Shadows: `--shadow-sm/md/glass`
  - Radii: `--radius-sm/md/lg`
  - Tipografía fluida: `--text-hero/h1/h2/body-lg/body/sm` con `clamp()`
  - Spacing: `--space-section`, `--offset-1/2/3`
  - Motion: `--duration-fast/base/slow`, `--ease-default/out`
  - Z-index scale: `--z-0` a `--z-60`
  - Variación humana: `--rotate-cw/ccw-1/2`, `--offset-human-sm/md/lg`

- [x] **Escala de Variación Humana** — tokens discretos máx ±2deg / 16px

- [x] **Script de Contraste WCAG 2.2** — `scripts/contrast-check.js`:
  - 17 pares críticos validados: ✅ todos pasan
  - Composición alpha-blend para glass surfaces
  - Exit code 0 = pass, !0 = fail
  - Uso: `node scripts/contrast-check.js` o `node scripts/contrast-check.js --json`

- [x] **Breakpoints como contrato** — documentados en UI_MAP.md sección 6

- [x] **Z-index Discipline** — escala `--z-0` a `--z-60` definida

- [x] **Guardrail glass fallback** — `@supports not (backdrop-filter)` en globals.css

- [x] **Guardrail prefers-reduced-motion** — regla global en globals.css

- [x] **Fix fonts Google → local** — `next/font/local` con archivos Geist copiados a `public/fonts/` (fix de build en entornos sin internet)
- [x] **Fix accesibilidad** — `lang="es"` + metadata real en layout.jsx

- [x] **NOTA sobre color success**: `text-green-500` (#22c55e) en `ServiceItem` falla WCAG 3:1 (ratio 2.28). Token `--color-success: #16a34a` (green-600, ratio 3.30:1) ya definido. Aplicar en PR 1.

### Checklist de verificación PR 0

```bash
# 1. Contraste WCAG 2.2
node scripts/contrast-check.js
# Esperado: "✅ Todos los 17 pares pasan WCAG 2.2. Sin fallos de contraste."
# Exit code: 0

# 2. Lint
npm run lint
# Esperado: 0 errores

# 3. Build
npm run build
# Esperado: compilación exitosa sin warnings

# 4. Verificación manual
# - Abrir http://localhost:3000 con `npm run dev`
# - Verificar que la UI se ve exactamente igual que antes
# - Verificar en DevTools: :root debe tener los tokens CSS definidos
# - Verificar en <html lang="es">
# - Verificar title en pestaña: "DopDop — Corredora de Propiedades Low-Cost en Chile"
```

### Rollback PR 0
```bash
# Si algo falla, revertir globals.css al estado anterior:
git checkout main -- src/app/globals.css src/app/layout.jsx
# Los archivos de documentación y script son aditivos — no requieren rollback.
```

---

## PR 1 — Money Pages (Conversión + Accesibilidad Crítica)

### Objetivo
Maximizar conversión en flujos críticos y resolver todos los problemas de accesibilidad que afectan a usuarios reales. Aplicar tokens de PR 0.

### Estado: ⏳ Pendiente

### Archivos a tocar
| Archivo | Cambio | Visible |
|---------|--------|---------|
| `src/app/page.jsx` | Ver detalle abajo | ✅ Sí |
| `src/app/layout.jsx` | Sin cambios adicionales | — |

### Cambios planificados en `page.jsx`

#### 1. Imagen hero → `<Image>` de Next.js (LCP crítico)
```diff
- import React, { useState } from 'react';
+ import React, { useState } from 'react';
+ import Image from 'next/image';
...
- <img
-   src="/santiago-portada.jpg"
-   alt="Modern house"
-   className="w-full h-full object-cover"
- />
+ <Image
+   src="/santiago-portada.jpg"
+   alt="Vista de Santiago de Chile — DopDop Corredora de Propiedades"
+   fill
+   priority
+   className="object-cover"
+   sizes="100vw"
+ />
```

#### 2. CTA en Hero
```jsx
// Agregar debajo del tagline, antes del cierre de la sección hero:
<div className="flex flex-col sm:flex-row gap-4 mt-8">
  <button
    onClick={() => handleWhatsApp('Hola, me gustaría obtener más información sobre DopDop')}
    className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    style={{ backgroundColor: 'var(--color-brand)', outlineColor: 'var(--color-brand)' }}
  >
    <MessageCircle className="w-5 h-5" />
    Hablar con un experto
  </button>
  <button
    onClick={() => scrollToSection('servicios')}
    className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  >
    Ver servicios
  </button>
</div>
```

#### 3. IDs faltantes
```diff
- <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
+ <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

- <section className="py-12 bg-gray-50">
+ <section id="servicios" className="py-12 bg-gray-50">
```

#### 4. Color checkmark → `--color-success`
```diff
- <span className="text-green-500 mt-1">✓</span>
+ <span className="mt-1" style={{ color: 'var(--color-success)' }}>✓</span>
// Alternativa Tailwind: className="text-green-600 mt-1" (green-600 = #16a34a ✅ WCAG)
```

#### 5. Clase `glass-surface` en header (activa fallback de PR 0)
```diff
- <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
+ <header className="glass-surface fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
```

#### 6. CTA en sección Tasación
```jsx
// Agregar después del highlight box de tasación:
<div className="flex flex-col sm:flex-row gap-4 mt-8">
  <button
    onClick={() => handleWhatsApp('Hola, me interesa el servicio de Tasación Inteligente')}
    className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
    style={{ backgroundColor: 'var(--color-brand)' }}
  >
    <MessageCircle className="w-5 h-5" />
    Contactar por WhatsApp
  </button>
  <button
    onClick={() => handleEmail('Consulta: Tasación Inteligente')}
    className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
  >
    <Mail className="w-5 h-5" />
    Enviar Email
  </button>
</div>
```

#### 7. Consolidar `style={{ color: '#010194' }}` → CSS variable
```diff
- style={{ color: '#010194' }}
+ style={{ color: 'var(--color-brand)' }}

- style={{ backgroundColor: '#010194' }}
+ style={{ backgroundColor: 'var(--color-brand)' }}

- style={{ borderLeftColor: '#010194' }}
+ style={{ borderLeftColor: 'var(--color-border-brand)' }}
```

#### 8. Breakpoint intermedio en footer
```diff
- <div className="grid md:grid-cols-4 gap-8 mb-8">
+ <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
```

### Guardrails PR 1
- ✅ No alterar `handleWhatsApp()`, `handleEmail()`, `scrollToSection()`
- ✅ Mantener todos los `aria-label` existentes
- ✅ No cambiar copy/texto de negocio
- ✅ Verificar en mobile (sm) y desktop (md+) antes de merge

### Checklist de verificación PR 1

```bash
# 1. Contraste
node scripts/contrast-check.js
# Esperado: exit 0

# 2. Lint
npm run lint
# Esperado: 0 errores

# 3. Build
npm run build
# Esperado: sin errores

# 4. Verificación manual (OBLIGATORIO)
# a) Abrir http://localhost:3000
# b) Verificar imagen hero carga con WebP/AVIF automático (DevTools Network)
# c) Verificar CTA en hero funcional (WhatsApp + scroll)
# d) Verificar checkmarks con color más oscuro (green-600)
# e) Verificar navegación teclado: Tab por toda la página, focus ring visible
# f) Verificar CTA en Tasación funcional
# g) Resize a 640px (sm): verificar footer 2 columnas
# h) Resize a 1024px (lg): verificar footer 4 columnas

# 5. Lighthouse (recomendado, NO obligatorio en este sprint)
# npx lighthouse http://localhost:3000 --output=json
# Objetivo: Accessibility >= 90, Performance >= 80
```

### Rollback PR 1
- Feature flag: no aplica (landing pública).
- Revertir: `git revert <commit-hash>` para cada cambio individualmente.
- Los cambios son aditivos y reversibles; no hay migración de datos.

---

## PR 2 — Estética y Motion

### Objetivo
Aplicar tipografía fluida, variación humana controlada, refinamiento de fondos y sistema de animaciones respetando `prefers-reduced-motion`.

### Estado: ⏳ Pendiente (después de PR 1 mergeado)

### Archivos a tocar
| Archivo | Cambio |
|---------|--------|
| `src/app/page.jsx` | Tipografía fluida, offsets humanos, ajustes de gradiente |
| `src/app/globals.css` | Clases de animación con `@keyframes` |

### Cambios planificados

#### 1. Tipografía fluida en Hero
```diff
- <h1 className="text-6xl md:text-8xl font-bold mb-4">DopDop</h1>
+ <h1 className="font-bold mb-4" style={{ fontSize: 'var(--text-hero)' }}>DopDop</h1>

- <h2 className="text-3xl md:text-5xl font-light mb-8">
+ <h2 className="font-light mb-8" style={{ fontSize: 'var(--text-h1)' }}>
```

#### 2. Animación de entrada hero (fade + translateY)
```css
/* En globals.css */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fade-up var(--duration-slow) var(--ease-out) both;
}

/* prefers-reduced-motion ya cubierto por el global de PR 0 */
```

#### 3. Variación humana en highlight boxes
```diff
- <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 p-6 mb-8 rounded-r-lg"
+ <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 p-6 mb-8 rounded-r-lg"
+      style={{ transform: 'translateX(var(--offset-human-sm))' }}>
// Solo en desktop (>md); en mobile sin offset
```

### Checklist de verificación PR 2
```bash
node scripts/contrast-check.js   # exit 0
npm run lint                      # 0 errores
npm run build                     # sin errores

# Manual:
# a) Verificar animación hero con motion habilitado
# b) Verificar que con prefers-reduced-motion la animación no ocurre
# c) Verificar tipografía fluida redimensionando ventana 375px → 1440px
```

---

## PR 3 — Microinteracciones + Archival Index

### Objetivo
Completar microinteracciones, agregar tabla de comparación, refinar footer y resolver links de RRSS.

### Estado: ⏳ Pendiente (después de PR 2 mergeado)

### Archivos a tocar
| Archivo | Cambio |
|---------|--------|
| `src/app/page.jsx` | Componente `ComparisonTable`, transición menu móvil, sección activa nav |
| `src/app/globals.css` | Clases de transición menu |

### Cambios planificados

#### 1. Tabla de comparación en Quiénes Somos
```jsx
// Componente estático (Server Component si se extrae)
<table className="w-full text-sm mt-8 border-collapse">
  <thead>
    <tr className="text-left border-b-2" style={{ borderColor: 'var(--color-brand)' }}>
      <th className="py-3 pr-4">Servicio</th>
      <th className="py-3 pr-4">Tradicional</th>
      <th className="py-3" style={{ color: 'var(--color-brand)' }}>DopDop</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-200">
      <td className="py-3 pr-4">Venta</td>
      <td className="py-3 pr-4">2% del valor</td>
      <td className="py-3 font-semibold" style={{ color: 'var(--color-success)' }}>60 UF fijo</td>
    </tr>
    <!-- etc -->
  </tbody>
</table>
```

#### 2. Transición menu móvil
```css
/* globals.css */
.mobile-menu-enter {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height var(--duration-slow) var(--ease-out),
              opacity var(--duration-base) var(--ease-out);
}
.mobile-menu-enter.open {
  max-height: 400px;
  opacity: 1;
}
```

#### 3. Sección activa en navegación
- Usar `IntersectionObserver` para detectar sección visible.
- Agregar `aria-current="page"` al botón activo.
- Clase visual: `text-white` (ya es el hover) + `border-b-2 border-brand`.
- **Sin cambiar la estructura del handler `scrollToSection`**.

### Checklist de verificación PR 3
```bash
node scripts/contrast-check.js   # exit 0
npm run lint                      # 0 errores  
npm run build                     # sin errores

# Manual:
# a) Verificar tabla de comparación en mobile y desktop
# b) Verificar transición suave del menu móvil
# c) Verificar que al hacer scroll el nav resalta la sección activa
# d) Verificar accesibilidad con solo teclado: Tab + Enter en toda la página
```

---

## Resumen de PRs

| PR | Alcance | Cambios visibles | Riesgo | Estado |
|----|---------|-----------------|--------|--------|
| PR 0 | Tokens, scripts, metadatos | Mínimo (solo tab/SEO) | Muy bajo | ✅ Implementado |
| PR 1 | Money pages, a11y crítica, rendimiento | Sí (hero, colores, footer) | Bajo | ⏳ Pendiente |
| PR 2 | Estética, motion, tipografía fluida | Sí (tipografía, animaciones) | Bajo | ⏳ Pendiente |
| PR 3 | Microinteracciones, archival index | Sí (tabla, menu animado) | Bajo | ⏳ Pendiente |

---

## Comandos de Verificación (Contrato)

```bash
# Contraste WCAG 2.2 (PR 0 — script propio)
node scripts/contrast-check.js

# Contraste — salida JSON para CI
node scripts/contrast-check.js --json

# Lint
npm run lint

# Build de producción
npm run build

# Servidor de desarrollo
npm run dev    # → http://localhost:3000
```

> **NO EJECUTADO en este archivo**: los resultados del build y lint del PR 0 deben verificarse
> manualmente ejecutando los comandos anteriores en el ambiente local/CI.
