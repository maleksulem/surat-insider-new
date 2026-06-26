# CLAUDE.md: Surat Insider Engineering Protocol

## 1. Project Overview
Surat Insider is a premium, cinematic travel platform. 
**Core Philosophy**: "Cinematic Luxury" — Minimalist, high-contrast, editorial magazine aesthetic, with awwwards-level interactions.

## 2. Technical Architecture & Constraints
- **Stack**: Next.js (Vite), TypeScript (Strict), Tailwind CSS, Framer Motion.
- **Backend**: Express.js proxy (`server.ts`).
- **Database**: Firestore (NoSQL). Mandatory fallback mechanism via `firestoreHelper`.
- **Constraint**: **NEVER** expose API keys in frontend. Use the server-side proxy (`/api/*`).

## 3. Engineering Standards
- **TypeScript**: Strict. Interfaces required for all data models. No `any`.
- **CSS**: Tailwind only. No `style` props. No arbitrary values (use `tailwind.config.ts` if needed).
- **Animations**: Framer Motion.
  - Performance: Animate `transform` and `opacity` ONLY.
  - Fluidity: Mandatory easing `[0.22, 1, 0.36, 1]`.
  - **NEVER** animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`). Use `scale` / `position: absolute` for layout-shifting effects.
- **Folder Structure**:
  - `src/components`: UI components.
  - `src/pages`: Feature pages.
  - `src/server`: Backend/API proxies.
  - `src/hooks`: Custom React hooks (memoized).
  - `src/types`: Global interfaces.

## 4. Workflows & Command Standards
- `/audit`: Full Perf + A11y + SEO check.
- `/review`: Code/UI check (uses `.claude/docs/checklists/code-review.md`).
- `/luxury`: Apply design tokens.
- `/perf`: Bundle/Render optimization.
- `/debug`: Backend/Firebase tracing.

## 5. Development Rituals
1. **Plan**: Analyze existing component architecture before adding new logic.
2. **Implement**: Keep modularity high.
3. **Check**: Run `npm run lint`. Verify mobile responsiveness (touch targets ≥ 44px).
4. **Deploy**: Must pass CI/CD pipeline (simulated).

## 6. Strict Prohibitions
- **NEVER** use `console.log` in production code.
- **NEVER** bypass `firestoreHelper`.
- **NEVER** introduce layout shifts.
- **NEVER** use standard/generic UI components; all components must match the "Cinematic Luxury" aesthetic.
