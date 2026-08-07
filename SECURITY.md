# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x.x | Yes |
| &lt; 1.0 | No |

## Reporting a vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Email [suryanshunab@gmail.com](mailto:suryanshunab@gmail.com) with:

- A description of the issue and its potential impact
- Steps to reproduce
- Affected files, routes, or configuration (include commit hash or branch if relevant)
- Proof-of-concept or exploit details, if available

You should receive a response within 48 hours. If you do not, send a follow-up to confirm delivery.

We will acknowledge valid reports, work on a fix, and credit reporters in advisories unless you prefer to remain anonymous.

## Scope

This policy covers the CoderX application repository, including:

- Remix API routes under `app/routes/api.*`
- Server-side LLM and integration handlers
- Bundled starter templates under `templates/`

## Security practices for users and contributors

1. **Secrets** — Never commit API keys, tokens, or `.env.local`. Use environment variables or the in-app Settings UI.
2. **Dependencies** — Keep `pnpm-lock.yaml` up to date and review dependency changes in PRs.
3. **Production** — Serve CoderX over HTTPS when exposed beyond localhost.
4. **API keys in the browser** — Keys configured in Settings are stored in cookies; treat shared machines and exported settings files as sensitive.

## Built-in protections

- Rate limiting on API routes (see `app/lib/security.ts`)
- Security headers on wrapped API responses
- Server-side proxying for selected third-party APIs (GitHub, GitLab, etc.) to avoid exposing tokens in client code where proxied
- Input sanitization and error message redaction in production

## Contact

- **Email:** [suryanshunab@gmail.com](mailto:suryanshunab@gmail.com)
- **GitHub:** [@Suryanshu-Nabheet](https://github.com/Suryanshu-Nabheet)
