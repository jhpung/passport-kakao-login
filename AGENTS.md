# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

Passport OAuth2 strategy for Kakao Login, written in TypeScript, built with Rollup as dual CJS/ESM, published to npm as `passport-kakao-login`.

## Setup

```sh
npm install
```

Requires Node.js >=22 (see `engines` in `package.json`).

## Commands

```sh
npm run build          # rollup -> dist/index.cjs, dist/index.mjs, dist/index.d.ts
npm test               # vitest
npm run test:coverage  # vitest --coverage, 90% threshold enforced
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run format:check   # prettier --check
```

Run `typecheck`, `lint`, `format:check`, and `test:coverage` before committing. CI (`.github/workflows/ci.yml`) runs the same checks across Node 22/24/26.

## Code style

- ESLint config: `eslint.config.mjs`, based on `eslint-config-google` + `typescript-eslint` recommended, with `eslint-config-prettier` disabling stylistic conflicts.
- Formatting is Prettier-owned (`.prettierrc`); don't hand-format against it.
- TypeScript `strict: true`. Avoid `any`; prefer `unknown` with narrowing.

## Testing

- Framework: vitest. Tests live under `test/`, mirroring `src/`.
- Keep coverage at or above the 90% threshold configured in `vitest.config.ts`.
- Cover error paths (OAuth2 request failures, malformed JSON) in addition to the happy path.

## Commit messages

- Write commit messages in English, imperative mood (e.g. `Fix nickname fallback for unlinked accounts`).
- Keep the subject line under ~70 characters; add a body when the change needs explaining why, not just what.
- No AI-generated signatures or co-author trailers.

## Docs

- `README.md` is the primary, English documentation. `README-ko.md` is the Korean translation. Update both when usage-facing behavior changes.

## Release process

1. Bump `version` in `package.json`.
2. Commit and push to `main`.
3. Create a GitHub Release with a `vX.Y.Z` tag matching the version.
4. `.github/workflows/release.yml` runs the full check suite and publishes to npm via Trusted Publishing (OIDC) — no npm token is stored in this repo.
