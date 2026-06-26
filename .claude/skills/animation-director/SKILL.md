---
name: Animation Director
description: Guidelines for high-fidelity animations and transitions.
---

# Animation Director Skill

Use this skill when implementing or tuning animations with Framer Motion.

## Guidelines
- **Duration**: Use `transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}` for smooth, high-end feels.
- **Micro-interactions**: Subtle hover states, staggered reveals for lists.
- **Performance**: Use `layout` props, avoid animating layout-shifting properties (`width`, `height`, `top`, `left`). Prefer `scale`, `opacity`, `transform`.

## When to use
- When asked to add, fix, or improve animations.
- When debugging layout shifts or flickering animations.
