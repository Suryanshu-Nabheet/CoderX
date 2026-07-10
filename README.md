# CoderX

AI-powered development platform for building full-stack Node.js applications in the browser with LLM assistance.

## Requirements

- Node.js 18.18.0 or later
- pnpm 9.x

## Quick start

```bash
git clone https://github.com/Suryanshu-Nabheet/CoderX.git
cd CoderX
pnpm install
cp .env.example .env.local   # optional
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

API keys can be set in `.env.local` or configured in the in-app Settings panel.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build |
| `pnpm test` | Run tests |
| `pnpm run typecheck` | TypeScript check |
| `pnpm run lint` | ESLint |
| `pnpm run clean` | Clear caches and rebuild |
| `pnpm run electron:dev` | Electron development mode |
| `pnpm electron:build:dist` | Build desktop app for all platforms |

## Configuration

Copy `.env.example` to `.env.local` and set the provider API keys you need. All variables are optional if you configure providers through the Settings UI.

## Project structure

```
app/           Application source (components, routes, lib)
electron/      Desktop app (main, preload)
public/        Static assets
scripts/       Build utilities
```

## Features

- 19+ LLM providers with extensible provider architecture
- In-browser IDE with terminal, preview, and diff view
- WebContainer-based Node.js runtime
- Git, Supabase, and MCP integrations
- Deploy to Netlify, Vercel, GitHub, and GitLab
- Electron desktop builds

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md). Report vulnerabilities to suryanshu.nabheet@gmail.com — not via public issues.

## License

MIT — see [LICENSE](LICENSE).
