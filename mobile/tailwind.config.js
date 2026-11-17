module.exports = {
 content: ['./App.tsx', './src/**/*.{ts,tsx}'], presets: [require('nativewind/preset')],
 theme: { extend: { colors: {
 background: '#ffffff', foreground: '#171717', border: '#e5e5e5', input: '#e5e5e5', ring: '#a3a3a3',
 primary: { DEFAULT: '#171717', foreground: '#fafafa' }, secondary: { DEFAULT: '#f5f5f5', foreground: '#171717' },
 muted: { DEFAULT: '#f5f5f5', foreground: '#737373' }, accent: { DEFAULT: '#f5f5f5', foreground: '#171717' }, destructive: '#b91c1c'
 } } }
};
