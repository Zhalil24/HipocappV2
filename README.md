# HipocApp Web

React + Vite web client for HipocApp. It talks to the
[backend API](https://github.com/Zhalil24/hipocapp-backend) over REST and to its SignalR hub for chat.

## Requirements

- Node.js 22
- A running HipocApp backend

## Setup

```bash
npm ci
```

The API address comes from `VITE_API_URL`. `.env.development` points to the local backend:

```
VITE_API_URL=http://localhost:5000
```

For production builds set `VITE_API_URL` in the build environment or in `.env.production`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:5173 |
| `npm run build` | Type check, then production build into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | Type check only |

## Folder layout

| Folder | Purpose |
|---|---|
| `src/pages` | Pages, one folder per route |
| `src/components` | Reusable UI components |
| `src/layout` | Page layouts (user home, admin panel) |
| `src/store` | Redux Toolkit store and slices |
| `src/core/services` | API client and configuration |
| `src/core/hubService` | SignalR connection |
| `src/core/models` | Request and response types |
| `src/Routers` | Routes and route guards |
| `src/Utilities` | Constants, enums, helpers |
