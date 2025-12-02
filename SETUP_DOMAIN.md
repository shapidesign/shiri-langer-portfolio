# 🌐 Connect Domain to Vercel

## Your Domain: `shirilangerdesigns.com`

## ✅ Step-by-Step Guide

### Step 1: Add Domain to Vercel Project

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your project: `shiri-langer-portfolio`

2. **Go to Settings → Domains**
   - Click **Settings** tab
   - Click **Domains** in left sidebar

3. **Add Domain**
   - Click **Add** or **Add Domain** button
   - Enter: `shirilangerdesigns.com`
   - Click **Add**

4. **Add www version** (optional but recommended)
   - Also add: `www.shirilangerdesigns.com`
   - Vercel will handle redirect automatically

### Step 2: Configure DNS Records

Vercel will show you DNS records to add. You need to add these in your DNS provider (where you bought the domain).

#### Option A: Using Apex Domain (shirilangerdesigns.com)

**If your DNS provider supports ANAME/ALIAS:**

1. Add **ANAME** or **ALIAS** record:
   - **Name**: `@` or blank (root domain)
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 3600 (or default)

**If your DNS provider doesn't support ANAME:**

1. Add **A** records:
   - **Name**: `@`
   - **Value**: `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IPs)
   - Add multiple A records with different IPs if Vercel provides them

#### Option B: Using CNAME (www.shirilangerdesigns.com)

1. Add **CNAME** record:
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 3600

### Step 3: Verify DNS Configuration

Common DNS providers:

#### **Cloudflare:**
1. Go to Cloudflare Dashboard
2. Select your domain
3. Go to **DNS** → **Records**
4. Add records as shown in Vercel
5. Make sure **Proxy status** is **DNS only** (gray cloud) for A records

#### **GoDaddy:**
1. Go to GoDaddy Domain Manager
2. Click **DNS** next to your domain
3. Click **Add** to add new records
4. Enter values from Vercel

#### **Namecheap:**
1. Go to Domain List
2. Click **Manage** next to domain
3. Go to **Advanced DNS**
4. Add records as shown in Vercel

#### **Google Domains:**
1. Go to Domain Settings
2. Click **DNS**
3. Add records as shown in Vercel

### Step 4: Wait for DNS Propagation

- DNS changes take **5 minutes to 48 hours** to propagate
- Usually takes **15-30 minutes**
- Check status in Vercel dashboard

### Step 5: Verify Domain is Active

1. **Check Vercel Dashboard**
   - Settings → Domains
   - Should show: ✅ **Valid Configuration**
   - Should show: ✅ **Production** deployment

2. **Test Domain**
   - Visit: `https://shirilangerdesigns.com`
   - Should show your Vercel deployment
   - Should have SSL certificate (HTTPS)

## 🔍 Troubleshooting

### Domain shows "Invalid Configuration"

1. **Check DNS records** - Make sure they match Vercel exactly
2. **Wait for propagation** - DNS can take time
3. **Check DNS provider** - Some providers have delays

### Domain not pointing to Vercel

1. **Verify DNS records** - Use `dig` or online DNS checker
2. **Check TTL** - Lower TTL = faster updates
3. **Remove old DNS records** - Delete conflicting records

### SSL Certificate Issues

1. **Wait for certificate** - Vercel auto-generates SSL (can take minutes)
2. **Check HTTPS** - Make sure you're using `https://`
3. **Force HTTPS** - Vercel redirects HTTP to HTTPS automatically

## 📋 Quick DNS Check Commands

Check if DNS is configured correctly:

```bash
# Check A record
dig shirilangerdesigns.com +short

# Check CNAME
dig www.shirilangerdesigns.com +short

# Check all records
dig shirilangerdesigns.com ANY
```

## ✅ Verification Checklist

- [ ] Domain added in Vercel Settings → Domains
- [ ] DNS records added in DNS provider
- [ ] DNS records match Vercel instructions
- [ ] Waited for DNS propagation (15-30 min)
- [ ] Vercel shows "Valid Configuration"
- [ ] Domain resolves to Vercel IPs
- [ ] HTTPS works (SSL certificate active)
- [ ] Website loads correctly

## 🎯 After Setup

Once configured:
- ✅ `shirilangerdesigns.com` → Your Vercel deployment
- ✅ `www.shirilangerdesigns.com` → Redirects to main domain
- ✅ HTTPS automatically enabled
- ✅ Auto-updates with new deployments

## 📞 Need Help?

If domain setup is complex, Vercel provides:
- **Detailed DNS instructions** in dashboard
- **Support** via Vercel dashboard
- **Status page** shows DNS propagation

