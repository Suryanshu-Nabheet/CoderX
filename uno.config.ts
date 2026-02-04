import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./icons/*.svg');

const collectionName = 'coderx';

const customIconCollection = iconPaths.reduce(
  (acc, iconPath) => {
    const [iconName] = basename(iconPath).split('.');

    acc[collectionName] ??= {};
    acc[collectionName][iconName] = async () => fs.readFile(iconPath, 'utf8');

    return acc;
  },
  {} as Record<string, Record<string, () => Promise<string>>>,
);

const BASE_COLORS = {
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  accent: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  orange: {
    50: '#FFFAEB',
    100: '#FEEFC7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#792E0D',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
};

const COLOR_PRIMITIVES = {
  ...BASE_COLORS,
  alpha: {
    white: generateAlphaPalette(BASE_COLORS.white),
    gray: generateAlphaPalette(BASE_COLORS.gray[900]),
    red: generateAlphaPalette(BASE_COLORS.red[500]),
    accent: generateAlphaPalette(BASE_COLORS.accent[500]),
  },
};

export default defineConfig({
  safelist: [...Object.keys(customIconCollection[collectionName] || {}).map((x) => `i-coderx:${x}`)],
  shortcuts: {
    'coderx-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color] duration-150 coderx-ease-cubic-bezier',
    kdb: 'bg-coderx-elements-code-background text-coderx-elements-code-text py-1 px-1.5 rounded-md',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    /**
     * This shorthand doesn't exist in Tailwind and we overwrite it to avoid
     * any conflicts with minified CSS classes.
     */
    ['b', {}],
  ],
  theme: {
    colors: {
      ...COLOR_PRIMITIVES,
      coderx: {
        elements: {
          borderColor: 'var(--coderx-elements-borderColor)',
          borderColorActive: 'var(--coderx-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--coderx-elements-bg-depth-1)',
              2: 'var(--coderx-elements-bg-depth-2)',
              3: 'var(--coderx-elements-bg-depth-3)',
              4: 'var(--coderx-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--coderx-elements-textPrimary)',
          textSecondary: 'var(--coderx-elements-textSecondary)',
          textTertiary: 'var(--coderx-elements-textTertiary)',
          code: {
            background: 'var(--coderx-elements-code-background)',
            text: 'var(--coderx-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--coderx-elements-button-primary-background)',
              backgroundHover: 'var(--coderx-elements-button-primary-backgroundHover)',
              text: 'var(--coderx-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--coderx-elements-button-secondary-background)',
              backgroundHover: 'var(--coderx-elements-button-secondary-backgroundHover)',
              text: 'var(--coderx-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--coderx-elements-button-danger-background)',
              backgroundHover: 'var(--coderx-elements-button-danger-backgroundHover)',
              text: 'var(--coderx-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--coderx-elements-item-contentDefault)',
            contentActive: 'var(--coderx-elements-item-contentActive)',
            contentAccent: 'var(--coderx-elements-item-contentAccent)',
            contentDanger: 'var(--coderx-elements-item-contentDanger)',
            backgroundDefault: 'var(--coderx-elements-item-backgroundDefault)',
            backgroundActive: 'var(--coderx-elements-item-backgroundActive)',
            backgroundAccent: 'var(--coderx-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--coderx-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--coderx-elements-actions-background)',
            code: {
              background: 'var(--coderx-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--coderx-elements-artifacts-background)',
            backgroundHover: 'var(--coderx-elements-artifacts-backgroundHover)',
            borderColor: 'var(--coderx-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--coderx-elements-artifacts-inlineCode-background)',
              text: 'var(--coderx-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--coderx-elements-messages-background)',
            linkColor: 'var(--coderx-elements-messages-linkColor)',
            code: {
              background: 'var(--coderx-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--coderx-elements-messages-inlineCode-background)',
              text: 'var(--coderx-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--coderx-elements-icon-success)',
            error: 'var(--coderx-elements-icon-error)',
            primary: 'var(--coderx-elements-icon-primary)',
            secondary: 'var(--coderx-elements-icon-secondary)',
            tertiary: 'var(--coderx-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--coderx-elements-preview-addressBar-background)',
              backgroundHover: 'var(--coderx-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--coderx-elements-preview-addressBar-backgroundActive)',
              text: 'var(--coderx-elements-preview-addressBar-text)',
              textActive: 'var(--coderx-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--coderx-elements-terminals-background)',
            buttonBackground: 'var(--coderx-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--coderx-elements-dividerColor)',
          loader: {
            background: 'var(--coderx-elements-loader-background)',
            progress: 'var(--coderx-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--coderx-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--coderx-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--coderx-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--coderx-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--coderx-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--coderx-elements-cta-background)',
            text: 'var(--coderx-elements-cta-text)',
          },
        },
      },
    },
  },
  transformers: [transformerDirectives()],
  presets: [
    presetUno({
      dark: {
        light: '[data-theme="light"]',
        dark: '[data-theme="dark"]',
      },
    }),
    presetIcons({
      warn: true,
      collections: {
        ...customIconCollection,
        ph: () => import('@iconify-json/ph').then(i => i.icons),
      },
      unit: 'em',
    }),
  ],
});

/**
 * Generates an alpha palette for a given hex color.
 *
 * @param hex - The hex color code (without alpha) to generate the palette from.
 * @returns An object where keys are opacity percentages and values are hex colors with alpha.
 *
 * Example:
 *
 * ```
 * {
 *   '1': '#FFFFFF03',
 *   '2': '#FFFFFF05',
 *   '3': '#FFFFFF08',
 * }
 * ```
 */
function generateAlphaPalette(hex: string) {
  return [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce(
    (acc, opacity) => {
      const alpha = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');

      acc[opacity] = `${hex}${alpha}`;

      return acc;
    },
    {} as Record<number, string>,
  );
}
