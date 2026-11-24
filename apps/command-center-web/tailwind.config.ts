import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          onyx: 'var(--color-brand-onyx, #0B0C0E)',
          carbon: 'var(--color-brand-carbon, #17191D)',
          graphite: 'var(--color-brand-graphite, #24272D)',
          slate: 'var(--color-brand-slate, #5B616B)',
          stone: 'var(--color-brand-stone, #A6A19A)',
          line: 'var(--color-brand-line, #DDD8CF)',
          sand: 'var(--color-brand-sand, #EEE9E0)',
          ivory: 'var(--color-brand-ivory, #FAF8F4)',
        },
        accent: {
          champagne: 'var(--color-accent-champagne, #C6A15B)',
          champagneDark: 'var(--color-accent-champagne-dark, #A88343)',
          champagneTint: 'var(--color-accent-champagne-tint, #F1E7D2)',
          atlantic: 'var(--color-accent-atlantic, #164D53)',
          atlanticMid: 'var(--color-accent-atlantic-mid, #1F626A)',
          atlanticTint: 'var(--color-accent-atlantic-tint, #DDEBEC)',
        },
        surface: {
          canvas: 'var(--color-surface-canvas, #FAF8F4)',
          card: 'var(--color-surface-card, #FFFFFF)',
          subtle: 'var(--color-surface-subtle, #EEE9E0)',
          inverse: 'var(--color-surface-inverse, #0B0C0E)',
        },
        semantic: {
          success: 'var(--color-semantic-success, #1F6B4A)',
          successTint: 'var(--color-semantic-success-tint, #E6F2EC)',
          warning: 'var(--color-semantic-warning, #8A5610)',
          warningTint: 'var(--color-semantic-warning-tint, #F7EFD9)',
          danger: 'var(--color-semantic-danger, #B33A3A)',
          dangerTint: 'var(--color-semantic-danger-tint, #F9E6E6)',
          info: 'var(--color-semantic-info, #2F5E8D)',
          infoTint: 'var(--color-semantic-info-tint, #E8F0F8)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm, 6px)',
        md: 'var(--radius-md, 8px)',
        lg: 'var(--radius-lg, 12px)',
        xl: 'var(--radius-xl, 16px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
