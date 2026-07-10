/**
 * Server-side environment bindings available to Remix loaders and actions.
 */
interface Env {
  [key: string]: string | undefined;
}
