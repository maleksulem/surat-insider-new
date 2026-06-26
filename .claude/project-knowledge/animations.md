# Animation System: Framer Motion

## Principles
- **Cinematic Pacing**: Ease curves `[0.22, 1, 0.36, 1]` for high-end feel.
- **Performance (Strict Rules)**:
  - **Allowed**: `opacity`, `transform` (scale, rotate, translate).
  - **Forbidden**: Layout-shifting properties (`width`, `height`, `top`, `left`, `margin`, `padding`).

## Key Components
- `SuratSOTYHero.tsx`: The primary interactive stage. Uses Framer Motion's `useTransform` and `motion` variants for high-performance animations (e.g., diamond navigation).
