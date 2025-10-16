#!/bin/bash

# Build script for Railway deployment
# This script builds the Angular application and prepares it for Caddy serving

set -e

echo "🚀 Starting Railway build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Angular application for production
echo "🏗️ Building Angular application..."
npm run build:prod

# Create the directory structure that Caddy expects
echo "📁 Setting up deployment structure..."
mkdir -p /srv

# Copy the built application to the serving directory
echo "📋 Copying built files..."
cp -r dist/brgy-konek-web/* /srv/

# Copy Caddyfile to the working directory
echo "📄 Copying Caddyfile..."
cp Caddyfile /srv/

# Set proper permissions
echo "🔐 Setting permissions..."
chmod -R 755 /srv

# Create logs directory for Caddy
mkdir -p /var/log/caddy
chmod 755 /var/log/caddy

# Install Caddy if not present
echo "🔧 Ensuring Caddy is available..."
if ! command -v caddy &> /dev/null; then
    echo "Installing Caddy..."
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
    apt-get update
    apt-get install -y caddy
fi

echo "✅ Build completed successfully!"
echo "📊 Application ready for serving at /srv"
echo "🌐 Caddy will serve the application on port 80/443"
