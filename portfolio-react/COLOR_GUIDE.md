# Color Usage Guide - Shiri Langer Portfolio

## Quick Reference

### Primary Color Variables
```css
/* Main UI Colors */
--color-primary: #17243F;        /* Midnight - Primary text/actions */
--color-secondary: #788CE3;      /* Royal - Secondary elements */
--color-accent: #DFF478;         /* Neon - Accent/highlight color */
--color-text: #17243F;           /* Midnight - Main text color */
--color-background: #ECE9DF;     /* Sand - Background color */
```

### Core Palette Colors
```css
--midnight: #17243F;             /* Dark Navy Blue - Primary, professional */
--royal: #788CE3;                /* Medium Blue - Secondary, trustworthy */
--sky: #92BAD5;                  /* Light Blue - Calm, airy */
--sand: #ECE9DF;                 /* Sand White - Background, clean */
--neon: #DFF478;                 /* Neon Green - Accent, energetic */
```

### Extended Color Variables
```css
--color-midnight: #17243F;       /* Dark Navy Blue */
--color-royal: #788CE3;          /* Medium Blue */
--color-sky: #92BAD5;            /* Light Blue */
--color-sand: #ECE9DF;           /* Sand White */
--color-neon: #DFF478;           /* Neon Green */
```

### Shape/Overlay Colors
```css
--shape-midnight: #17243F;       /* For dark elements */
--shape-royal: #788CE3;          /* For medium elements */
--shape-sky: #92BAD5;            /* For light elements */
--shape-neon: #DFF478;           /* For accent elements */
--shape-sand: #ECE9DF;           /* For background elements */
```

## Usage Examples

### Sticker/Paper Cutout Elements
```css
.project-info-overlay {
  background: var(--color-accent); /* Neon Green */
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 35% 65% 45% 55% / 60% 40% 70% 30%; /* Organic shape */
}
```

### Button Hover States
```css
.contact-btn:hover {
  background: var(--color-secondary); /* Royal Blue */
  color: white;
}
```

### Text Hierarchy
```css
.project-modal-title {
  color: var(--color-primary); /* Midnight */
}

.project-modal-subtitle {
  color: var(--color-secondary); /* Royal Blue */
}
```

### Background Variations
```css
.hero-section {
  background: linear-gradient(135deg, var(--pantone-329c), var(--pantone-640c));
}

.accent-section {
  background: var(--pantone-1495c); /* Sunny Yellow */
}
```

## Color Psychology & Application

### Warm Colors (Energetic, Friendly)
- **Pantone 1495 C** (Yellow): Use for CTAs, highlights, energy
- **Pantone 805 C** (Coral): Use for friendly elements, warmth

### Cool Colors (Calm, Professional)
- **Pantone 640 C** (Blue): Use for trust, stability, calm
- **Pantone 273 C** (Navy): Use for professionalism, depth

### Purple Tones (Creative, Sophisticated)
- **Pantone 526 C** (Deep Purple): Use for creativity, sophistication
- **Pantone 254 C** (Rich Purple): Use for artistic elements

### Green Tones (Natural, Balanced)
- **Pantone 329 C** (Light Green): Use for growth, freshness
- **Pantone 3268 C** (Deep Teal): Use for balance, stability

## Accessibility Guidelines

### Contrast Ratios
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Test with color blindness simulators

### Color Combinations to Avoid
- Don't use similar brightness levels together
- Avoid pure red/green combinations (colorblind accessibility)
- Ensure sufficient contrast in all lighting conditions

## Implementation Tips

1. **Consistency**: Use the CSS variables throughout the project
2. **Testing**: Test colors on different screens and in different lighting
3. **Accessibility**: Always check contrast ratios
4. **Brand Alignment**: Colors should reflect Shiri's artistic and creative personality
5. **Flexibility**: Variables allow easy theme switching in the future
