# Shiri Langer Portfolio

Portfolio website for Shiri Langer - Industrial Designer

## Project Structure

**IMPORTANT**: This project uses a single, clear structure:

```
/
├── package.json          # Root package.json - ALL deployments use this
├── src/                  # Main React app source code (ONLY source folder)
│   ├── App.tsx          # Main app entry point
│   ├── index.tsx        # ReactDOM root
│   ├── components/      # All React components
│   ├── hooks/           # Custom React hooks
│   ├── managers/        # State managers
│   └── ...
├── public/              # Static assets (images, fonts, etc.)
│   ├── _redirects      # SPA routing for Cloudflare Pages
│   └── ...
└── build/               # Build output (auto-generated, gitignored)
```

## Deployment

### All deployments build from:
- **Root directory**: `/` (root of repository)
- **Source code**: `src/` folder
- **Build command**: `npm run build`
- **Output directory**: `build/`
- **Package.json**: Root `package.json`

### Supported Platforms:
- ✅ Vercel
- ✅ Cloudflare Pages
- ✅ GitHub Pages

All use the same root `package.json` and `src/` folder structure.

## Development

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

Build output goes to `build/` folder.

## Note on Other Folders

- `portfolio-react/` - Legacy folder, NOT used for deployments
- `portfolio/` - Not used
- Other folders are assets/documentation only

# Trigger Vercel rebuild
