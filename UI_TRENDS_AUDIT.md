# UI_TRENDS_AUDIT.md — DopDop Landing (Auditoría 2026)

> Stack: Next.js 16.1.4 + Tailwind CSS v4 + lucide-react | Fecha: 2026-03-10

---

## Metodología
Por cada tendencia 2026: **evidencia en código actual → riesgos → recomendación implementable → esfuerzo (S/M/L)**.

Las recomendaciones están ordenadas por impacto en conversión (money pages primero).

---

## Tendencia 1 — Diseño Hecho por Humanos

### Evidencia en código actual
```jsx
// page.jsx — layout completamente regular, sin variación
<section className="py-20 bg-white">          // exactamente igual en todas las secciones
<section className="py-20 bg-gray-50">        // alternancia mecánica blanco/gris
<h3 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#010194' }}>
// 4 secciones de servicio con estructura idéntica: título → lista → highlight → CTAs
```

El diseño es completamente simétrico y repetitivo: misma estructura en 4 secciones, padding uniforme, sin asimetrías ni personalidad visual.

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Layout genérico reduce memorabilidad de marca | Medio |
| Alternancia mecánica de fondo blanco/gris hace el scroll monótono | Bajo |
| Sin variación tipográfica ni de escala → jerarquía plana | Medio |

### Recomendación Implementable
- Introducir offsets tokenizados (`--offset-human-sm/md/lg`) en ítems destacados, nunca en estructura base.
- Usar rotaciones (`--rotate-cw-1`, `--rotate-ccw-1`) solo en elementos decorativos/badges.
- Variar escala tipográfica del hero con `--text-hero` (clamp fluid).
- No tocar la alternancia de fondos (usabilidad de secciones).

### Esfuerzo: **S** (PR 2 — solo transforms/clamp)

---

## Tendencia 2 — Diseño Estratégico (Money Pages)

### Evidencia en código actual
```jsx
// Hero: CTA implícito (solo descripción, sin botón de acción directa)
<p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
  Nuestro compromiso principal es proteger tu patrimonio...
</p>
// No hay CTA en el hero. El usuario debe hacer scroll para encontrar acciones.

// Contacto: texto largo antes de los CTAs (308 chars de copy antes de los botones)
<p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12">
  Nuestro compromiso principal es proteger tu patrimonio...
</p>

// Tasación: única sección sin CTAs de contacto
// (El usuario no puede actuar sobre tasación desde esa sección)
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Hero sin CTA → fricción inicial alta, bounce rate elevado | 🔴 Alta |
| Sección Tasación sin botón de acción → oportunidad de conversión perdida | 🟡 Media |
| Copy largo antes de CTAs en Contacto → reduce clicks | 🟡 Media |
| Sección "Nuestros Servicios" sin ID ni navegación directa | 🟡 Media |

### Recomendación Implementable
1. **Agregar CTA al hero** — 2 botones (WhatsApp + scroll a servicios) debajo del tagline.
2. **Agregar CTA a sección Tasación** — botón "Consultar Tasación" consistente con otras secciones.
3. **Agregar IDs faltantes** — `id="inicio"` al hero, `id="servicios"` al título de servicios.
4. **Reordenar Contacto** — mover CTAs antes del copy largo, o acortar copy.
5. **Sin cambios en handlers** — mantener exactamente `handleWhatsApp()` y `handleEmail()`.

### Esfuerzo: **S** (PR 1 — cambios de estructura JSX, sin CSS nuevo)

---

## Tendencia 3 — Orgánico / Anti-grid

### Evidencia en código actual
```jsx
// Estructura de grid estrictamente regular:
<div className="grid md:grid-cols-4 gap-8 mb-8">  // footer — 4 cols iguales
<div className="space-y-4 mb-8">                   // listas de servicios lineales
<div className="flex flex-col sm:flex-row gap-4">  // CTAs en fila uniforme

// Gradient puramente técnico, sin profundidad orgánica:
style={{ background: 'linear-gradient(135deg, rgba(1,1,148,0.3) ...)' }}
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Grid footer 4 cols iguales puede colapsar mal en breakpoints intermedios (768–1024px) | 🟡 Media |
| No se probó en breakpoints lg/xl (no están en uso) | 🟡 Media |
| Sin uso de `lg:` breakpoint → diseño congelado entre 768px y 1536px | 🟡 Media |

### Recomendación Implementable
- Introducir `lg:grid-cols-4` en footer para mejor control en breakpoints intermedios.
- Usar `md:grid-cols-2` en el footer como estado intermedio (`sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- Offset sutil en secciones hero usando `--offset-human-md` en el wrapper de contenido.

### Esfuerzo: **S** (PR 2 — solo clases Tailwind)

---

## Tendencia 4 — Narrativa de Movimiento

### Evidencia en código actual
```jsx
// Transiciones presentes pero sin sistema:
className="... transition-colors duration-200 ..."   // nav buttons
className="... hover:opacity-90 transition-opacity"  // CTA buttons
className="... hover:bg-gray-800 transition-colors"  // email buttons

// Sin animaciones de entrada (no hay scroll-triggered)
// Sin prefers-reduced-motion
```

```css
/* globals.css actual — sin prefers-reduced-motion */
/* No hay @keyframes ni animaciones definidas */
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Ausencia de `prefers-reduced-motion` en CSS viola WCAG 2.2 SC 2.3.3 | 🔴 Alta |
| Duraciones hardcoded (`duration-200`) sin tokens → inconsistencia futura | 🟡 Media |
| Ninguna animación de entrada → landing estática, sin guía de atención | 🟡 Media |

### Recomendación Implementable
1. **PR 0 — YA IMPLEMENTADO**: `prefers-reduced-motion` global en globals.css que deshabilita todas las transiciones.
2. **PR 2**: Reemplazar `duration-200` por tokens Tailwind que consuman `--duration-base`.
3. **PR 3**: Animaciones de entrada sutiles en hero (fade-in + translateY leve) usando solo `transform/opacity`, respetando `prefers-reduced-motion`.

### Esfuerzo: **M** (PR 2+3)

---

## Tendencia 5 — Glassmorfismo 2.0

### Evidencia en código actual
```jsx
// Navbar: glass presente con fallback implícito (bg-black/95 es casi opaco)
<header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">

// Hero: overlay glass con gradient
<div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent"></div>
<div style={{ background: 'linear-gradient(135deg, rgba(1,1,148,0.3) ...)' }}></div>
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| `backdrop-blur-sm` sin `@supports` fallback explícito en CSS | 🔴 Alta |
| Contraste del texto sobre glass validado en script → ✅ PASA | N/A |
| Sin clase `.glass-surface` para fallback: el CSS de PR 0 no puede matchear el header actual | 🟡 Media |
| `bg-linear-to-r` (Tailwind v4) no documentado en v4 estable | 🟡 Media |

### Recomendación Implementable
1. **PR 0 — YA IMPLEMENTADO**: `@supports not (backdrop-filter)` fallback en globals.css con clase `.glass-surface`.
2. **PR 1**: Agregar clase `glass-surface` al `<header>` para activar el fallback.
3. **PR 2**: Refinar overlay del hero con tokens (`--color-surface-glass-2`).
4. **Verificar `bg-linear-to-r`**: Revisar si es Tailwind v4 canónico o puede generar warning en build.

### Esfuerzo: **S** (PR 1 — solo agregar clase)

---

## Tendencia 6 — Estética de Índice de Archivo

### Evidencia en código actual
```jsx
// Servicios: lista de ítems con checkmark, sin estructura tabular
<ServiceItem text="Costo: 60 UF (Precio único)..." />
<ServiceItem text="Beneficio DopDop: 0% de comisión..." />

// Footer: 4 columnas con info de contacto — cercano al patrón de archivo
// Sin tablas, sin metadatos explícitos, sin etiquetas de precio destacadas
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Precios enterrados en listas de texto → difícil comparación | 🟡 Media |
| Sin tarjetas de precio (pricing cards) → propuesta de valor no visible de un vistazo | 🟡 Media |
| Sin tabla de comparación vs competencia | 🟢 Bajo |

### Recomendación Implementable
- **PR 1**: Crear componente `PricingCard` para cada servicio que destaque el precio (UF) como dato principal, con etiqueta y descripción breve.
- **PR 3**: Agregar tabla de comparación (DopDop vs tradicional) en sección Quiénes Somos.

### Esfuerzo: **M** (PR 1 — nuevo componente, sin deps nuevas)

---

## Tendencia 7 — Microinteracciones con Propósito

### Evidencia en código actual
```jsx
// Hover básico — sin feedback de estado activo ni loading
className="... hover:opacity-90 transition-opacity"  // botones WhatsApp
className="... hover:bg-gray-800 transition-colors"  // botones Email

// Mobile menu: toggle instantáneo sin animación de apertura
{menuOpen && (
  <div className="md:hidden mt-4 pb-4 ...">
    // Aparece/desaparece sin transición
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Menu móvil sin animación de apertura → UX abrupta | 🟡 Media |
| Sin estado `:focus-visible` explícito → accesibilidad teclado degradada | 🔴 Alta |
| Botones CTA sin estado de loading → UX ambigua en acciones async | 🟢 Bajo (no hay async actual) |
| Sin feedback visual para scroll activo en nav (sección activa no marcada) | 🟡 Media |

### Recomendación Implementable
1. **PR 1**: Agregar `:focus-visible` ring a todos los botones usando tokens.
2. **PR 3**: Transición de apertura del menu móvil (`max-height` + `opacity`).
3. **PR 3**: Marcar sección activa en nav con `aria-current` + clase visual.
4. **Sin cambios en handlers** — solo estados CSS y aria attributes.

### Esfuerzo: **S–M** (PR 1 para focus, PR 3 para el resto)

---

## Tendencia 8 — Accesibilidad-First (WCAG 2.2)

### Evidencia en código actual

#### ✅ Bien implementado
```jsx
<button aria-label="Toggle menu">          // hamburger menu
<a aria-label="Facebook">                  // iconos RRSS sin texto
onClick={() => scrollToSection(item.id)}   // semántica botón correcta
```

#### ❌ Problemas detectados
```jsx
// 1. lang="en" en sitio completamente en español — CORREGIDO en PR 0
<html lang="en">  // → debe ser lang="es"

// 2. Imagen hero sin alt descriptivo en español
<img alt="Modern house" ...>   // → debe ser descriptivo del contenido

// 3. Sección hero sin id — no está en el nav
<section className="relative min-h-screen...">  // sin id="inicio"

// 4. text-green-500 falla WCAG 3:1 sobre blanco (ratio: 2.28)
<span className="text-green-500 mt-1">✓</span>  // → usar green-600

// 5. Sin focus-visible estilos explícitos en botones
// Tailwind elimina los estilos por defecto; no hay ring definido

// 6. Sección de servicios sin role="region" ni aria-label

// 7. Footer: links de RRSS con href="#" sin navegación real — trampa de teclado potencial
```

### Riesgos
| Riesgo | Severidad | WCAG SC |
|--------|-----------|---------|
| `lang="en"` en contenido español | 🔴 Alta | 3.1.1 Language of Page |
| `text-green-500` falla contraste 3:1 | 🔴 Alta | 1.4.11 Non-text Contrast |
| Sin `focus-visible` explícito | 🔴 Alta | 2.4.7 Focus Visible |
| `alt="Modern house"` genérico | 🟡 Media | 1.1.1 Non-text Content |
| Links `href="#"` como trampas de foco | 🟡 Media | 2.1.1 Keyboard |

### Recomendación Implementable
1. **PR 0 — IMPLEMENTADO**: `lang="es"` en layout.jsx, metadata actualizada.
2. **PR 1**: `text-green-600` en ServiceItem (usar `--color-success`).
3. **PR 1**: `:focus-visible` ring explícito con token `--color-brand`.
4. **PR 1**: `alt` descriptivo en imagen hero.
5. **PR 1**: `id="inicio"` en hero, `id="servicios"` en sección título.
6. **PR 3**: Links RRSS con `href` reales o `aria-disabled` si no están configurados.

### Esfuerzo: **S** (PR 0+1 — cambios puntuales)

---

## Tendencia 9 — IA como Socio Creativo

### Evidencia en código actual
```json
// package.json — no existe tooling de test
// No jest, no vitest, no playwright, no storybook
// Solo: "lint": "eslint"
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Sin tests → no hay guardrail automático de regresiones | 🟡 Media |
| Sin snapshots visuales → cambios de UI no detectados en CI | 🟢 Bajo |
| Linter puede detectar a11y con `eslint-plugin-jsx-a11y` (no instalado) | 🟡 Media |

### Recomendación Implementable
- **No instalar nuevas suites pesadas** (prohibido por guardrails).
- **Usar `eslint-plugin-jsx-a11y`** si se decide ampliar ESLint (es plugin liviano, no suite).
- **Script existente**: `scripts/contrast-check.js` (PR 0) actúa como test de accesibilidad.
- **Plan de verificación manual** definido en UI_PR_PLAN.md.

### Esfuerzo: **S** (PR 0 — script ya creado)

---

## Tendencia 10 — Creatividad con Prioridad en Rendimiento

### Evidencia en código actual
```jsx
// Imagen hero: sin lazy loading, sin size hints
<img src="/santiago-portada.jpg" alt="Modern house" className="w-full h-full object-cover" />
// → debería ser next/image con priority=true (LCP)

// Inline styles repetidos:
style={{ color: '#010194' }}           // 3 veces
style={{ backgroundColor: '#010194' }} // 3 veces
style={{ borderLeftColor: '#010194' }} // 3 veces
// → infla el DOM con estilos redundantes; consolidar en clase CSS o CSS var

// 'use client' en la página completa
// → el componente entero es client-side, incluyendo secciones estáticas
// → subcomponentes estáticos podrían ser Server Components

// bg-linear-to-r: sintaxis Tailwind v4 no confirmada en docs oficiales
<div className="... bg-linear-to-r from-blue-50 to-blue-100 ...">
// Si no es válida → podría generar CSS inválido sin warning visible
```

### Riesgos
| Riesgo | Severidad |
|--------|-----------|
| Imagen hero sin `<Image>` de Next.js → LCP degradado, sin WebP automático | 🔴 Alta |
| `'use client'` en toda la página → SSR perdido, hidratación pesada | 🟡 Media |
| 9 inline styles repetidos → DOM inflado (CSS-in-JS penalty) | 🟢 Bajo |
| `bg-linear-to-r` no verificado en Tailwind v4 docs | 🟡 Media |

### Recomendación Implementable
1. **PR 1**: Reemplazar `<img>` por `<Image>` de `next/image` con `priority` (LCP).
2. **PR 1**: Extraer `ServiceItem` como Server Component separado (archivo propio).
3. **PR 1**: Consolidar inline styles del brand color en clase CSS usando `--color-brand`.
4. **PR 1**: Verificar `bg-linear-to-r` — si falla, usar `bg-gradient-to-r` compatible.

### Esfuerzo: **S–M** (PR 1)

---

## Resumen Ejecutivo

| Tendencia | Estado Actual | Prioridad | PR |
|-----------|--------------|-----------|-----|
| 1. Diseño humano | ❌ Layout genérico | Media | 2 |
| 2. Diseño estratégico | ❌ Hero sin CTA | 🔴 Alta | 1 |
| 3. Orgánico/anti-grid | ⚠️ Grid básico funcional | Baja | 2 |
| 4. Narrativa de movimiento | ❌ Sin prefers-reduced-motion | 🔴 Alta | 0+2 |
| 5. Glassmorfismo 2.0 | ⚠️ Glass sin fallback explícito | Media | 0+1 |
| 6. Índice de archivo | ❌ Precios enterrados en listas | Media | 1+3 |
| 7. Microinteracciones | ❌ Sin focus-visible | 🔴 Alta | 1+3 |
| 8. Accesibilidad-first | ❌ lang, contraste, focus | 🔴 Alta | 0+1 |
| 9. IA como socio | ⚠️ Solo lint, sin tests | Media | 0 |
| 10. Rendimiento | ❌ Imagen sin next/image | 🔴 Alta | 1 |

### Hallazgos críticos (deben resolverse antes de lanzamiento)
1. 🔴 `lang="es"` — **RESUELTO en PR 0**
2. 🔴 `prefers-reduced-motion` — **RESUELTO en PR 0**
3. 🔴 Imagen hero sin `<Image>` (LCP) — pendiente PR 1
4. 🔴 `text-green-500` falla contraste 3:1 — token corregido en PR 0, aplicar en PR 1
5. 🔴 Sin `:focus-visible` explícito — pendiente PR 1
6. 🔴 Hero sin CTA — pendiente PR 1
