# Design System — TenderKit

## Design Philosophy
Calm, professional, minimal. This is a government procurement tool — it needs to convey trust, clarity and efficiency. No gimmicks. Think: Bangladesh government portal meets modern fintech UI.

## Color Palette (Domain: Government / Trust / Official)
Derived from Bangladesh government document aesthetics — deep teal as primary (trust, officiality), warm amber accent (attention/warning), neutral slate for backgrounds.

```css
/* Primary */
--color-primary-50: #f0fdfa;
--color-primary-100: #ccfbf1;
--color-primary-500: #14b8a6;   /* teal-500 — primary brand */
--color-primary-600: #0d9488;   /* teal-600 — hover */
--color-primary-700: #0f766e;   /* teal-700 — pressed */
--color-primary-900: #134e4a;   /* teal-900 — dark text */

/* Accent — for warnings/attention */
--color-accent-400: #fb923c;    /* orange-400 */
--color-accent-500: #f97316;    /* orange-500 */

/* Semantic */
--color-success: #16a34a;       /* green-600 */
--color-warning: #d97706;       /* amber-600 */
--color-error: #dc2626;         /* red-600 */
--color-info: #2563eb;          /* blue-600 */

/* Neutrals (slate family) */
--color-surface: #ffffff;
--color-surface-2: #f8fafc;
--color-surface-3: #f1f5f9;
--color-border: #e2e8f0;
--color-text-primary: #0f172a;
--color-text-secondary: #475569;
--color-text-muted: #94a3b8;

/* Dark mode overrides */
[data-theme="dark"] {
  --color-surface: #0f172a;
  --color-surface-2: #1e293b;
  --color-surface-3: #334155;
  --color-border: #334155;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #64748b;
}
```

## Typography
- **Display font**: "Inter" (from Google Fonts) — clean, modern, excellent Bangla fallback
- **Bangla font**: "Hind Siliguri" — for Bangla UI text
- Type scale (rem based, 16px root):
  - xs: 0.75rem | sm: 0.875rem | base: 1rem | lg: 1.125rem
  - xl: 1.25rem | 2xl: 1.5rem | 3xl: 1.875rem | 4xl: 2.25rem

## Spacing System
8px base unit. Use multiples: 4, 8, 12, 16, 24, 32, 48, 64, 96px

## Layout
- Max-width container: 1280px, centered, px-4 sm:px-6 lg:px-8
- Main grid: 3-column on desktop (left: requirements, center: files, right: status)
- Mobile: stacked single column

## Component Rules

### Cards
- `border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]`
- Subtle shadow: `shadow-sm`
- Consistent padding: `p-4` (small) | `p-6` (medium)
- No decorative borders unless semantic (error = red border)

### Buttons
- Primary: `bg-primary-600 text-white hover:bg-primary-700` with 150ms transition
- Secondary: `border border-border bg-surface hover:bg-surface-3`
- Danger: `bg-error text-white`
- Disabled: `opacity-40 cursor-not-allowed`
- Min height 44px (touch targets)
- Focus: visible ring

### Status Badges
- Missing: `bg-red-50 text-red-700 border-red-200`
- Expiry Needed: `bg-orange-50 text-orange-700 border-orange-200`
- Expired: `bg-red-50 text-red-700 border-red-200`
- Not Provided: `bg-slate-50 text-slate-600 border-slate-200`
- OK: `bg-green-50 text-green-700 border-green-200`

## Motion Rules
- Scroll reveal: `opacity: 0 → 1`, `translateY: 16px → 0`, duration 300ms, ease-out
- Stagger: 50ms between list items
- Hover transitions: 150ms ease
- No layout-shifting animations
- `@media (prefers-reduced-motion: reduce)` → all animations disabled
- GPU-only: transform + opacity

## Responsive Breakpoints
- mobile: 360px+ (base styles)
- sm: 640px (tablet portrait)  
- md: 768px
- lg: 1024px (desktop)
- xl: 1280px (wide)

## Accessibility
- All colors meet WCAG AA (4.5:1 normal text, 3:1 large text)
- Semantic HTML: main, section, nav, button, label, form
- Every interactive element has visible focus ring
- ARIA labels on icon-only buttons
- Alt text on all images
