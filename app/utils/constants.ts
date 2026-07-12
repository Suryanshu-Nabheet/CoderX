import { LLMManager } from '~/lib/modules/llm/manager';
import type { Template } from '~/types/template';

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'coderx_file_modifications';
export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const PROVIDER_REGEX = /\[Provider: (.*?)\]\n\n/;
export const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';
export const PROMPT_COOKIE_KEY = 'cachedPrompt';
export const TOOL_EXECUTION_APPROVAL = {
  APPROVE: 'Yes, approved.',
  REJECT: 'No, rejected.',
} as const;
export const TOOL_NO_EXECUTE_FUNCTION = 'Error: No execute function found on tool';
export const TOOL_EXECUTION_DENIED = 'Error: User denied access to tool execution';
export const TOOL_EXECUTION_ERROR = 'Error: An error occured while calling tool';

const llmManager = LLMManager.getInstance(import.meta.env);

export const PROVIDER_LIST = llmManager.getAllProviders();
export const DEFAULT_PROVIDER = llmManager.getDefaultProvider();

export const providerBaseUrlEnvKeys: Record<string, { baseUrlKey?: string; apiTokenKey?: string }> = {};
PROVIDER_LIST.forEach((provider) => {
  providerBaseUrlEnvKeys[provider.name] = {
    baseUrlKey: provider.config.baseUrlKey,
    apiTokenKey: provider.config.apiTokenKey,
  };
});

/*
 * CoderX starter templates — bundled locally in /templates.
 */
export const STARTER_TEMPLATES: Template[] = [
  {
    name: 'Expo App',
    label: 'Expo App',
    description: 'Expo starter template for building cross-platform mobile apps',
    templateId: 'coderx-expo-template',
    tags: ['mobile', 'expo', 'mobile-app', 'android', 'iphone'],
    icon: 'i-coderx:expo',
  },
  {
    name: 'Basic Astro',
    label: 'Astro Basic',
    description: 'Lightweight Astro starter template for building fast static websites',
    templateId: 'coderx-astro-basic-template',
    tags: ['astro', 'blog', 'performance'],
    icon: 'i-coderx:astro',
  },
  {
    name: 'NextJS Shadcn',
    label: 'Next.js with shadcn/ui',
    description: 'Next.js starter fullstack template integrated with shadcn/ui components and styling system',
    templateId: 'coderx-nextjs-shadcn-template',
    tags: ['nextjs', 'react', 'typescript', 'shadcn', 'tailwind'],
    icon: 'i-coderx:nextjs',
  },
  {
    name: 'Vite Shadcn',
    label: 'Vite with shadcn/ui',
    description: 'Vite starter fullstack template integrated with shadcn/ui components and styling system',
    templateId: 'coderx-vite-shadcn',
    tags: ['vite', 'react', 'typescript', 'shadcn', 'tailwind'],
    icon: 'i-coderx:shadcn',
  },
  {
    name: 'Qwik Typescript',
    label: 'Qwik TypeScript',
    description: 'Qwik framework starter with TypeScript for building resumable applications',
    templateId: 'coderx-qwik-ts-template',
    tags: ['qwik', 'typescript', 'performance', 'resumable'],
    icon: 'i-coderx:qwik',
  },
  {
    name: 'Remix Typescript',
    label: 'Remix TypeScript',
    description: 'Remix framework starter with TypeScript for full-stack web applications',
    templateId: 'coderx-remix-ts-template',
    tags: ['remix', 'typescript', 'fullstack', 'react'],
    icon: 'i-coderx:remix',
  },
  {
    name: 'Slidev',
    label: 'Slidev Presentation',
    description: 'Slidev starter template for creating developer-friendly presentations using Markdown',
    templateId: 'coderx-slidev-template',
    tags: ['slidev', 'presentation', 'markdown'],
    icon: 'i-coderx:slidev',
  },
  {
    name: 'Sveltekit',
    label: 'SvelteKit',
    description: 'SvelteKit starter template for building fast, efficient web applications',
    templateId: 'coderx-sveltekit-template',
    tags: ['svelte', 'sveltekit', 'typescript'],
    icon: 'i-coderx:svelte',
  },
  {
    name: 'Vanilla Vite',
    label: 'Vanilla + Vite',
    description: 'Minimal Vite starter template for vanilla JavaScript projects',
    templateId: 'coderx-vanilla-vite',
    tags: ['vite', 'vanilla-js', 'minimal'],
    icon: 'i-coderx:vite',
  },
  {
    name: 'Vite React',
    label: 'React + Vite + typescript',
    description: 'React starter template powered by Vite for fast development experience',
    templateId: 'coderx-vite-react-ts',
    tags: ['react', 'vite', 'frontend', 'website', 'app'],
    icon: 'i-coderx:react',
  },
  {
    name: 'Vite Typescript',
    label: 'Vite + TypeScript',
    description: 'Vite starter template with TypeScript configuration for type-safe development',
    templateId: 'coderx-vite-ts',
    tags: ['vite', 'typescript', 'minimal'],
    icon: 'i-coderx:typescript',
  },
  {
    name: 'Vue',
    label: 'Vue.js',
    description: 'Vue.js starter template with modern tooling and best practices',
    templateId: 'coderx-vue',
    tags: ['vue', 'typescript', 'frontend'],
    icon: 'i-coderx:vue',
  },
  {
    name: 'Angular',
    label: 'Angular Starter',
    description: 'A modern Angular starter template with TypeScript support and best practices configuration',
    templateId: 'coderx-angular',
    tags: ['angular', 'typescript', 'frontend', 'spa'],
    icon: 'i-coderx:angular',
  },
  {
    name: 'SolidJS',
    label: 'SolidJS Tailwind',
    description: 'Lightweight SolidJS starter template for building fast static websites',
    templateId: 'coderx-solidjs',
    tags: ['solidjs'],
    icon: 'i-coderx:solidjs',
  },
];
