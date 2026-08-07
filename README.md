<p align="center">
  <img src="./public/social_preview_index.jpg" alt="CoderX — AI-powered development platform" width="800" />
</p>

<h1 align="center">CoderX</h1>

<p align="center">
  Where innovation thrives — build full-stack Node.js apps in the browser with AI assistance.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> ·
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="SECURITY.md">Security</a>
</p>

<p align="center">
  <b>Author & Lead Maintainer:</b> <a href="https://github.com/Suryanshu-Nabheet">Suryanshu Nabheet</a>
</p>

---

CoderX is an AI-powered development platform. It combines an in-browser IDE, WebContainer runtime, 19+ LLM providers, and one-click deploy integrations so you can go from idea to running app without leaving the browser.

## Features

- **AI-assisted development** — Chat-driven code generation with 19+ LLM providers
- **In-browser IDE** — Editor, terminal, preview, diff view, and file tree
- **WebContainer runtime** — Node.js in the browser, no local setup required
- **Starter templates** — 14 bundled stacks (React, Next.js, Expo, SvelteKit, and more)
- **Integrations** — Git, GitHub, GitLab, Supabase, and MCP
- **Deploy** — Netlify, Vercel, GitHub, and GitLab

## Requirements

- [Node.js](https://nodejs.org/) 18.18.0 or later
- [pnpm](https://pnpm.io/) 9.x

## Quick start

```bash
git clone https://github.com/Suryanshu-Nabheet/CoderX.git
cd CoderX
pnpm install
cp .env.example .env.local   # optional
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

API keys can be set in `.env.local` or configured in the in-app **Settings** panel.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build |
| `pnpm test` | Run tests |
| `pnpm run typecheck` | TypeScript check |
| `pnpm run lint` | ESLint |
| `pnpm run clean` | Clear caches and rebuild |

## Configuration

Copy `.env.example` to `.env.local` and set the provider API keys you need. All variables are optional if you configure providers through the Settings UI.

## Project structure

```
app/           Application source (components, routes, lib)
public/        Static assets, icons, and social preview
scripts/       Build utilities (clean)
templates/     Bundled starter project templates (coderx-*)
```

Starter templates are bundled under `templates/` and served locally — no external template repositories at runtime.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, standards, and the PR checklist.

## Security

Report vulnerabilities privately to [suryanshunab@gmail.com](mailto:suryanshunab@gmail.com). Do not open public GitHub issues for security reports. See [SECURITY.md](SECURITY.md) for the full policy.

## License

MIT — see [LICENSE](LICENSE). Bundled starter templates and third-party dependency notices are included there.
