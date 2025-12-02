# 🔧 Fix Domain Showing Markdown Instead of React App

## Problem
Domain `shirilangerdesigns.com` is showing a markdown file (GitHub Pages) instead of your React app (Vercel).

## Root Cause
The CNAME file in your repo was causing GitHub Pages to serve the repository, and DNS might be pointing to GitHub Pages instead of Vercel.

## ✅ Solution Steps

### Step 1: Verify CNAME is Removed ✅
- ✅ CNAME file removed from `public/CNAME`
- ✅ Changes committed and pushed

### Step 2: Disable GitHub Pages (If Enabled)

1. **Go to GitHub Repository**
   - https://github.com/shapidesign/shiri-langer-portfolio
   - Click **Settings** tab
   - Click **Pages** in left sidebar

2. **Disable GitHub Pages**
   - Set **Source** to **None**
   - Click **Save**

### Step 3: Update DNS to Point to Vercel

Your DNS provider needs to point to Vercel, not GitHub Pages.

#### Check Current DNS

1. **Go to your DNS provider** (Cloudflare, GoDaddy, Namecheap, etc.)
2. **Check current DNS records** for `shirilangerdesigns.com`

#### Remove GitHub Pages DNS Records

Delete any DNS records pointing to GitHub:
- ❌ Remove any CNAME pointing to `username.github.io`
- ❌ Remove any A records pointing to GitHub IPs (185.199.108.153, etc.)

#### Add Vercel DNS Records

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Your project: `shiri-langer-portfolio`
   - **Settings** → **Domains**

2. **Add Domain** (if not already added)
   - Click **Add Domain**
   - Enter: `shirilangerdesigns.com`
   - Click **Add**

3. **Get DNS Records from Vercel**
   - Vercel will show exact DNS records to add
   - Copy these records

4. **Add DNS Records in Your DNS Provider**

   **For Apex Domain (shirilangerdesigns.com):**
   
   **Option A - If your DNS supports ANAME/ALIAS:**
   - Type: **ANAME** or **ALIAS**
   - Name: `@` (or blank)
   - Value: `cname.vercel-dns.com`
   - TTL: 3600
   
   **Option B - If not, use A records:**
   - Type: **A**
   - Name: `@`
   - Value: Use IPs from Vercel dashboard (usually starts with 76.x.x.x)
   - Add multiple A records if Vercel provides multiple IPs

   **For www (optional):**
   - Type: **CNAME**
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: 3600

### Step 4: Verify DNS Configuration

1. **Wait 15-30 minutes** for DNS propagation

2. **Check DNS Records**
   ```bash
   # Check if domain points to Vercel
   dig shirilangerdesigns.com +short
   
   # Should show Vercel IPs (not GitHub IPs)
   ```

3. **Check Vercel Dashboard**
   - Settings → Domains
   - Should show: ✅ **Valid Configuration**
   - Should show: ✅ **Production** deployment

### Step 5: Test Domain

1. **Clear browser cache** (Cmd+Shift+R or Ctrl+Shift+R)
2. **Visit**: `https://shirilangerdesigns.com`
3. **Should see**: Your React portfolio app (blue palette design)
4. **Should NOT see**: Markdown files or GitHub Pages

## 🔍 Troubleshooting

### Still Seeing Markdown Files?

1. **Check DNS propagation**
   - Use: https://dnschecker.org
   - Search: `shirilangerdesigns.com`
   - Should show Vercel IPs globally

2. **Clear DNS cache**
   ```bash
   # Mac
   sudo dscacheutil -flushcache
   
   # Or use Google DNS: 8.8.8.8
   ```

3. **Check Vercel deployment**
   - Make sure latest deployment is successful
   - Check build logs for errors

4. **Verify domain in Vercel**
   - Settings → Domains
   - Should show domain as active
   - Should link to production deployment

### Domain Still Points to GitHub?

1. **Double-check DNS records**
   - Make sure ALL GitHub records are removed
   - Make sure Vercel records are added

2. **Check for multiple DNS providers**
   - Domain registrar might have DNS
   - Cloudflare might have DNS
   - Make sure you're editing the correct one

## ✅ Quick Checklist

- [ ] CNAME file removed from repo ✅
- [ ] GitHub Pages disabled
- [ ] DNS records removed from GitHub
- [ ] DNS records added for Vercel
- [ ] Domain added in Vercel dashboard
- [ ] Waited 15-30 minutes for propagation
- [ ] DNS checker shows Vercel IPs
- [ ] Vercel shows "Valid Configuration"
- [ ] Domain shows React app (not markdown)

## 🎯 Expected Result

After fixing DNS:
- ✅ `shirilangerdesigns.com` → Shows your React portfolio
- ✅ `www.shirilangerdesigns.com` → Redirects to main domain
- ✅ HTTPS works automatically
- ✅ No more markdown files

