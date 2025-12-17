# Testing and Validation Guide
## Hospital Bed Management System

This guide explains how to run tests and validations on the HBMS system.

---

## Quick Start

### Run All Tests
```bash
cd hospital-bed-frontend
npm test
```

This will run:
1. ESLint code quality checks
2. Production build verification

### Run Individual Checks

#### Linting Only
```bash
npm run lint
```

#### Build Only
```bash
npm run build
```

#### Import Validation
```bash
npm run validate
```

---

## Test Scripts Overview

### 1. `npm test`
**Purpose:** Comprehensive system check  
**What it does:**
- Runs ESLint to check code quality
- Builds the project to verify no compilation errors
- Ensures all imports are valid

**Expected Result:** Exit code 0 (success)

### 2. `npm run lint`
**Purpose:** Code quality and style check  
**What it does:**
- Scans all `.js` and `.jsx` files in `src/`
- Reports errors and warnings
- Checks React hooks dependencies
- Verifies prop types

**Acceptable Output:**
- 0 errors
- 32 warnings (non-critical)

### 3. `npm run build`
**Purpose:** Production build verification  
**What it does:**
- Transpiles and bundles all code
- Optimizes assets
- Generates source maps
- Creates production-ready files in `dist/`

**Expected Output:**
- Build completes successfully
- All assets generated
- Bundle size warnings are acceptable

### 4. `npm run validate`
**Purpose:** Import validation  
**What it does:**
- Attempts to dynamically import all source files
- Catches broken imports and syntax errors
- Reports missing dependencies

---

## Manual Testing

### Development Server
```bash
npm run dev
```

Then open http://localhost:5000 in your browser.

### Manual Route Testing

Test each route to ensure it renders:

**Public Routes:**
- `/` - Landing page
- `/login` - Login form
- `/register` - Registration form
- `/access-denied` - Access denied page
- `/nonexistent` - 404 page

**Protected Routes** (requires authentication):
- `/dashboard` - Role-based redirect
- `/dashboard/admin` - Admin dashboard
- `/dashboard/doctor` - Doctor dashboard
- `/dashboard/nurse` - Nurse dashboard
- `/dashboard/reception` - Reception dashboard
- `/beds` - Bed management
- `/patients` - Patient list
- `/patients/:id` - Patient details
- `/appointments` - Appointment management

---

## System Check Utilities

### Browser Console System Check

Open the browser console and run:
```javascript
window.systemCheck()
```

This will:
- Test all critical imports
- Report success/failure for each component
- Show overall system health

### Accessibility Testing

```javascript
window.a11yTest.runAll()
```

This will:
- Check keyboard navigation
- Verify ARIA labels
- Test focus management
- Check reduced motion preferences

---

## Continuous Integration

### CI/CD Pipeline

For automated testing in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Build for production
  run: npm run build

- name: Validate imports
  run: npm run validate
```

---

## Troubleshooting

### Common Issues

#### "Module not found" errors
**Solution:** Run `npm install` to ensure all dependencies are installed.

#### ESLint warnings
**Solution:** Most warnings are acceptable. Run `npm run lint:fix` to auto-fix style issues.

#### Build fails with memory error
**Solution:** Increase Node.js memory limit:
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

#### Firebase connection errors during tests
**Note:** These are expected if Firebase credentials are not configured. The code structure is still validated.

---

## Test Results Interpretation

### Exit Codes
- `0` - All tests passed
- `1` - Tests failed (check output for details)

### Warning Categories

**Acceptable Warnings:**
- Console statements in development tools
- React Hook dependencies (if verified as correct)
- Arrow function style preferences
- Unused fragments in deprecated files

**Critical Errors:**
- Import errors
- Syntax errors
- Missing dependencies
- Build failures

---

## Automated Testing (Future Enhancement)

To add unit tests in the future:

1. Install testing libraries:
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. Create test files:
   ```
   src/
   ├── components/
   │   └── Button.jsx
   │   └── Button.test.jsx
   ```

3. Add test script to package.json:
   ```json
   "test:unit": "vitest"
   ```

---

## Performance Testing

### Build Performance
Monitor these metrics:
- Build time: < 10 seconds (acceptable)
- Bundle size: Main chunk < 500 KB (warning is acceptable)
- Gzip size: < 150 KB (good)

### Runtime Performance
- First load: < 1 second
- Route navigation: < 200ms
- HMR updates: < 100ms

---

## Security Testing

### Dependency Auditing
```bash
npm audit
```

Review and fix critical vulnerabilities.

### Firebase Security
Ensure:
- API keys are in `.env` (not hardcoded)
- Firestore rules are properly configured
- Authentication is enforced on protected routes

---

## Documentation

For detailed test results, see:
- [SYSTEM_VALIDATION_REPORT.md](./SYSTEM_VALIDATION_REPORT.md) - Complete system validation
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Firebase testing procedures

---

## Support

If tests fail unexpectedly:
1. Check the error message carefully
2. Ensure all dependencies are installed
3. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
4. Check Firebase configuration in `.env`
5. Review the validation report for known issues

---

**Last Updated:** December 17, 2025
