
#!/bin/bash

echo "🚀 Deploying CorestoneGrader to VPS..."

# Stop any existing process
pkill -f "node.*index.js" || true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build

# Set environment to production
export NODE_ENV=production

# Start the application with PM2 (if available) or node
if command -v pm2 &> /dev/null; then
    echo "🎯 Starting with PM2..."
    pm2 delete corestoneGrader || true
    pm2 start dist/server/index.js --name corestoneGrader
    pm2 save
else
    echo "🎯 Starting with Node.js..."
    nohup node dist/server/index.js > app.log 2>&1 &
fi

echo "✅ Deployment complete!"
echo "🌐 Application should be running on port 5000"
