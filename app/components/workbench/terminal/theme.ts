import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--dragondev-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--dragondev-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--dragondev-elements-terminal-textColor'),
    background: cssVar('--dragondev-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--dragondev-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--dragondev-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--dragondev-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--dragondev-elements-terminal-color-black'),
    red: cssVar('--dragondev-elements-terminal-color-red'),
    green: cssVar('--dragondev-elements-terminal-color-green'),
    yellow: cssVar('--dragondev-elements-terminal-color-yellow'),
    blue: cssVar('--dragondev-elements-terminal-color-blue'),
    magenta: cssVar('--dragondev-elements-terminal-color-magenta'),
    cyan: cssVar('--dragondev-elements-terminal-color-cyan'),
    white: cssVar('--dragondev-elements-terminal-color-white'),
    brightBlack: cssVar('--dragondev-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--dragondev-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--dragondev-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--dragondev-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--dragondev-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--dragondev-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--dragondev-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--dragondev-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}