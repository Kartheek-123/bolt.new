import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./icons/*.svg');

const collectionName = 'dragondev';

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
  // DragonDev brand colors - dragon and fire themed
  dragon: {
    50: '#F0F4FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },
  fire: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },
  ember: {
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
    dragon: generateAlphaPalette(BASE_COLORS.dragon[500]),
    fire: generateAlphaPalette(BASE_COLORS.fire[500]),
    ember: generateAlphaPalette(BASE_COLORS.ember[500]),
  },
};

export default defineConfig({
  shortcuts: {
    'dragondev-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color,box-shadow] duration-200 dragondev-ease-cubic-bezier',
    'dragondev-gradient': 'bg-gradient-to-r from-dragon-500 via-fire-500 to-ember-500',
    'dragondev-gradient-text': 'bg-gradient-to-r from-dragon-400 via-fire-400 to-ember-400 bg-clip-text text-transparent',
    'dragondev-card': 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
    'dragondev-button': 'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105',
    'dragondev-button-primary': 'dragondev-button bg-gradient-to-r from-dragon-500 to-fire-500 text-white hover:from-dragon-600 hover:to-fire-600',
    'dragondev-button-secondary': 'dragondev-button bg-white/10 text-white border border-white/20 hover:bg-white/20',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    ['b', {}],
  ],
  theme: {
    colors: {
      ...COLOR_PRIMITIVES,
      dragondev: {
        // Background gradients
        bg: {
          primary: '#0F172A',
          secondary: '#1E293B',
          tertiary: '#312E81',
        },
        // UI Elements
        elements: {
          borderColor: 'var(--dragondev-elements-borderColor)',
          borderColorActive: 'var(--dragondev-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--dragondev-elements-bg-depth-1)',
              2: 'var(--dragondev-elements-bg-depth-2)',
              3: 'var(--dragondev-elements-bg-depth-3)',
              4: 'var(--dragondev-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--dragondev-elements-textPrimary)',
          textSecondary: 'var(--dragondev-elements-textSecondary)',
          textTertiary: 'var(--dragondev-elements-textTertiary)',
          code: {
            background: 'var(--dragondev-elements-code-background)',
            text: 'var(--dragondev-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--dragondev-elements-button-primary-background)',
              backgroundHover: 'var(--dragondev-elements-button-primary-backgroundHover)',
              text: 'var(--dragondev-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--dragondev-elements-button-secondary-background)',
              backgroundHover: 'var(--dragondev-elements-button-secondary-backgroundHover)',
              text: 'var(--dragondev-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--dragondev-elements-button-danger-background)',
              backgroundHover: 'var(--dragondev-elements-button-danger-backgroundHover)',
              text: 'var(--dragondev-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--dragondev-elements-item-contentDefault)',
            contentActive: 'var(--dragondev-elements-item-contentActive)',
            contentAccent: 'var(--dragondev-elements-item-contentAccent)',
            contentDanger: 'var(--dragondev-elements-item-contentDanger)',
            backgroundDefault: 'var(--dragondev-elements-item-backgroundDefault)',
            backgroundActive: 'var(--dragondev-elements-item-backgroundActive)',
            backgroundAccent: 'var(--dragondev-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--dragondev-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--dragondev-elements-actions-background)',
            code: {
              background: 'var(--dragondev-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--dragondev-elements-artifacts-background)',
            backgroundHover: 'var(--dragondev-elements-artifacts-backgroundHover)',
            borderColor: 'var(--dragondev-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--dragondev-elements-artifacts-inlineCode-background)',
              text: 'var(--dragondev-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--dragondev-elements-messages-background)',
            linkColor: 'var(--dragondev-elements-messages-linkColor)',
            code: {
              background: 'var(--dragondev-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--dragondev-elements-messages-inlineCode-background)',
              text: 'var(--dragondev-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--dragondev-elements-icon-success)',
            error: 'var(--dragondev-elements-icon-error)',
            primary: 'var(--dragondev-elements-icon-primary)',
            secondary: 'var(--dragondev-elements-icon-secondary)',
            tertiary: 'var(--dragondev-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--dragondev-elements-preview-addressBar-background)',
              backgroundHover: 'var(--dragondev-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--dragondev-elements-preview-addressBar-backgroundActive)',
              text: 'var(--dragondev-elements-preview-addressBar-text)',
              textActive: 'var(--dragondev-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--dragondev-elements-terminals-background)',
            buttonBackground: 'var(--dragondev-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--dragondev-elements-dividerColor)',
          loader: {
            background: 'var(--dragondev-elements-loader-background)',
            progress: 'var(--dragondev-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--dragondev-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--dragondev-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--dragondev-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--dragondev-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--dragondev-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--dragondev-elements-cta-background)',
            text: 'var(--dragondev-elements-cta-text)',
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