# Contributing

Thank you for contributing to CoderX.

## Getting started

```bash
git clone https://github.com/Suryanshu-Nabheet/CoderX.git
cd CoderX
pnpm install
cp .env.example .env.local   # optional
pnpm run dev
```

Never commit `.env.local`.

## Before submitting a PR

1. Branch from `main`.
2. Run `pnpm run typecheck`, `pnpm test`, and `pnpm run lint`.
3. Keep changes focused on a single concern.
4. Update documentation when behavior changes.

## Code standards

- Follow existing patterns in the codebase.
- Use TypeScript strictly.
- Keep functions small and names descriptive.
- Avoid drive-by refactors unrelated to your change.

## Testing

```bash
pnpm test
pnpm run test:watch   # watch mode
```

## Environment variables

Optional server-side keys go in `.env.local`. See `.env.example` for the full list. Provider keys can also be set in the Settings UI and are stored in browser cookies.

## Contact

- Email: suryanshu.nabheet@gmail.com
- GitHub: [@Suryanshu-Nabheet](https://github.com/Suryanshu-Nabheet)
