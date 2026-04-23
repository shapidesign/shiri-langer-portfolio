# Shiri Langer Portfolio - React Version

A modern, interactive portfolio website built with React and TypeScript, featuring an infinite scroll grid layout inspired by the "Public Work by Cosmos" design.

## Features

- **Infinite Scroll Grid**: Navigate in all directions (up, down, left, right) by hovering over screen edges
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Portfolio Items**: Hover effects with project information overlays
- **Modern UI**: Clean, minimalist design with glassmorphism effects
- **TypeScript**: Full type safety and better development experience
- **Performance Optimized**: Lazy loading, smooth animations, and efficient rendering

## Technology Stack

- **React 18** with TypeScript
- **CSS3** with custom properties and modern features
- **Responsive Design** with mobile-first approach
- **Google Fonts** (Inter & Source Code Pro)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd portfolio-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
portfolio-react/
├── public/
│   └── assets/
│       └── images/          # Portfolio images
├── src/
│   ├── components/
│   │   ├── PortfolioGrid.tsx    # Main portfolio component
│   │   └── PortfolioGrid.css    # Component styles
│   ├── App.tsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.tsx            # Entry point
│   └── index.css            # Global styles
└── README.md
```

## How to Use

### Infinite Scroll Navigation

- **Top Edge**: Hover over the top 50px of the screen to scroll content upward
- **Right Edge**: Hover over the right 50px to scroll content to the right
- **Bottom Edge**: Hover over the bottom 50px to scroll content downward
- **Left Edge**: Hover over the left 50px to scroll content to the left

### Portfolio Interaction

- **Hover**: Hover over any portfolio item to see project details
- **Contact**: Click the contact button in the top-right corner

## Customization

### Adding New Projects

Edit the `baseProjects` array in `PortfolioGrid.tsx`:

```typescript
const baseProjects: Project[] = [
  {
    id: 1,
    title: "Your Project Title",
    description: "Project description",
    image: "/assets/images/your-image.png",
    date: "2024",
    tags: ["Tag1", "Tag2"],
    client: "Client Name"
  }
];
```

### Styling

Modify CSS variables in `PortfolioGrid.css`:

```css
:root {
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-accent: #ff6b6b;
  /* ... other variables */
}
```

### Grid Configuration

Adjust grid settings in the `generateGridPositions` function:

```typescript
const padding = 30;        // Space between items
const itemWidth = 400;     // Item width in pixels
const itemHeight = 450;    // Item height in pixels
```

## Performance Features

- **Lazy Loading**: Images load only when needed
- **Smooth Animations**: 60fps scroll animations
- **Efficient Rendering**: Optimized React rendering with useCallback
- **Responsive Images**: Automatic image optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy to Netlify/Vercel

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service

## License

This project is for portfolio purposes. Please respect the original design inspiration from "Public Work by Cosmos".

## Credits

- Design inspiration: Public Work by Cosmos
- Fonts: Google Fonts (Inter, Source Code Pro)
- Icons: Custom SVG icons
- Images: Portfolio assets provided by Shiri Langer