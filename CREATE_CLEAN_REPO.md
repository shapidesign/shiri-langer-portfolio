# 🧹 Create Clean GitHub Repository

## Plan

1. Build production files from current working code
2. Create new clean directory structure
3. Copy only essential files
4. Create new GitHub repo
5. Push clean code

## Files to Keep

### Essential Files:
- `package.json` - Dependencies
- `vercel.json` - Vercel config (optional)
- `src/` - All React source code
- `public/` - Static assets
- `tsconfig.json` - TypeScript config
- `.gitignore` - Git ignore rules
- `.node-version` / `.nvmrc` - Node version

### Files to Remove:
- All duplicate folders (`portfolio-react/`, `portfolio/`, etc.)
- All `* 2` duplicate files
- All documentation `.md` files (except README)
- `Assets/` folder (large files)
- `inspi/` folder
- All legacy/unused folders

### Build Output:
- `build/` folder will be generated (gitignored)

## New Repo Structure

```
new-repo/
├── package.json
├── vercel.json (optional)
├── tsconfig.json
├── .gitignore
├── .node-version
├── README.md
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── components/
│   ├── hooks/
│   ├── managers/
│   └── ...
├── public/
│   ├── index.html
│   ├── assets/
│   └── ...
└── build/ (generated, gitignored)
```

## Steps

1. Create clean directory
2. Copy essential files
3. Initialize git
4. Create new GitHub repo
5. Push to new repo

