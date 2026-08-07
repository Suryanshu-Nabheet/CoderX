# Contributing to CoderX

Thank you for helping improve CoderX. This guide covers local setup, expectations for pull requests, and where to get help.

## Prerequisites

- Node.js 18.18.0+
- pnpm 9.x

## Local setup

```bash
git clone https://github.com/Suryanshu-Nabheet/CoderX.git
cd CoderX
pnpm install
cp .env.example .env.local   # optional
pnpm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

**Never commit `.env.local` or any file containing API keys or tokens.**

## Before you open a PR

1. Branch from `main`.
2. Keep the change focused on a single concern.
3. Run the full check suite:

   ```bash
   pnpm run typecheck
   pnpm test
   pnpm run lint
   ```

4. Update documentation when behavior, configuration, or user-facing flows change.

## Code standards

- Follow existing patterns in the codebase.
- Use TypeScript strictly — avoid `any` unless unavoidable.
- Prefer small, focused functions and clear names.
- Do not include drive-by refactors unrelated to your change.
- Match the surrounding formatting and import style.

## Testing

```bash
pnpm test              # run once (CI mode)
pnpm run test:watch    # watch mode
```

Add or update tests when you change logic that is already covered, or when fixing a regression.

## Environment variables

Server-side keys belong in `.env.local`. See [.env.example](.env.example) for the full list. Provider keys can also be configured in the Settings UI and are stored in browser cookies.

## Project layout (quick reference)

| Path | Purpose |
| --- | --- |
| `app/routes/` | Remix routes, including `api.*` backend endpoints |
| `app/lib/` | Shared logic, stores, hooks, LLM providers |
| `app/components/` | UI components |
| `templates/` | Bundled starter templates (do not fetch from external repos) |

## Contact

- **Email:** [suryanshu.nabheet@gmail.com](mailto:suryanshu.nabheet@gmail.com)
- **GitHub:** [@Suryanshu-Nabheet](https://github.com/Suryanshu-Nabheet)
