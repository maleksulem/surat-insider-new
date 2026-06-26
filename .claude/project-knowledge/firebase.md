# Firebase & Data Proxy

- **SDKs**: `firebase` (client), `firebase-admin` (server).
- **Communication Pattern**:
  - Never call Firestore from client directly if it requires sensitive keys.
  - Frontend -> `/api/*` (Proxy) -> `src/server/firestoreHelper.ts` -> Cloud Firestore / Local Fallback.
- **Local Fallback**: `src/server/cmsDb.ts` is the single source of truth for the local replica, updated via `firestoreHelper.ts` when Firestore is unavailable.
