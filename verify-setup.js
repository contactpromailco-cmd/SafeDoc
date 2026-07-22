#!/usr/bin/env node

/**
 * SafeDoc Workspace - Setup Verification Script
 * Run this script to verify all components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 SafeDoc Workspace - Setup Verification\n');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

function check(description, condition) {
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${description}`);
  condition ? passed++ : failed++;
  return condition;
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function dirExists(dirPath) {
  return fs.existsSync(path.join(__dirname, dirPath)) && 
         fs.statSync(path.join(__dirname, dirPath)).isDirectory();
}

// Check root files
console.log('\n📁 Root Files:');
check('README.md exists', fileExists('README.md'));
check('QUICKSTART.md exists', fileExists('QUICKSTART.md'));
check('package.json exists', fileExists('package.json'));
check('.gitignore exists', fileExists('.gitignore'));

// Check shared package
console.log('\n📦 Shared Package:');
check('Shared directory exists', dirExists('shared'));
check('Shared package.json exists', fileExists('shared/package.json'));
check('Shared tsconfig.json exists', fileExists('shared/tsconfig.json'));
check('Document types defined', fileExists('shared/src/types/documents.ts'));
check('Message types defined', fileExists('shared/src/types/messages.ts'));
check('Crypto utils exist', fileExists('shared/src/utils/crypto.ts'));
check('Validation utils exist', fileExists('shared/src/utils/validation.ts'));

// Check backend
console.log('\n🖥️  Backend Server:');
check('Backend directory exists', dirExists('backend'));
check('Backend package.json exists', fileExists('backend/package.json'));
check('Backend tsconfig.json exists', fileExists('backend/tsconfig.json'));
check('Server entry point exists', fileExists('backend/src/index.ts'));
check('Document Analyzer exists', fileExists('backend/src/services/DocumentAnalyzer.ts'));
check('Document Generator exists', fileExists('backend/src/services/DocumentGenerator.ts'));
check('Threat Intelligence exists', fileExists('backend/src/services/ThreatIntelligence.ts'));
check('Workflow Enhancements exists', fileExists('backend/src/services/WorkflowEnhancements.ts'));
check('State Manager exists', fileExists('backend/src/services/StateManager.ts'));

// Check Chrome extension
console.log('\n🔌 Chrome Extension:');
check('Extension directory exists', dirExists('chrome-extension'));
check('manifest.json exists', fileExists('chrome-extension/manifest.json'));
check('Extension package.json exists', fileExists('chrome-extension/package.json'));
check('Extension vite.config exists', fileExists('chrome-extension/vite.config.ts'));
check('Background script exists', fileExists('chrome-extension/src/background/index.ts'));
check('Content script exists', fileExists('chrome-extension/src/content/index.ts'));
check('Side panel component exists', fileExists('chrome-extension/src/sidepanel/SidePanel.tsx'));
check('Security dashboard exists', fileExists('chrome-extension/src/sidepanel/components/SecurityDashboard.tsx'));

// Check web app
console.log('\n🌐 Web Application:');
check('Web app directory exists', dirExists('web-app'));
check('Web app package.json exists', fileExists('web-app/package.json'));
check('Web app vite.config exists', fileExists('web-app/vite.config.ts'));
check('index.html exists', fileExists('web-app/index.html'));
check('App.tsx exists', fileExists('web-app/src/App.tsx'));
check('Workspace page exists', fileExists('web-app/src/pages/Workspace.tsx'));
check('Document Canvas exists', fileExists('web-app/src/components/DocumentCanvas.tsx'));
check('History Panel exists', fileExists('web-app/src/components/HistoryPanel.tsx'));
check('Risk Visualizer exists', fileExists('web-app/src/components/RiskVisualizer.tsx'));
check('WebSocket store exists', fileExists('web-app/src/store/websocket.ts'));

// Check documentation
console.log('\n📚 Documentation:');
check('ARCHITECTURE.md exists', fileExists('ARCHITECTURE.md'));
check('FEATURES.md exists', fileExists('FEATURES.md'));
check('DEPLOYMENT.md exists', fileExists('DEPLOYMENT.md'));
check('TESTING.md exists', fileExists('TESTING.md'));
check('CONTRIBUTING.md exists', fileExists('CONTRIBUTING.md'));
check('PROJECT_SUMMARY.md exists', fileExists('PROJECT_SUMMARY.md'));
check('FILE_MANIFEST.md exists', fileExists('FILE_MANIFEST.md'));
check('LICENSE exists', fileExists('LICENSE'));

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total:  ${passed + failed}`);
console.log(`📈 Success Rate: ${Math.round(passed / (passed + failed) * 100)}%`);

if (failed === 0) {
  console.log('\n🎉 All checks passed! SafeDoc Workspace is properly set up.');
  console.log('\n📖 Next steps:');
  console.log('   1. Run: npm run install:all');
  console.log('   2. Run: npm run dev');
  console.log('   3. Load extension in Chrome');
  console.log('   4. Visit http://localhost:3000');
  console.log('\n📚 Documentation: README.md, QUICKSTART.md');
} else {
  console.log('\n⚠️  Some files are missing. Please verify the setup.');
  console.log('   Run the build process to generate missing files.');
}

console.log('\n' + '='.repeat(50) + '\n');

process.exit(failed === 0 ? 0 : 1);
