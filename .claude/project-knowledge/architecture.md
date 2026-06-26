# Project Architecture: Surat Insider

## Overview
Surat Insider is a premium travel discovery platform built with React (Vite SPA) and an Express.js backend. The architecture enforces a strict server-side proxy for API interactions to secure credentials.

## Frontend (Client-Side)
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS (Utility-first)
- **Animation**: Framer Motion (High-fidelity, cinematic transitions)
- **State Management**: React State/Context, local CMS fallback

## Backend (Server-Side)
- **Entry Point**: `server.ts`
- **Infrastructure**: Express.js
- **Routing**: API routes (`/api/*`) for data fetching and administrative tasks.
- **Vite Integration**: Middleware for SPA development serving.

## Database
- **Primary**: Cloud Firestore
- **Fallback**: Local file-based CMS replica (managed in `src/server/cmsDb.ts`)
- **Abstraction**: `src/server/firestoreHelper.ts` (Crucial: all DB interactions must route through this)
