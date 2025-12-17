#!/usr/bin/env node
/**
 * Component Import Validation Script
 * 
 * Validates that all components can be imported without errors.
 * Useful for catching broken imports, missing files, or syntax errors.
 */

import { readdir } from 'fs/promises';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, '..', 'src');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!file.name.startsWith('.') && file.name !== 'node_modules') {
        await getAllFiles(filePath, fileList);
      }
    } else {
      // Only include JS and JSX files
      if (['.js', '.jsx'].includes(extname(file.name))) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

async function validateImports() {
  console.log(`${colors.blue}🔍 Starting Component Import Validation...${colors.reset}\n`);
  
  const startTime = Date.now();
  const files = await getAllFiles(srcDir);
  
  console.log(`Found ${files.length} source files to validate\n`);
  
  let passed = 0;
  let failed = 0;
  const errors = [];
  
  for (const file of files) {
    const relativePath = relative(srcDir, file);
    
    try {
      // Try to import the file dynamically
      await import(file);
      passed++;
      console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
    } catch (error) {
      failed++;
      errors.push({ file: relativePath, error: error.message });
      console.log(`${colors.red}✗${colors.reset} ${relativePath}: ${error.message}`);
    }
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.blue}Validation Complete${colors.reset}`);
  console.log('='.repeat(60));
  console.log(`${colors.green}Passed:${colors.reset} ${passed}/${files.length}`);
  console.log(`${colors.red}Failed:${colors.reset} ${failed}/${files.length}`);
  console.log(`${colors.yellow}Duration:${colors.reset} ${duration}s`);
  console.log(`${colors.yellow}Success Rate:${colors.reset} ${((passed / files.length) * 100).toFixed(1)}%`);
  
  if (errors.length > 0) {
    console.log(`\n${colors.red}Errors found:${colors.reset}`);
    errors.forEach(({ file, error }) => {
      console.log(`  ${colors.red}•${colors.reset} ${file}`);
      console.log(`    ${error}`);
    });
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ All imports validated successfully!${colors.reset}`);
    process.exit(0);
  }
}

// Run validation
validateImports().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
