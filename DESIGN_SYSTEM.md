# 🎨 SnackShield Design System

## Color Palette

### Primary Colors
```css
/* Indigo-Purple Gradient (Main Brand) */
--primary-start: #6366F1  /* Indigo-600 */
--primary-mid: #8B5CF6    /* Purple-600 */
--primary-end: #EC4899    /* Pink-600 */

/* Usage: bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 */
```

### Accent Colors
```css
--accent-cyan: #06B6D4     /* Cyan-600 */
--accent-teal: #14B8A6     /* Teal-600 */
--accent-orange: #F97316   /* Orange-600 */
--accent-emerald: #10B981  /* Emerald-600 */
--accent-red: #EF4444      /* Red-600 */
```

### Background Colors
```css
/* Dark Backgrounds */
--bg-dark: #0B0F1A         /* Hero sections */
--surface-1: #110E1F       /* Sidebar, cards */
--surface-2: #16132A       /* Elevated cards */

/* Light Backgrounds */
--bg-light: #F8FAFC        /* Stats section */
--bg-white: #FFFFFF        /* Features section */
```

### Text Colors
```css
--text-primary: #F1F5F9    /* White text */
--text-secondary: #94A3B8  /* Muted text */
--text-tertiary: #64748B   /* Labels */
```

---

## Typography

### Font Families
```css
font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;
```

### Font Sizes
```css
/* Headings */
--text-7xl: 4.5rem   /* Hero titles */
--text-5xl: 3rem     /* Section titles */
--text-3xl: 1.875rem /* Card titles */
--text-xl: 1.25rem   /* Subtitles */

/* Body */
--text-base: 1rem    /* Body text */
--text-sm: 0.875rem  /* Small text */
--text-xs: 0.75rem   /* Labels */
```

### Font Weights
```css
--font-bold: 700     /* Headings */
--font-semibold: 600 /* Buttons, labels */
--font-medium: 500   /* Body text */
--font-normal: 400   /* Secondary text */
```

---

## Spacing System

### 8px Grid
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

---

## Border Radius

```css
--radius-sm: 0.5rem   /* 8px - Small elements */
--radius-md: 0.75rem  /* 12px - Buttons, inputs */
--radius-lg: 1rem     /* 16px - Cards */
--radius-xl: 1.25rem  /* 20px - Large cards */
--radius-2xl: 1.5rem  /* 24px - Hero cards */
--radius-full: 9999px /* Pills, badges */
```

---

## Shadows

### Card Shadows
```css
/* Default */
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

/* Hover */
box-shadow: 0 20px 50px -12px rgba(124, 58, 237, 0.25);

/* Glow Effects */
--glow-purple: 0 0 30px rgba(124, 58, 237, 0.35);
--glow-cyan: 0 0 30px rgba(20, 184, 166, 0.35);
--glow-orange: 0 0 30px rgba(249, 115, 22, 0.35);
```

---

## Gradients

### Background Gradients
```css
/* Hero Background */
background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.12), transparent);

/* Card Gradient */
background: linear-gradient(145deg, rgba(22,19,42,0.6), rgba(12,10,20,0.8));

/* Button Gradient */
background: linear-gradient(135deg, #6366F1, #8B5CF6);
```

### Text Gradients
```css
/* Highlight Text */
background: linear-gradient(135deg, #A855F7, #2DD4BF, #FB923C);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Components

### Button Styles

#### Primary Button
```jsx
<button className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300">
  Get Started
</button>
```

#### Secondary Button
```jsx
<button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
  Learn More
</button>
```

#### Ghost Button
```jsx
<button className="px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
  Cancel
</button>
```

---

### Card Styles

#### Glassmorphism Card
```jsx
<div className="bg-gradient-to-br from-surface-2/80 to-surface-2/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
  {/* Content */}
</div>
```

#### KPI Card with Gradient Border
```jsx
<div className="relative bg-gradient-to-br from-surface-2/80 to-surface-2/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group">
  {/* Gradient Top Border */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />
  {/* Content */}
</div>
```

---

### Badge Styles

```jsx
{/* Success Badge */}
<span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
  Genuine
</span>

{/* Warning Badge */}
<span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-semibold text-orange-400">
  Flagged
</span>

{/* Info Badge */}
<span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400">
  Active
</span>
```

---

## Animations

### Transitions
```css
/* Default */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Fast */
transition: all 0.2s ease;

/* Slow */
transition: all 0.5s ease;
```

### Hover Effects
```css
/* Lift */
hover:-translate-y-1

/* Scale */
hover:scale-105

/* Glow */
hover:shadow-lg hover:shadow-purple-500/40
```

### Keyframe Animations
```css
/* Pulse Slow */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
animation: float 4s ease-in-out infinite;
```

---

## Layout

### Container
```css
max-width: 1200px;
margin: 0 auto;
padding: 0 1.5rem;
```

### Grid Systems
```jsx
{/* 4-Column Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

{/* 3-Column Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* 2-Column Split */}
<div className="grid lg:grid-cols-2 gap-12 items-center">
```

---

## Icons

### Icon Sizes
```jsx
<Icon size={16} /> {/* Small - Labels */}
<Icon size={20} /> {/* Medium - Buttons */}
<Icon size={24} /> {/* Large - Cards */}
<Icon size={28} /> {/* XL - Hero */}
```

### Icon with Background
```jsx
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
  <Icon size={24} />
</div>
```

---

## Glassmorphism

### Standard Glass
```css
background: rgba(22, 19, 42, 0.6);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.06);
```

### Navbar Glass
```css
background: rgba(11, 15, 26, 0.95);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
```

---

## Accessibility

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:ring-offset-2
focus:ring-offset-surface
```

### Color Contrast
- All text meets WCAG AA standards
- Minimum contrast ratio: 4.5:1 for body text
- Minimum contrast ratio: 3:1 for large text

---

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

---

## Usage Examples

### Hero Section
```jsx
<section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 px-6 overflow-hidden bg-[#0B0F1A]">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Content */}
    </div>
  </div>
</section>
```

### Stats Section
```jsx
<section className="py-20 bg-gradient-to-b from-slate-50 to-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Stats */}
    </div>
  </div>
</section>
```

---

## Best Practices

1. **Use gradients sparingly** - Only for highlights and accents
2. **Maintain hierarchy** - Dark hero → Light content → Dark CTA
3. **Add depth** - Use shadows, blur, and layering
4. **Animate smoothly** - 0.3s transitions for most interactions
5. **Keep it accessible** - Maintain contrast ratios
6. **Be consistent** - Use the 8px spacing system
7. **Test responsively** - Mobile-first approach

---

**Design System Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: ✅ Production Ready
