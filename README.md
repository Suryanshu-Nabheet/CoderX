<p align="center">
  <img src="./public/social_preview_index.jpg" alt="CoderX — AI-powered development platform" width="800" />
</p>

<h1 align="center">CoderX</h1>

<p align="center">
  A browser-based AI development workspace for creating, running, and shipping full-stack applications.
</p>

<p align="center">
  <a href="LICENSE">MIT License</a> ·
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="SECURITY.md">Security</a>
</p>

<p align="center">
  <b>Author and lead maintainer:</b> <a href="https://github.com/Suryanshu-Nabheet">Suryanshu Nabheet</a>
</p>

---

## What CoderX is

CoderX brings an AI chat interface, a browser IDE, a terminal, live preview, and deployment workflows into one workspace. Projects run with WebContainers where supported, so a user can move from an idea to a running Node.js application without leaving the browser.

CoderX supports hosted models, local models, and OpenAI-compatible endpoints. Provider credentials can be supplied through server environment variables or configured locally in the Settings panel. Local credentials remain in the browser; they are not exported through server endpoints.

## Capabilities

- AI-assisted coding with a broad set of hosted and local providers.
- Ollama, LM Studio, and configurable OpenAI-compatible local endpoints.
- In-browser file tree, editor, terminal, preview, diff view, and workbench.
- WebContainer-based Node.js development for supported browsers.
- Starter templates for React, Next.js, SvelteKit, Vue, Astro, Expo, and other stacks.
- GitHub, GitLab, Supabase, MCP, Netlify, and Vercel integrations.
- Git proxy controls, request rate limiting, and security wrappers around sensitive routes.
- Provider health checks, model discovery, streaming responses, and model management.

## Architecture at a glance

CoderX is a Remix application built with Vite and React. The main boundaries are:

| Area                  | Responsibility                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| `app/components`      | Browser UI, settings, chat, workbench, editor, and integration controls |
| `app/routes`          | Remix pages and server/API routes                                       |
| `app/lib/modules/llm` | Provider adapters, model discovery, and language-model selection        |
| `app/lib/stores`      | Client state, persistence, provider settings, and workspace state       |
| `app/lib/services`    | Git, deployment, MCP, health monitoring, and integration services       |
| `app/utils`           | Shared utilities, URL normalization, logging, and runtime helpers       |
| `templates`           | Bundled starter projects served locally at runtime                      |
| `public`              | Static assets, icons, and social preview artwork                        |

The application deliberately separates browser configuration from server configuration. Server environment variables are appropriate for deployment-owned provider credentials; browser-configured keys are intended for a trusted local session and are stored in client cookies for the current application flow.

## Requirements

- Node.js 18.18 or newer
- pnpm 9.x
- A Chromium-based browser for the best WebContainer experience
- Optional: Ollama, LM Studio, or another OpenAI-compatible local server

## Quick start

```bash
git clone https://github.com/Suryanshu-Nabheet/CoderX.git
cd CoderX
pnpm install
cp .env.example .env.local
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173). Configure a provider in **Settings**, then select a model in the chat model selector.

The `.env.local` file is optional for a browser-only setup. Do not commit it or place production secrets in `VITE_*` variables unless the value is intentionally public.

## Ollama setup

Ollama is the recommended local provider for running models on your own machine.

1. Install Ollama from [ollama.com/download](https://ollama.com/download).
2. Start the service with `ollama serve` if it is not already running.
3. Download at least one model, for example:

   ```bash
   ollama pull qwen2.5-coder:7b
   # or
   ollama pull llama3.2
   ```

4. Verify Ollama independently:

   ```bash
   curl http://127.0.0.1:11434/api/tags
   ```

5. In CoderX, open **Settings → Local providers**, enable **Ollama**, and use the base URL `http://127.0.0.1:11434`. The URL may also include `/api`; CoderX normalizes it before making requests.
6. Refresh the installed models and choose the discovered model in the chat selector.

When the CoderX page is served in a browser, Ollama must allow that page origin. Set `OLLAMA_ORIGINS` before starting Ollama when needed:

```bash
OLLAMA_ORIGINS=http://localhost:5173,http://127.0.0.1:5173 ollama serve
```

On Windows, configure the same value through the Ollama environment settings before restarting the Ollama application. If the health check succeeds but browser requests fail, inspect the browser console for a CORS error and add the exact CoderX origin to `OLLAMA_ORIGINS`.

## Other local providers

- **LM Studio:** start its local server, normally at `http://127.0.0.1:1234`, then enable LM Studio in Local providers.
- **OpenAI-compatible servers:** choose **OpenAILike** and provide the server base URL, API key if required, and comma-separated model names.

Local model discovery is a browser-to-local-server request, so the browser must be able to reach the configured host and the local server must permit the CoderX origin.

## Environment configuration

Copy `.env.example` to `.env.local` and set only what the deployment needs. Common values include:

```dotenv
OLLAMA_API_BASE_URL=http://127.0.0.1:11434
DEFAULT_NUM_CTX=32768
CODERX_GIT_PROXY_ALLOWED_HOSTS=github.com,gitlab.com,bitbucket.org
```

Most hosted provider keys, Git credentials, deployment tokens, and Supabase credentials are also available through the Settings UI. Review [`.env.example`](.env.example) for the complete list and its comments for security-sensitive options.

MCP `stdio` transport is disabled by default. Enable `CODERX_ALLOW_MCP_STDIO=true` only for a trusted local process and only when the configured MCP command is trusted.

## Development commands

| Command                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `pnpm run dev`         | Start the Vite/Remix development server            |
| `pnpm run build`       | Run the production build pipeline                  |
| `pnpm run build:remix` | Build the Remix application directly               |
| `pnpm run typecheck`   | Run the TypeScript compiler without emitting files |
| `pnpm run lint`        | Run ESLint across `app/`                           |
| `pnpm test`            | Run the Vitest suite once                          |
| `pnpm run test:all`    | Run the repository test script                     |
| `pnpm run clean`       | Clear generated caches and build output            |

Before opening a pull request, run at least `pnpm run typecheck`, `pnpm run lint`, `pnpm test`, and `pnpm run build`.

## Production notes

- Serve CoderX over HTTPS in production and configure deployment secrets through the hosting provider.
- Treat browser-configured API keys as sensitive session data. They are readable by the browser application by design; use server environment variables when a credential must never reach the client.
- Restrict `CODERX_GIT_PROXY_ALLOWED_HOSTS` to the Git hosts your deployment actually needs.
- Keep MCP `stdio` disabled for shared or public deployments.
- Test WebContainer support, local-provider reachability, and OAuth/deployment integrations in the target browser and hosting environment.
- Monitor server logs without printing access tokens or request secrets.

## Repository provenance

CoderX is an actively reworked product built on an open-source browser-development foundation. The current repository includes substantial CoderX-specific branding, product behavior, security hardening, provider work, and integration changes. Existing upstream and third-party license obligations remain important: review [LICENSE](LICENSE) and dependency notices before redistributing a modified build.

## Contributing

Bug reports, fixes, documentation improvements, and provider integrations are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), keep changes focused, add or update tests for behavior changes, and run the validation commands above before submitting a pull request.

## Security

Please report vulnerabilities privately to [suryanshunab@gmail.com](mailto:suryanshunab@gmail.com). Do not open a public issue for an unpatched vulnerability. The project security policy and reporting guidance are in [SECURITY.md](SECURITY.md).

## License

CoderX is released under the MIT License. See [LICENSE](LICENSE) for the license text.
