#!/usr/bin/env node

/**
 * Environment Setup Script for Arthik Invoice Management System
 * This script creates .env files with proper configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Arthik Invoice Management System...\n');

// Server .env content
const serverEnvContent = `NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/arthik-invoice
JWT_SECRET=arthik_jwt_secret_key_change_in_production_2024
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
`;

// Client .env content
const clientEnvContent = `VITE_API_BASE_URL=http://localhost:5001/api/v1
`;

// Create server .env file
const serverEnvPath = path.join(__dirname, 'server', '.env');
try {
  if (fs.existsSync(serverEnvPath)) {
    console.log('⚠️  Server .env file already exists. Skipping...');
  } else {
    fs.writeFileSync(serverEnvPath, serverEnvContent);
    console.log('✅ Created server/.env file');
  }
} catch (error) {
  console.error('❌ Error creating server/.env:', error.message);
}

// Create client .env file
const clientEnvPath = path.join(__dirname, 'client', '.env');
try {
  if (fs.existsSync(clientEnvPath)) {
    console.log('⚠️  Client .env file already exists. Skipping...');
  } else {
    fs.writeFileSync(clientEnvPath, clientEnvContent);
    console.log('✅ Created client/.env file');
  }
} catch (error) {
  console.error('❌ Error creating client/.env:', error.message);
}

console.log('\n📋 Setup Summary:');
console.log('================');
console.log('Server Port: 5001');
console.log('Client Port: 5173 (Vite default)');
console.log('MongoDB: mongodb://localhost:27017/arthik-invoice');
console.log('\n⚡ Next Steps:');
console.log('1. Make sure MongoDB is installed and running');
console.log('   - Windows: Download from https://www.mongodb.com/try/download/community');
console.log('   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
console.log('2. Install dependencies:');
console.log('   cd server && npm install');
console.log('   cd ../client && npm install');
console.log('3. Start the servers:');
console.log('   Terminal 1: cd server && npm run dev');
console.log('   Terminal 2: cd client && npm run dev');
console.log('\n✨ Happy Invoicing! ✨\n');

