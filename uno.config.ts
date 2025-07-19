import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./icons/*.svg');

const collectionName = 'devloop';

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
  black: '#000000',
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  // DevLoop brand colors - modern tech aesthetic
  primary: {
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
  secondary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },
  accent: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    950: '#022C22',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },
  error: {
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
  success: {
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
};

const COLOR_PRIMITIVES = {
  ...BASE_COLORS,
  alpha: {
    white: generateAlphaPalette(BASE_COLORS.white),
    gray: generateAlphaPalette(BASE_COLORS.gray[900]),
    primary: generateAlphaPalette(BASE_COLORS.primary[500]),
    accent: generateAlphaPalette(BASE_COLORS.accent[500]),
  },
};

export default defineConfig({
  shortcuts: {
    'devloop-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color,box-shadow] duration-200 devloop-ease-cubic-bezier',
    'devloop-gradient': 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500',
    'devloop-gradient-text': 'bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent',
    'devloop-card': 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
    'devloop-button': 'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105',
    'devloop-button-primary': 'devloop-button bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600',
    'devloop-button-secondary': 'devloop-button bg-white/10 text-white border border-white/20 hover:bg-white/20',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    ['b', {}],
  ],
  theme: {
    colors: {
      ...COLOR_PRIMITIVES,
      devloop: {
        // Background gradients
        bg: {
          primary: '#0F172A',
          secondary: '#1E293B',
          tertiary: '#334155',
        },
        // UI Elements
        elements: {
          borderColor: 'var(--devloop-elements-borderColor)',
          borderColorActive: 'var(--devloop-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--devloop-elements-bg-depth-1)',
              2: 'var(--devloop-elements-bg-depth-2)',
              3: 'var(--devloop-elements-bg-depth-3)',
              4: 'var(--devloop-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--devloop-elements-textPrimary)',
          textSecondary: 'var(--devloop-elements-textSecondary)',
          textTertiary: 'var(--devloop-elements-textTertiary)',
          code: {
            background: 'var(--devloop-elements-code-background)',
            text: 'var(--devloop-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--devloop-elements-button-primary-background)',
              backgroundHover: 'var(--devloop-elements-button-primary-backgroundHover)',
              text: 'var(--devloop-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--devloop-elements-button-secondary-background)',
              backgroundHover: 'var(--devloop-elements-button-secondary-backgroundHover)',
              text: 'var(--devloop-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--devloop-elements-button-danger-background)',
              backgroundHover: 'var(--devloop-elements-button-danger-backgroundHover)',
              text: 'var(--devloop-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--devloop-elements-item-contentDefault)',
            contentActive: 'var(--devloop-elements-item-contentActive)',
            contentAccent: 'var(--devloop-elements-item-contentAccent)',
            contentDanger: 'var(--devloop-elements-item-contentDanger)',
            backgroundDefault: 'var(--devloop-elements-item-backgroundDefault)',
            backgroundActive: 'var(--devloop-elements-item-backgroundActive)',
            backgroundAccent: 'var(--devloop-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--devloop-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--devloop-elements-actions-background)',
            code: {
              background: 'var(--devloop-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--devloop-elements-artifacts-background)',
            backgroundHover: 'var(--devloop-elements-artifacts-backgroundHover)',
            borderColor: 'var(--devloop-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--devloop-elements-artifacts-inlineCode-background)',
              text: 'var(--devloop-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--devloop-elements-messages-background)',
            linkColor: 'var(--devloop-elements-messages-linkColor)',
            code: {
              background: 'var(--devloop-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--devloop-elements-messages-inlineCode-background)',
              text: 'var(--devloop-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--devloop-elements-icon-success)',
            error: 'var(--devloop-elements-icon-error)',
            primary: 'var(--devloop-elements-icon-primary)',
            secondary: 'var(--devloop-elements-icon-secondary)',
            tertiary: 'var(--devloop-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--devloop-elements-preview-addressBar-background)',
              backgroundHover: 'var(--devloop-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--devloop-elements-preview-addressBar-backgroundActive)',
              text: 'var(--devloop-elements-preview-addressBar-text)',
              textActive: 'var(--devloop-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--devloop-elements-terminals-background)',
            buttonBackground: 'var(--devloop-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--devloop-elements-dividerColor)',
          loader: {
            background: 'var(--devloop-elements-loader-background)',
            progress: 'var(--devloop-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--devloop-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--devloop-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--devloop-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--devloop-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--devloop-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--devloop-elements-cta-background)',
            text: 'var(--devloop-elements-cta-text)',
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
      },
    }),
  ],
});

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