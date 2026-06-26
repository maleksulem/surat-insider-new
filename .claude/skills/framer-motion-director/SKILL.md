---
name: Framer Motion Director
description: Guidelines for high-fidelity animations and transitions.
---

# Framer Motion Director Skill

Use this skill when implementing or tuning animations with Framer Motion.

## Guidelines
- **Duration**: `transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}`.
- **Performance**: Animate `transform`, `opacity`. NEVER animate `width`, `height`, `top`, `left`, `margin`. Use `scale` or `position: absolute`.
- **Fluidity**: Focus on smooth, deliberate transitions.

## When to use
- Adding, fixing, or improving animations.
- Debugging layout shifts or flickering.
