import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--coderx-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--coderx-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--coderx-elements-terminal-textColor'),
    background: cssVar('--coderx-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--coderx-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--coderx-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--coderx-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--coderx-elements-terminal-color-black'),
    red: cssVar('--coderx-elements-terminal-color-red'),
    green: cssVar('--coderx-elements-terminal-color-green'),
    yellow: cssVar('--coderx-elements-terminal-color-yellow'),
    blue: cssVar('--coderx-elements-terminal-color-blue'),
    magenta: cssVar('--coderx-elements-terminal-color-magenta'),
    cyan: cssVar('--coderx-elements-terminal-color-cyan'),
    white: cssVar('--coderx-elements-terminal-color-white'),
    brightBlack: cssVar('--coderx-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--coderx-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--coderx-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--coderx-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--coderx-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--coderx-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--coderx-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--coderx-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
