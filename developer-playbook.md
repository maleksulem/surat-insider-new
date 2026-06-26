# Developer Playbook

## Adding Content
1. **New Destination/Item**: Add to `src/data.ts` or update Firestore directly if enabled.
2. **CMS Content**: Use the administrative dashboard (requires authentication).

## Optimizing Performance
- **Assets**: Use `<img>` with `referrerPolicy="no-referrer"`.
- **Animations**: Use `motion` and `layout` props, memoize complex calculations.
- **Bundle**: Keep `src/pages` and `src/components` light.

## Reviewing PRs
- Check against "Cinematic Luxury" design requirements.
- Verify no layout shifts in Framer Motion animations.
- Ensure Firestore fallback logic is implemented.
