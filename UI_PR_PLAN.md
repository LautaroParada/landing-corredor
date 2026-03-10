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

### Estado: ✅ IMPLEMENTADO

### Archivos tocados
| Archivo | Cambio | Visible |
|---------|--------|---------|
| `src/app/page.jsx` | Ver detalle abajo | ✅ Sí |
| `src/app/layout.jsx` | Sin cambios adicionales | — |

### Cambios implementados en `page.jsx`

#### 1. Imagen hero → `<Image>` de Next.js (LCP crítico) ✅
#### 2. CTA en Hero (WhatsApp + scroll a servicios) ✅
#### 3. IDs faltantes: `id="inicio"` y `id="servicios"` ✅
#### 4. Color checkmark → `--color-success` (#16a34a, green-600, WCAG 3.30:1) ✅
#### 5. Clase `glass-surface` en header (activa fallback de PR 0) ✅
#### 6. CTA en sección Tasación ✅
#### 7. Consolidar `style={{ color: '#010194' }}` → CSS variable `var(--color-brand)` ✅
#### 8. Breakpoint intermedio en footer: `sm:grid-cols-2 lg:grid-cols-4` ✅

### Checklist de verificación PR 1
```bash
node scripts/contrast-check.js   # exit 0
npm run lint                      # 0 errores
npm run build                     # sin errores
```

---

## PR 2 — Estética y Motion

### Objetivo
Aplicar tipografía fluida, variación humana controlada, refinamiento de fondos y sistema de animaciones respetando `prefers-reduced-motion`.

### Estado: ✅ IMPLEMENTADO

### Archivos tocados
| Archivo | Cambio |
|---------|--------|
| `src/app/page.jsx` | Tipografía fluida en hero, clase `.animate-fade-up`, offsets humanos en highlight boxes |
| `src/app/globals.css` | `@keyframes fade-up` + clase `.animate-fade-up` |

### Cambios implementados

#### 1. Tipografía fluida en Hero ✅
```jsx
<h1 className="font-bold mb-4" style={{ fontSize: 'var(--text-hero)' }}>DopDop</h1>
<h2 className="font-light mb-8" style={{ fontSize: 'var(--text-h1)' }}>
```

#### 2. Animación de entrada hero (fade + translateY) ✅
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fade-up var(--duration-slow) var(--ease-out) both;
}
/* prefers-reduced-motion cubierto por guardrail global de PR 0 */
```
Aplicado en: `<div className="max-w-3xl animate-fade-up">`

#### 3. Variación humana en los 4 highlight boxes ✅
```jsx
style={{ borderLeftColor: 'var(--color-border-brand)', transform: 'translateX(var(--offset-human-sm))' }}
```
Aplicado en: Venta, Arriendo, Tasación y Administración.

### Checklist de verificación PR 2
```bash
node scripts/contrast-check.js   # exit 0
npm run lint                      # 0 errores
npm run build                     # sin errores
```

---

## PR 3 — Microinteracciones + Archival Index

### Objetivo
Completar microinteracciones, agregar tabla de comparación, refinar footer y resolver links de RRSS.

### Estado: ✅ IMPLEMENTADO

### Archivos tocados
| Archivo | Cambio |
|---------|--------|
| `src/app/page.jsx` | Tabla de comparación, transición menú móvil, sección activa en nav, footer a11y |
| `src/app/globals.css` | `@keyframes mobile-menu-open` + clase `.mobile-menu-enter` |

### Cambios implementados

#### 1. Tabla de comparación en "Quiénes Somos" ✅
Tabla inline con 4 columnas (Servicio / Corredora Tradicional / DopDop) y 4 filas:
- Venta de propiedad: 2% tradicional → 60 UF fijas
- Arriendo: 50–100% primer mes → 15 UF fijas
- Administración mensual: 8–10% mensual → 1,5 UF fijas
- Comisión al comprador/arrendatario: Sí → 0%
Estilo: header DopDop con `--color-brand`, columna DopDop con `--color-brand`, fila "0%" con `--color-success`.

#### 2. Transición menú móvil ✅
> **Nota de implementación:** Se usó `@keyframes mobile-menu-open` con `animation` en lugar del `max-height` + `transition` originalmente planificado. Esto es correcto para el patrón de React `{menuOpen && ...}` (el elemento entra al DOM en cada apertura, disparando la animación automáticamente).
```css
.mobile-menu-enter {
  animation: mobile-menu-open var(--duration-base) var(--ease-out) both;
}
@keyframes mobile-menu-open {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Aplicado en: `<div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 mobile-menu-enter">`

#### 3. Sección activa en navegación (IntersectionObserver) ✅
- `useEffect` + `useRef` importados
- `navItems` movido antes del `useEffect` (dependencia de scope)
- `IntersectionObserver` con `rootMargin: '-40% 0px -55% 0px'`
- `aria-current="page"` en botón activo
- Clase visual: `text-white border-b-2` + `borderBottomColor: 'var(--color-brand)'`
- El handler `scrollToSection` **no fue modificado** ✅

#### 4. Footer RRSS links accesibilidad ✅
Los 5 links placeholder (`href="#"`) reciben `aria-disabled="true"` + `tabIndex={-1}`:
Facebook, Instagram, LinkedIn, YouTube, TikTok.
El link de WhatsApp (href real `https://wa.me/...`) **no fue modificado** ✅

### Checklist de verificación PR 3
```bash
node scripts/contrast-check.js   # exit 0
npm run lint                      # 0 errores
npm run build                     # sin errores

# Manual:
# a) Verificar tabla de comparación en mobile y desktop
# b) Verificar animación de entrada del menú móvil al abrir/cerrar
# c) Verificar que al hacer scroll el nav resalta la sección activa con border-b brand
# d) Verificar aria-current="page" en DevTools al cambiar de sección
# e) Verificar accesibilidad con solo teclado: Tab + Enter en toda la página
# f) Verificar que links RRSS con aria-disabled no reciben foco con Tab
```

---

## Resumen de PRs

| PR | Alcance | Cambios visibles | Riesgo | Estado |
|----|---------|-----------------|--------|--------|
| PR 0 | Tokens, scripts, metadatos | Mínimo (solo tab/SEO) | Muy bajo | ✅ Implementado |
| PR 1 | Money pages, a11y crítica, rendimiento | Sí (hero, colores, footer) | Bajo | ✅ Implementado |
| PR 2 | Estética, motion, tipografía fluida | Sí (tipografía, animaciones) | Bajo | ✅ Implementado |
| PR 3 | Microinteracciones, archival index | Sí (tabla, menu animado) | Bajo | ✅ Implementado |

**🎉 Todos los PRs de la Fase 2026 han sido implementados.**

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

> **NO EJECUTADO en este archivo**: los resultados del build y lint de cada PR deben verificarse
> manualmente ejecutando los comandos anteriores en el ambiente local/CI.