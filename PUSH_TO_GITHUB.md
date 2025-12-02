# 🚀 Push to GitHub - Quick Guide

## Option 1: Create New Repo via GitHub Website

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `shiri-langer-portfolio` (or your choice)
3. **Description**: "Portfolio website for Shiri Langer"
4. **Visibility**: Public or Private
5. **DO NOT** check "Add a README file" (we already have one)
6. **DO NOT** add .gitignore or license
7. Click **Create repository**

## Option 2: Create Repo via GitHub CLI (if installed)

```bash
cd /Users/YehonatanShapira/Documents/Coding/langer-shiri-clean
gh repo create shiri-langer-portfolio --public --source=. --remote=origin --push
```

## After Creating Repo - Push Commands

```bash
cd /Users/YehonatanShapira/Documents/Coding/langer-shiri-clean

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shiri-langer-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## If You Already Have a Repo

If you want to push to an existing repository:

```bash
cd /Users/YehonatanShapira/Documents/Coding/langer-shiri-clean

# Add existing repo as remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push
git push -u origin main
```

## Verify

After pushing, check:
- https://github.com/YOUR_USERNAME/shiri-langer-portfolio
- Should see all files: `src/`, `public/`, `package.json`, etc.

