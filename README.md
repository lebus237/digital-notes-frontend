# DigitalNotes Frontend

A pnpm workspace for the DigitalNotes frontend applications and shared packages.

## Requirements

- Node.js 22.12 or newer
- pnpm 11

## Setup

```sh
pnpm install
```

## Applications

Run an application from the workspace root:

```sh
pnpm dev:admin
pnpm dev:app
pnpm dev:contributor
```

Each app is an independent TanStack Start + React + Vite project with Mantine and Sass modules.

## Checks

```sh
pnpm typecheck
pnpm build
```

## Shared packages

- `shared/core` — shared frontend types and core code
- `shared/i18n` — shared internationalization resources
