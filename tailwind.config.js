/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backgroundImage: {
  			'brand-gradient': 'linear-gradient(135deg, #12b886 0%, #087f5b 100%)',
  			'brand-gradient-soft': 'linear-gradient(135deg, #96f2d7 0%, #c3fae8 100%)',
  			'steady-gradient': 'linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%)',
  			'progress-gradient': 'linear-gradient(135deg, #fd7e14 0%, #d9480f 100%)'
  		},
  		colors: {
  			// ── Levli brand palette (explicit tokens) ──────────────────────────
  			clarity: { 50:'#e6fcf5',100:'#c3fae8',200:'#96f2d7',300:'#5fe9c4',400:'#38d9a9',500:'#20c997',600:'#12b886',700:'#0ca678',800:'#087f5b',900:'#065f46' },
  			steady:   { 50:'#edf2ff',100:'#dbe4ff',200:'#bac8ff',300:'#91a7ff',400:'#748ffc',500:'#4c6ef5',600:'#4263eb',700:'#364fc7',800:'#2c3fa3',900:'#1e2f87' },
  			progress: { 50:'#fff4e6',100:'#ffe8cc',200:'#ffd8a8',300:'#ffb066',400:'#fd9e3f',500:'#fd7e14',600:'#f76707',700:'#d9480f',800:'#b3450a',900:'#8a3508' },
  			calm:     { 50:'#ffffff',100:'#f8f9fa',200:'#e9ecef',300:'#dee2e6',400:'#ced4da',500:'#adb5bd',600:'#868e96',700:'#495057',800:'#343a40',900:'#212529' },
  			depth:    { 50:'#f1f3f5',100:'#e9ecef',200:'#dee2e6',300:'#ced4da',400:'#adb5bd',500:'#868e96',600:'#495057',700:'#343a40',800:'#25282e',900:'#212529',950:'#131518' },
  			// ── Remap Tailwind defaults to brand roles ──────────────────────────
  			blue:   { 50:'#e6fcf5',100:'#c3fae8',200:'#96f2d7',300:'#5fe9c4',400:'#38d9a9',500:'#20c997',600:'#12b886',700:'#0ca678',800:'#087f5b',900:'#065f46' },
  			orange: { 50:'#fff4e6',100:'#ffe8cc',200:'#ffd8a8',300:'#ffb066',400:'#fd9e3f',500:'#fd7e14',600:'#f76707',700:'#d9480f',800:'#b3450a',900:'#8a3508' },
  			gray:   { 50:'#f8f9fa',100:'#e9ecef',200:'#dee2e6',300:'#ced4da',400:'#adb5bd',500:'#868e96',600:'#495057',700:'#343a40',800:'#25282e',900:'#212529',950:'#131518' },
  			// ── Semantic tokens ─────────────────────────────────────────────────
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'fade-in': {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' }
  			},
  			'fade-in-up': {
  				'0%': { opacity: '0', transform: 'translateY(8px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'float': {
  				'0%,100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-6px)' }
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			},
  			'gradient-pan': {
  				'0%,100%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.4s ease-out both',
  			'fade-in-up': 'fade-in-up 0.5s ease-out both',
  			'float': 'float 3s ease-in-out infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  			'gradient-pan': 'gradient-pan 6s ease infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
