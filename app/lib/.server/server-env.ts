/**
 * Server-side environment for Remix loaders and actions.
 * CoderX runs on Node (Vite dev + Electron); all config comes from process.env.
 */
export function getServerEnv(): NodeJS.ProcessEnv {
  return process.env;
}
