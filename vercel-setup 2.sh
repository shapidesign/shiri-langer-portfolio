#!/bin/bash
# Vercel CLI Setup Script
# This script helps you authenticate with Vercel CLI

echo "🚀 Vercel CLI Setup"
echo ""
echo "Vercel CLI uses OAuth (not SSH keys) for authentication."
echo "SSH keys are for GitHub repository access, not Vercel authentication."
echo ""
echo "Choose an option:"
echo "1. Login to Vercel CLI (will open browser)"
echo "2. Add SSH key to GitHub (for private repo access)"
echo "3. Both"
echo ""
read -p "Enter choice (1/2/3): " choice

case $choice in
  1)
    echo "🔐 Logging into Vercel..."
    npx vercel login
    ;;
  2)
    echo "📋 Your SSH Public Key (add this to GitHub):"
    echo ""
    cat ~/.ssh/vercel_deploy_key.pub
    echo ""
    echo ""
    echo "📍 Go to: GitHub Repo → Settings → Deploy keys → Add deploy key"
    echo "   Then paste the key above"
    ;;
  3)
    echo "🔐 Step 1: Logging into Vercel..."
    npx vercel login
    echo ""
    echo "📋 Step 2: Your SSH Public Key (add this to GitHub):"
    echo ""
    cat ~/.ssh/vercel_deploy_key.pub
    echo ""
    echo "📍 Go to: GitHub Repo → Settings → Deploy keys → Add deploy key"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Setup complete!"

