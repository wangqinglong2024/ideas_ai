import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 金色体系（来自 DESIGN.md）
        gold: {
          light: '#E8C97A',
          base:  '#C9A84C',
          dark:  '#A8872E',
        },
        // 背景体系
        bg: {
          base: '#0A0A0F',
        },
        // 文字体系
        text: {
          primary:   '#F0EDE6',
          secondary: 'rgba(240,237,230,0.60)',
          muted:     'rgba(240,237,230,0.35)',
          disabled:  'rgba(240,237,230,0.20)',
        },
        // 语义颜色
        success: '#4CAF82',
        warning: '#E8A838',
        error:   '#E05454',
        info:    '#5B8FE8',
      },
      fontFamily: {
        cn:  ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Noto Sans SC', 'sans-serif'],
        num: ['Geist', 'Geist Mono', 'monospace'],
      },
      fontSize: {
        xs:   ['11px', { lineHeight: '1.4' }],
        sm:   ['13px', { lineHeight: '1.5' }],
        base: ['15px', { lineHeight: '1.7' }],
        md:   ['17px', { lineHeight: '1.5' }],
        lg:   ['20px', { lineHeight: '1.4' }],
        xl:   ['24px', { lineHeight: '1.3' }],
        '2xl':['32px', { lineHeight: '1.2' }],
        '3xl':['40px', { lineHeight: '1.1' }],
      },
      spacing: {
        1:  '4px',
        2:  '8px',
        3:  '12px',
        4:  '16px',
        5:  '20px',
        6:  '24px',
        8:  '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '24px',
        full: '9999px',
      },
      maxWidth: {
        app:   '440px',   // 应用端最大宽度
        admin: '1280px',  // 管理端最大宽度
      },
      boxShadow: {
        glass:    '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        gold:     '0 0 32px rgba(201,168,76,0.18)',
        elevated: '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
} satisfies Config
