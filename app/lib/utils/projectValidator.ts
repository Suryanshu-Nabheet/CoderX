/**
 * Project Structure Validator
 * Ensures projects are properly initialized before allowing code generation
 */

export interface ProjectValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ProjectStructure {
  hasPackageJson: boolean;
  hasIndexHtml: boolean;
  hasViteConfig: boolean;
  hasNextConfig: boolean;
  hasAngularJson: boolean;
  hasMainFile: boolean;
  hasAppFile: boolean;
  projectType: 'react' | 'nextjs' | 'vue' | 'angular' | 'vanilla' | 'unknown';
}

export function analyzeProjectStructure(files: Record<string, any>): ProjectStructure {
  const filePaths = Object.keys(files);

  return {
    hasPackageJson: filePaths.some((path) => path.endsWith('package.json')),
    hasIndexHtml: filePaths.some((path) => path.endsWith('index.html')),
    hasViteConfig: filePaths.some((path) => path.includes('vite.config')),
    hasNextConfig: filePaths.some((path) => path.includes('next.config')),
    hasAngularJson: filePaths.some((path) => path.endsWith('angular.json')),
    hasMainFile: filePaths.some(
      (path) =>
        path.includes('src/main.') ||
        path.includes('src/index.') ||
        path.includes('pages/_app.') ||
        path.includes('app/layout.'),
    ),
    hasAppFile: filePaths.some(
      (path) =>
        path.includes('src/App.') ||
        path.includes('src/app.component.') ||
        path.includes('pages/_app.') ||
        path.includes('app/layout.'),
    ),
    projectType: detectProjectType(filePaths),
  };
}

function detectProjectType(filePaths: string[]): ProjectStructure['projectType'] {
  if (filePaths.some((path) => path.includes('next.config'))) {
    return 'nextjs';
  }

  if (filePaths.some((path) => path.includes('angular.json'))) {
    return 'angular';
  }

  if (filePaths.some((path) => path.includes('src/App.vue'))) {
    return 'vue';
  }

  if (filePaths.some((path) => path.includes('src/App.jsx') || path.includes('src/App.tsx'))) {
    return 'react';
  }

  if (filePaths.some((path) => path.includes('package.json'))) {
    return 'vanilla';
  }

  return 'unknown';
}

export function validateProjectStructure(structure: ProjectStructure): ProjectValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Critical errors - project cannot run
  if (!structure.hasPackageJson) {
    errors.push('Missing package.json - project cannot be initialized');
    suggestions.push('Create a package.json file with proper dependencies and scripts');
  }

  // Framework-specific validation
  switch (structure.projectType) {
    case 'react':
      if (!structure.hasIndexHtml) {
        errors.push('React project missing index.html');
        suggestions.push('Create index.html as the entry point');
      }

      if (!structure.hasViteConfig) {
        warnings.push('React project missing vite.config.js');
        suggestions.push('Create vite.config.js for proper build configuration');
      }

      if (!structure.hasMainFile) {
        errors.push('React project missing main entry file');
        suggestions.push('Create src/main.jsx or src/main.tsx');
      }

      if (!structure.hasAppFile) {
        errors.push('React project missing App component');
        suggestions.push('Create src/App.jsx or src/App.tsx');
      }

      break;

    case 'nextjs':
      if (!structure.hasNextConfig) {
        warnings.push('Next.js project missing next.config.js');
        suggestions.push('Create next.config.js for proper configuration');
      }

      if (!structure.hasMainFile && !structure.hasAppFile) {
        errors.push('Next.js project missing app or pages structure');
        suggestions.push('Create either pages/_app.js or app/layout.js');
      }

      break;

    case 'vue':
      if (!structure.hasIndexHtml) {
        errors.push('Vue project missing index.html');
        suggestions.push('Create index.html as the entry point');
      }

      if (!structure.hasViteConfig) {
        warnings.push('Vue project missing vite.config.js');
        suggestions.push('Create vite.config.js for proper build configuration');
      }

      if (!structure.hasMainFile) {
        errors.push('Vue project missing main entry file');
        suggestions.push('Create src/main.js or src/main.ts');
      }

      if (!structure.hasAppFile) {
        errors.push('Vue project missing App component');
        suggestions.push('Create src/App.vue');
      }

      break;

    case 'angular':
      if (!structure.hasAngularJson) {
        errors.push('Angular project missing angular.json');
        suggestions.push('Create angular.json configuration file');
      }

      if (!structure.hasMainFile) {
        errors.push('Angular project missing main entry file');
        suggestions.push('Create src/main.ts');
      }

      if (!structure.hasAppFile) {
        errors.push('Angular project missing app component');
        suggestions.push('Create src/app/app.component.ts');
      }

      break;

    case 'vanilla':
      if (!structure.hasIndexHtml) {
        warnings.push('Vanilla project missing index.html');
        suggestions.push('Create index.html as the entry point');
      }

      break;

    case 'unknown':
      if (structure.hasPackageJson) {
        warnings.push('Project type could not be determined');
        suggestions.push('Ensure proper project structure for the intended framework');
      }

      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

export function getProjectInitializationTemplate(projectType: ProjectStructure['projectType']): Record<string, string> {
  const templates: Record<ProjectStructure['projectType'], Record<string, string>> = {
    react: {
      'package.json': JSON.stringify(
        {
          name: 'react-app',
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
          devDependencies: {
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0',
            '@vitejs/plugin-react': '^4.0.0',
            vite: '^4.4.0',
          },
        },
        null,
        2,
      ),
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
      'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      'src/App.jsx': `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>React App</h1>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </div>
  )
}

export default App`,
      'src/App.css': `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.App {
  padding: 2rem;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}`,
      'src/index.css': `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}`,
    },
    nextjs: {
      'package.json': JSON.stringify(
        {
          name: 'nextjs-app',
          version: '0.1.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            lint: 'next lint',
          },
          dependencies: {
            next: '13.4.0',
            react: '18.2.0',
            'react-dom': '18.2.0',
          },
          devDependencies: {
            '@types/node': '20.4.0',
            '@types/react': '18.2.0',
            '@types/react-dom': '18.2.0',
            eslint: '8.45.0',
            'eslint-config-next': '13.4.0',
            typescript: '5.1.0',
          },
        },
        null,
        2,
      ),
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,
      'app/layout.js': `export const metadata = {
  title: 'Next.js App',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      'app/page.js': `export default function Home() {
  return (
    <div>
      <h1>Next.js App</h1>
      <p>Welcome to your Next.js application!</p>
    </div>
  )
}`,
    },
    vue: {
      'package.json': JSON.stringify(
        {
          name: 'vue-app',
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            vue: '^3.3.0',
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^4.2.0',
            vite: '^4.4.0',
          },
        },
        null,
        2,
      ),
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
      'vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`,
      'src/main.js': `import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')`,
      'src/App.vue': `<template>
  <div class="app">
    <h1>Vue App</h1>
    <button @click="count++">count is {{ count }}</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const count = ref(0)
    return { count }
  }
}
</script>

<style scoped>
.app {
  padding: 2rem;
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}
</style>`,
      'src/style.css': `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}`,
    },
    angular: {
      'package.json': JSON.stringify(
        {
          name: 'angular-app',
          version: '0.0.0',
          scripts: {
            ng: 'ng',
            start: 'ng serve',
            build: 'ng build',
            watch: 'ng build --watch --configuration development',
            test: 'ng test',
          },
          dependencies: {
            '@angular/animations': '^16.0.0',
            '@angular/common': '^16.0.0',
            '@angular/compiler': '^16.0.0',
            '@angular/core': '^16.0.0',
            '@angular/forms': '^16.0.0',
            '@angular/platform-browser': '^16.0.0',
            '@angular/platform-browser-dynamic': '^16.0.0',
            '@angular/router': '^16.0.0',
            rxjs: '~7.8.0',
            tslib: '^2.3.0',
            'zone.js': '~0.13.0',
          },
          devDependencies: {
            '@angular-devkit/build-angular': '^16.0.0',
            '@angular/cli': '^16.0.0',
            '@angular/compiler-cli': '^16.0.0',
            '@types/jasmine': '~4.3.0',
            '@types/node': '^18.7.0',
            'jasmine-core': '~4.6.0',
            karma: '~6.4.0',
            'karma-chrome-launcher': '~3.1.0',
            'karma-coverage': '~2.2.0',
            'karma-jasmine': '~5.1.0',
            'karma-jasmine-html-reporter': '~2.1.0',
            typescript: '~5.1.0',
          },
        },
        null,
        2,
      ),
      'angular.json': JSON.stringify(
        {
          $schema: './node_modules/@angular/cli/lib/config/schema.json',
          version: 1,
          newProjectRoot: 'projects',
          projects: {
            'angular-app': {
              projectType: 'application',
              schematics: {},
              root: '',
              sourceRoot: 'src',
              prefix: 'app',
              architect: {
                build: {
                  builder: '@angular-devkit/build-angular:browser',
                  options: {
                    outputPath: 'dist/angular-app',
                    index: 'src/index.html',
                    main: 'src/main.ts',
                    polyfills: ['zone.js'],
                    tsConfig: 'tsconfig.app.json',
                    assets: ['src/favicon.ico', 'src/assets'],
                    styles: ['src/styles.css'],
                    scripts: [],
                  },
                  configurations: {
                    production: {
                      budgets: [
                        {
                          type: 'initial',
                          maximumWarning: '500kb',
                          maximumError: '1mb',
                        },
                        {
                          type: 'anyComponentStyle',
                          maximumWarning: '2kb',
                          maximumError: '4kb',
                        },
                      ],
                      outputHashing: 'all',
                    },
                    development: {
                      buildOptimizer: false,
                      optimization: false,
                      vendorChunk: true,
                      extractLicenses: false,
                      sourceMap: true,
                      namedChunks: true,
                    },
                  },
                  defaultConfiguration: 'production',
                },
                serve: {
                  builder: '@angular-devkit/build-angular:dev-server',
                  configurations: {
                    production: {
                      buildTarget: 'angular-app:build:production',
                    },
                    development: {
                      buildTarget: 'angular-app:build:development',
                    },
                  },
                  defaultConfiguration: 'development',
                },
              },
            },
          },
        },
        null,
        2,
      ),
      'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);`,
      'src/app/app.component.ts': `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="app">
      <h1>Angular App</h1>
      <button (click)="increment()">count is {{ count }}</button>
    </div>
  \`,
  styles: [\`
    .app {
      padding: 2rem;
      text-align: center;
    }
    
    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      color: white;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    
    button:hover {
      border-color: #646cff;
    }
  \`]
})
export class AppComponent {
  count = 0;
  
  increment() {
    this.count++;
  }
}`,
      'src/index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`,
      'src/styles.css': `/* Global styles */
body {
  margin: 0;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  background-color: #242424;
  color: rgba(255, 255, 255, 0.87);
}`,
    },
    vanilla: {
      'package.json': JSON.stringify(
        {
          name: 'vanilla-app',
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          devDependencies: {
            vite: '^4.4.0',
          },
        },
        null,
        2,
      ),
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vanilla App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
      'vite.config.js': `import { defineConfig } from 'vite'

export default defineConfig({
  // config options
})`,
      'src/main.js': `import './style.css'

document.querySelector('#app').innerHTML = \`
  <div>
    <h1>Vanilla App</h1>
    <button id="counter">count is 0</button>
  </div>
\`

let count = 0
const button = document.querySelector('#counter')

button.addEventListener('click', () => {
  count++
  button.textContent = \`count is \${count}\`
})`,
      'src/style.css': `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}`,
    },
    unknown: {},
  };

  return templates[projectType] || {};
}
