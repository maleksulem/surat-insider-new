---
name: Firestore Architect
description: Guidelines for Firestore usage and local fallbacks.
---

# Firestore Architect Skill

Use this skill when working with `firestoreHelper` or backend/database logic.

## Guidelines
- **Proxying**: All Firestore operations must go through `src/server/firestoreHelper.ts`.
- **Fallback**: Always implement the local JSON fallback mechanism if Firestore fails.
- **Security**: Never expose Firestore keys to the frontend.

## When to use
- Database operations, schema design, security rules.
