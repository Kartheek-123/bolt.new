import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--devloop-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--devloop-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--devloop-elements-terminal-textColor'),
    background: cssVar('--devloop-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--devloop-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--devloop-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--devloop-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--devloop-elements-terminal-color-black'),
    red: cssVar('--devloop-elements-terminal-color-red'),
    green: cssVar('--devloop-elements-terminal-color-green'),
    yellow: cssVar('--devloop-elements-terminal-color-yellow'),
    blue: cssVar('--devloop-elements-terminal-color-blue'),
    magenta: cssVar('--devloop-elements-terminal-color-magenta'),
    cyan: cssVar('--devloop-elements-terminal-color-cyan'),
    white: cssVar('--devloop-elements-terminal-color-white'),
    brightBlack: cssVar('--devloop-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--devloop-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--devloop-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--devloop-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--devloop-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--devloop-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--devloop-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--devloop-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}