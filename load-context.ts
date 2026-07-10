type CloudflareContext = {
  env: Env;
  ctx?: ExecutionContext;
  cf?: IncomingRequestCfProperties;
};

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: CloudflareContext;
  }
}

export {};
