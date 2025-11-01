// vite.config.ts
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/@remix-run+dev@2.16.8_@remix-run+react@2.16.8_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_w7rifulznkxcnl2xvvx3mnhj5a/node_modules/@remix-run/dev/dist/index.js";
import UnoCSS from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/unocss@0.61.9_postcss@8.5.6_rollup@4.45.1_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/unocss/dist/vite.mjs";
import { defineConfig } from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/vite-plugin-node-polyfills@0.22.0_rollup@4.45.1_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { optimizeCssModules } from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/vite-plugin-optimize-css-modules@1.2.0_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/vite-plugin-optimize-css-modules/dist/index.mjs";
import tsconfigPaths from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.8.3_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/vite-tsconfig-paths/dist/index.mjs";
import * as dotenv from "file:///Users/suryanshunabheet/Downloads/CoderX/node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
dotenv.config();
var vite_config_default = defineConfig((config2) => {
  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    },
    build: {
      target: "esnext"
    },
    plugins: [
      nodePolyfills({
        include: ["buffer", "process", "util", "stream"],
        globals: {
          Buffer: true,
          process: true,
          global: true
        },
        protocolImports: true,
        exclude: ["child_process", "fs", "path"]
      }),
      {
        name: "buffer-polyfill",
        transform(code, id) {
          if (id.includes("env.mjs")) {
            return {
              code: `import { Buffer } from 'buffer';
${code}`,
              map: null
            };
          }
          return null;
        }
      },
      config2.mode !== "test" && remixCloudflareDevProxy(),
      remixVitePlugin({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true
        }
      }),
      UnoCSS(),
      tsconfigPaths(),
      chrome129IssuePlugin(),
      config2.mode === "production" && optimizeCssModules({ apply: "build" })
    ],
    envPrefix: [
      "VITE_",
      "OPENAI_LIKE_API_BASE_URL",
      "OPENAI_LIKE_API_MODELS",
      "OLLAMA_API_BASE_URL",
      "LMSTUDIO_API_BASE_URL",
      "TOGETHER_API_BASE_URL"
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    },
    test: {
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/tests/preview/**"
        // Exclude preview tests that require Playwright
      ]
    }
  };
});
function chrome129IssuePlugin() {
  return {
    name: "chrome129IssuePlugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers["user-agent"]?.match(/Chrom(e|ium)\/([0-9]+)\./);
        if (raw) {
          const version = parseInt(raw[2], 10);
          if (version === 129) {
            res.setHeader("content-type", "text/html");
            res.end(
              '<body><h1>Please use Chrome Canary for testing.</h1><p>Chrome 129 has an issue with JavaScript modules & Vite local development, see <a href="https://github.com/Suryanshu-Nabheet/CoderX/issues">for more information.</a></p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>'
            );
            return;
          }
        }
        next();
      });
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VyeWFuc2h1bmFiaGVldC9Eb3dubG9hZHMvQ29kZXJYXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3VyeWFuc2h1bmFiaGVldC9Eb3dubG9hZHMvQ29kZXJYL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdXJ5YW5zaHVuYWJoZWV0L0Rvd25sb2Fkcy9Db2Rlclgvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBjbG91ZGZsYXJlRGV2UHJveHlWaXRlUGx1Z2luIGFzIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5LCB2aXRlUGx1Z2luIGFzIHJlbWl4Vml0ZVBsdWdpbiB9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIFZpdGVEZXZTZXJ2ZXIgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgeyBvcHRpbWl6ZUNzc01vZHVsZXMgfSBmcm9tICd2aXRlLXBsdWdpbi1vcHRpbWl6ZS1jc3MtbW9kdWxlcyc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnO1xuXG4vLyBMb2FkIGVudmlyb25tZW50IHZhcmlhYmxlcyBmcm9tIG11bHRpcGxlIGZpbGVzXG5kb3RlbnYuY29uZmlnKHsgcGF0aDogJy5lbnYubG9jYWwnIH0pO1xuZG90ZW52LmNvbmZpZyh7IHBhdGg6ICcuZW52JyB9KTtcbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChjb25maWcpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IHtcbiAgICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lk5PREVfRU5WKSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgbm9kZVBvbHlmaWxscyh7XG4gICAgICAgIGluY2x1ZGU6IFsnYnVmZmVyJywgJ3Byb2Nlc3MnLCAndXRpbCcsICdzdHJlYW0nXSxcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIEJ1ZmZlcjogdHJ1ZSxcbiAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgICAgIGdsb2JhbDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlLFxuICAgICAgICBleGNsdWRlOiBbJ2NoaWxkX3Byb2Nlc3MnLCAnZnMnLCAncGF0aCddLFxuICAgICAgfSksXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdidWZmZXItcG9seWZpbGwnLFxuICAgICAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2Vudi5tanMnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY29kZTogYGltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XFxuJHtjb2RlfWAsXG4gICAgICAgICAgICAgIG1hcDogbnVsbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29uZmlnLm1vZGUgIT09ICd0ZXN0JyAmJiByZW1peENsb3VkZmxhcmVEZXZQcm94eSgpLFxuICAgICAgcmVtaXhWaXRlUGx1Z2luKHtcbiAgICAgICAgZnV0dXJlOiB7XG4gICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG4gICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcbiAgICAgICAgICB2M19sYXp5Um91dGVEaXNjb3Zlcnk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFVub0NTUygpLFxuICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgY2hyb21lMTI5SXNzdWVQbHVnaW4oKSxcbiAgICAgIGNvbmZpZy5tb2RlID09PSAncHJvZHVjdGlvbicgJiYgb3B0aW1pemVDc3NNb2R1bGVzKHsgYXBwbHk6ICdidWlsZCcgfSksXG4gICAgXSxcbiAgICBlbnZQcmVmaXg6IFtcbiAgICAgICdWSVRFXycsXG4gICAgICAnT1BFTkFJX0xJS0VfQVBJX0JBU0VfVVJMJyxcbiAgICAgICdPUEVOQUlfTElLRV9BUElfTU9ERUxTJyxcbiAgICAgICdPTExBTUFfQVBJX0JBU0VfVVJMJyxcbiAgICAgICdMTVNUVURJT19BUElfQkFTRV9VUkwnLFxuICAgICAgJ1RPR0VUSEVSX0FQSV9CQVNFX1VSTCcsXG4gICAgXSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgdGVzdDoge1xuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnKiovbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgICAnKiovY3lwcmVzcy8qKicsXG4gICAgICAgICcqKi8ue2lkZWEsZ2l0LGNhY2hlLG91dHB1dCx0ZW1wfS8qKicsXG4gICAgICAgICcqKi97a2FybWEscm9sbHVwLHdlYnBhY2ssdml0ZSx2aXRlc3QsamVzdCxhdmEsYmFiZWwsbnljLGN5cHJlc3MsdHN1cCxidWlsZH0uY29uZmlnLionLFxuICAgICAgICAnKiovdGVzdHMvcHJldmlldy8qKicsIC8vIEV4Y2x1ZGUgcHJldmlldyB0ZXN0cyB0aGF0IHJlcXVpcmUgUGxheXdyaWdodFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGNocm9tZTEyOUlzc3VlUGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjaHJvbWUxMjlJc3N1ZVBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgY29uc3QgcmF3ID0gcmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXT8ubWF0Y2goL0Nocm9tKGV8aXVtKVxcLyhbMC05XSspXFwuLyk7XG5cbiAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUludChyYXdbMl0sIDEwKTtcblxuICAgICAgICAgIGlmICh2ZXJzaW9uID09PSAxMjkpIHtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgICAgIHJlcy5lbmQoXG4gICAgICAgICAgICAgICc8Ym9keT48aDE+UGxlYXNlIHVzZSBDaHJvbWUgQ2FuYXJ5IGZvciB0ZXN0aW5nLjwvaDE+PHA+Q2hyb21lIDEyOSBoYXMgYW4gaXNzdWUgd2l0aCBKYXZhU2NyaXB0IG1vZHVsZXMgJiBWaXRlIGxvY2FsIGRldmVsb3BtZW50LCBzZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9TdXJ5YW5zaHUtTmFiaGVldC9Db2RlclgvaXNzdWVzXCI+Zm9yIG1vcmUgaW5mb3JtYXRpb24uPC9hPjwvcD48cD48Yj5Ob3RlOjwvYj4gVGhpcyBvbmx5IGltcGFjdHMgPHU+bG9jYWwgZGV2ZWxvcG1lbnQ8L3U+LiBgcG5wbSBydW4gYnVpbGRgIGFuZCBgcG5wbSBydW4gc3RhcnRgIHdpbGwgd29yayBmaW5lIGluIHRoaXMgYnJvd3Nlci48L3A+PC9ib2R5PicsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBTLFNBQVMsZ0NBQWdDLHlCQUF5QixjQUFjLHVCQUF1QjtBQUNqWixPQUFPLFlBQVk7QUFDbkIsU0FBUyxvQkFBd0M7QUFDakQsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUywwQkFBMEI7QUFDbkMsT0FBTyxtQkFBbUI7QUFDMUIsWUFBWSxZQUFZO0FBR2pCLGNBQU8sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM3QixjQUFPLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDdkIsY0FBTztBQUVkLElBQU8sc0JBQVEsYUFBYSxDQUFDQSxZQUFXO0FBQ3RDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLHdCQUF3QixLQUFLLFVBQVUsUUFBUSxJQUFJLFFBQVE7QUFBQSxJQUM3RDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLGNBQWM7QUFBQSxRQUNaLFNBQVMsQ0FBQyxVQUFVLFdBQVcsUUFBUSxRQUFRO0FBQUEsUUFDL0MsU0FBUztBQUFBLFVBQ1AsUUFBUTtBQUFBLFVBQ1IsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLGlCQUFpQjtBQUFBLFFBQ2pCLFNBQVMsQ0FBQyxpQkFBaUIsTUFBTSxNQUFNO0FBQUEsTUFDekMsQ0FBQztBQUFBLE1BQ0Q7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLFVBQVUsTUFBTSxJQUFJO0FBQ2xCLGNBQUksR0FBRyxTQUFTLFNBQVMsR0FBRztBQUMxQixtQkFBTztBQUFBLGNBQ0wsTUFBTTtBQUFBLEVBQXFDLElBQUk7QUFBQSxjQUMvQyxLQUFLO0FBQUEsWUFDUDtBQUFBLFVBQ0Y7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsTUFDQUEsUUFBTyxTQUFTLFVBQVUsd0JBQXdCO0FBQUEsTUFDbEQsZ0JBQWdCO0FBQUEsUUFDZCxRQUFRO0FBQUEsVUFDTixtQkFBbUI7QUFBQSxVQUNuQixzQkFBc0I7QUFBQSxVQUN0QixxQkFBcUI7QUFBQSxVQUNyQix1QkFBdUI7QUFBQSxRQUN6QjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsT0FBTztBQUFBLE1BQ1AsY0FBYztBQUFBLE1BQ2QscUJBQXFCO0FBQUEsTUFDckJBLFFBQU8sU0FBUyxnQkFBZ0IsbUJBQW1CLEVBQUUsT0FBTyxRQUFRLENBQUM7QUFBQSxJQUN2RTtBQUFBLElBQ0EsV0FBVztBQUFBLE1BQ1Q7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7QUFFRCxTQUFTLHVCQUF1QjtBQUM5QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixnQkFBZ0IsUUFBdUI7QUFDckMsYUFBTyxZQUFZLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztBQUN6QyxjQUFNLE1BQU0sSUFBSSxRQUFRLFlBQVksR0FBRyxNQUFNLDBCQUEwQjtBQUV2RSxZQUFJLEtBQUs7QUFDUCxnQkFBTSxVQUFVLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUVuQyxjQUFJLFlBQVksS0FBSztBQUNuQixnQkFBSSxVQUFVLGdCQUFnQixXQUFXO0FBQ3pDLGdCQUFJO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFFQTtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBRUEsYUFBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbImNvbmZpZyJdCn0K
