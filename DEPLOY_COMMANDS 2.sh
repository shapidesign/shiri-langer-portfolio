#!/bin/bash
# Direct Vercel Deployment Script
# Deploys your site directly to Vercel without GitHub

echo "🚀 Direct Vercel Deployment"
echo ""

# Check if logged in
echo "Checking Vercel login status..."
npx vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Not logged in. Logging in now..."
    npx vercel login
fi

echo ""
echo "✅ Ready to deploy!"
echo ""
echo "Deploying to production..."
echo ""

# Deploy to production
npx vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your site should be live at the URL shown above."
echo ""
echo "To add your domain, run:"
echo "  npx vercel domains add shirilangerdesigns.com"

