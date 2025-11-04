# 🔧 Fix Vercel Deployment - Show New Website

## Problem
Vercel is showing old website even though new repo is connected.

## ✅ Solution Steps

### Step 1: Verify Vercel Project Settings

1. Go to: https://vercel.com/dashboard
2. Find your project: `shiri-langer-portfolio`
3. Click **Settings** → **Git**
4. Verify:
   - ✅ Repository: `shapidesign/shiri-langer-portfolio`
   - ✅ Production Branch: `main`
   - ✅ Root Directory: `./` (blank = root)

### Step 2: Clear Build Cache

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **Redeploy**
4. **Important**: Uncheck **"Use existing Build Cache"**
5. Click **Redeploy**

### Step 3: Force Fresh Deployment

If redeploy doesn't work:

1. Go to **Settings** → **General**
2. Scroll to **Deploy Hooks**
3. Create a new deploy hook OR
4. Make a small change and push to trigger:

```bash
cd /Users/YehonatanShapira/Documents/Coding/langer-shiri-clean
echo "# Updated" >> README.md
git add README.md
git commit -m "Force fresh deployment"
git push origin main
```

### Step 4: Verify Deployment

1. Check **Deployments** tab
2. Should see new deployment from `main` branch
3. Check build logs - should show:
   - Building from `src/` folder
   - Using root `package.json`
   - Build command: `npm run build`

### Step 5: Check Domain

1. Go to **Settings** → **Domains**
2. Make sure domain points to latest deployment
3. If needed, remove old domain and re-add

## 🚨 If Still Showing Old Site

1. **Check if multiple Vercel projects exist**
   - Go to dashboard
   - See if there are multiple projects
   - Make sure you're looking at the right one

2. **Disconnect and Reconnect**
   - Settings → Git → Disconnect
   - Connect Git Repository
   - Select: `shapidesign/shiri-langer-portfolio`
   - Branch: `main`

3. **Clear Browser Cache**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or open in incognito/private window

## ✅ Verification Checklist

- [ ] Vercel connected to `shapidesign/shiri-langer-portfolio`
- [ ] Production branch is `main`
- [ ] Root directory is `./` (root)
- [ ] Latest deployment is from `main` branch
- [ ] Build cache cleared
- [ ] Browser cache cleared
- [ ] Domain points to new deployment

