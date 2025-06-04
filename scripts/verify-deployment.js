#!/usr/bin/env node

/**
 * CorestoneGrader Deployment Verification Script
 * Validates that the application is properly configured and ready for production
 */

import fs from 'fs';
import path from 'path';
import http from 'http';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description}`, 'red');
    return false;
  }
}

function checkEnvironmentVariable(varName, required = true) {
  const value = process.env[varName];
  if (value) {
    log(`✓ ${varName} is set`, 'green');
    return true;
  } else if (required) {
    log(`✗ ${varName} is not set (required)`, 'red');
    return false;
  } else {
    log(`⚠ ${varName} is not set (optional)`, 'yellow');
    return true;
  }
}

async function checkEndpoint(port, path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 401) {
        log(`✓ ${description}`, 'green');
        resolve(true);
      } else {
        log(`✗ ${description} (Status: ${res.statusCode})`, 'red');
        resolve(false);
      }
    });

    req.on('error', () => {
      log(`✗ ${description} (Connection failed)`, 'red');
      resolve(false);
    });

    req.on('timeout', () => {
      log(`✗ ${description} (Timeout)`, 'red');
      req.destroy();
      resolve(false);
    });

    req.setTimeout(5000);
    req.end();
  });
}

async function main() {
  log('🚀 CorestoneGrader Deployment Verification', 'blue');
  log('=' * 50, 'blue');

  let allChecks = true;

  // Check required files
  log('\n📁 File Structure Check:', 'blue');
  allChecks &= checkFile('package.json', 'package.json exists');
  allChecks &= checkFile('.env', '.env configuration file exists');
  allChecks &= checkFile('server/index.ts', 'Server entry point exists');
  allChecks &= checkFile('client/src/App.tsx', 'Client application exists');
  allChecks &= checkFile('shared/schema.ts', 'Shared schema exists');
  allChecks &= checkFile('Dockerfile', 'Docker configuration exists');
  allChecks &= checkFile('docker-compose.yml', 'Docker Compose configuration exists');
  allChecks &= checkFile('nginx.conf', 'Nginx configuration exists');

  // Load environment variables
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key] = value;
      }
    });
  }

  // Check required environment variables
  log('\n🔧 Environment Variables Check:', 'blue');
  allChecks &= checkEnvironmentVariable('DATABASE_URL');
  allChecks &= checkEnvironmentVariable('OPENAI_API_KEY');
  allChecks &= checkEnvironmentVariable('SESSION_SECRET');
  allChecks &= checkEnvironmentVariable('NODE_ENV');
  allChecks &= checkEnvironmentVariable('PORT');

  // Check optional environment variables
  log('\n🔧 Optional Environment Variables:', 'blue');
  checkEnvironmentVariable('STRIPE_SECRET_KEY', false);
  checkEnvironmentVariable('VITE_STRIPE_PUBLIC_KEY', false);
  checkEnvironmentVariable('VITE_FIREBASE_API_KEY', false);
  checkEnvironmentVariable('VITE_FIREBASE_PROJECT_ID', false);
  checkEnvironmentVariable('VITE_FIREBASE_APP_ID', false);

  // Check if build artifacts exist
  log('\n🔨 Build Artifacts Check:', 'blue');
  const hasClientBuild = checkFile('client/dist/index.html', 'Client build artifacts exist');
  const hasServerBuild = checkFile('dist/server/index.js', 'Server build artifacts exist');

  if (!hasClientBuild || !hasServerBuild) {
    log('⚠ Build artifacts missing. Run: npm run build', 'yellow');
  }

  // Check application endpoints (if running)
  const port = process.env.PORT || 5000;
  log(`\n🌐 Application Endpoints Check (Port ${port}):`, 'blue');
  
  const healthCheck = await checkEndpoint(port, '/api/health', 'Health endpoint responding');
  const userCheck = await checkEndpoint(port, '/api/user', 'User endpoint responding');
  const rubricCheck = await checkEndpoint(port, '/api/rubrics', 'Rubrics endpoint responding');

  if (!healthCheck || !userCheck || !rubricCheck) {
    log('⚠ Some endpoints not responding. Make sure the application is running.', 'yellow');
  }

  // Check database connectivity (basic check)
  log('\n🗄️ Database Check:', 'blue');
  if (process.env.DATABASE_URL) {
    if (process.env.DATABASE_URL.includes('postgresql://')) {
      log('✓ PostgreSQL connection string format is correct', 'green');
    } else {
      log('✗ Invalid PostgreSQL connection string format', 'red');
      allChecks = false;
    }
  }

  // Check OpenAI API key format
  log('\n🤖 OpenAI API Check:', 'blue');
  if (process.env.OPENAI_API_KEY) {
    if (process.env.OPENAI_API_KEY.startsWith('sk-')) {
      log('✓ OpenAI API key format is correct', 'green');
    } else {
      log('✗ OpenAI API key format appears incorrect', 'red');
      allChecks = false;
    }
  }

  // Security checks
  log('\n🔒 Security Configuration Check:', 'blue');
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
    log('✓ Session secret is sufficiently long', 'green');
  } else {
    log('✗ Session secret should be at least 32 characters long', 'red');
    allChecks = false;
  }

  if (process.env.NODE_ENV === 'production') {
    log('✓ NODE_ENV is set to production', 'green');
  } else {
    log('⚠ NODE_ENV is not set to production', 'yellow');
  }

  // Directory structure check
  log('\n📂 Directory Structure Check:', 'blue');
  checkFile('uploads', 'Uploads directory exists') || fs.mkdirSync('uploads', { recursive: true });
  checkFile('ssl', 'SSL directory exists') || fs.mkdirSync('ssl', { recursive: true });

  // Final report
  log('\n📊 Deployment Verification Summary:', 'blue');
  log('=' * 50, 'blue');

  if (allChecks) {
    log('🎉 All critical checks passed! Application is ready for deployment.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Build the application: npm run build', 'reset');
    log('2. Start with: npm start', 'reset');
    log('3. Or deploy with Docker: docker-compose up -d', 'reset');
  } else {
    log('❌ Some critical checks failed. Please fix the issues above before deploying.', 'red');
    process.exit(1);
  }

  log('\n🔗 Important URLs:', 'blue');
  log(`- Application: http://localhost:${port}`, 'reset');
  log(`- Health Check: http://localhost:${port}/api/health`, 'reset');
  log(`- API Documentation: See README.md`, 'reset');
}

// Run verification
main().catch(console.error);