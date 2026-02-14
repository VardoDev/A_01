#!/bin/bash

# Security Check Script for Vardo_Link Project
# This script performs various security checks on the codebase

echo "🔒 Starting Security Audit..."
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

# 1. Check for hardcoded secrets
echo "1️⃣  Checking for hardcoded secrets..."
if grep -r -i -E "(api[_-]?key|secret|password|token|private[_-]?key)" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null | grep -v "// " | grep -v "\/\*" | grep -v "import" | grep -v "export" | grep -v "type" | grep -v "interface"; then
    echo -e "${RED}⚠️  Warning: Potential hardcoded secrets found${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ No hardcoded secrets detected${NC}"
fi
echo ""

# 2. Check for .env files in git
echo "2️⃣  Checking for .env files in git history..."
if git log --all --full-history --pretty=format:"%H" -- .env .env.local 2>/dev/null | head -1; then
    echo -e "${RED}⚠️  Warning: .env files found in git history${NC}"
    echo "   Consider using git-filter-repo to remove them"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ No .env files in git history${NC}"
fi
echo ""

# 3. Check for dangerous functions
echo "3️⃣  Checking for dangerous functions..."
DANGEROUS_FOUND=0
if grep -r "dangerouslySetInnerHTML" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null; then
    echo -e "${RED}⚠️  Found: dangerouslySetInnerHTML${NC}"
    DANGEROUS_FOUND=1
fi
if grep -r "eval(" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null; then
    echo -e "${RED}⚠️  Found: eval()${NC}"
    DANGEROUS_FOUND=1
fi
if [ $DANGEROUS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No dangerous functions found${NC}"
else
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 4. Check npm dependencies
echo "4️⃣  Running npm audit..."
if npm audit --audit-level=moderate 2>/dev/null; then
    echo -e "${GREEN}✅ No moderate or higher vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠️  Vulnerabilities found - run 'npm audit' for details${NC}"
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 5. Check for outdated dependencies
echo "5️⃣  Checking for outdated dependencies..."
OUTDATED=$(npm outdated 2>/dev/null | wc -l)
if [ "$OUTDATED" -gt 1 ]; then
    echo -e "${YELLOW}⚠️  Found $((OUTDATED - 1)) outdated packages${NC}"
    echo "   Run 'npm outdated' for details"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ All dependencies are up to date${NC}"
fi
echo ""

# 6. Check .gitignore
echo "6️⃣  Checking .gitignore configuration..."
GITIGNORE_OK=1
if ! grep -q "\.env" .gitignore 2>/dev/null; then
    echo -e "${RED}⚠️  .env not in .gitignore${NC}"
    GITIGNORE_OK=0
fi
if ! grep -q "node_modules" .gitignore 2>/dev/null; then
    echo -e "${RED}⚠️  node_modules not in .gitignore${NC}"
    GITIGNORE_OK=0
fi
if [ $GITIGNORE_OK -eq 1 ]; then
    echo -e "${GREEN}✅ .gitignore properly configured${NC}"
else
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 7. Check for console.log in production code
echo "7️⃣  Checking for console.log statements..."
CONSOLE_COUNT=$(grep -r "console\." --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null | wc -l)
if [ "$CONSOLE_COUNT" -gt 5 ]; then
    echo -e "${YELLOW}⚠️  Found $CONSOLE_COUNT console statements${NC}"
    echo "   Consider removing console.log from production code"
else
    echo -e "${GREEN}✅ Minimal console statements found${NC}"
fi
echo ""

# 8. Check for TODO/FIXME comments related to security
echo "8️⃣  Checking for security-related TODOs..."
if grep -r -i "TODO.*secur\|FIXME.*secur\|TODO.*auth\|FIXME.*auth" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Security-related TODOs found${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ No security-related TODOs${NC}"
fi
echo ""

# 9. Check TypeScript strict mode
echo "9️⃣  Checking TypeScript configuration..."
if grep -q '"strict": true' tsconfig.json 2>/dev/null; then
    echo -e "${GREEN}✅ TypeScript strict mode enabled${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript strict mode not enabled${NC}"
    echo "   Consider enabling strict mode for better type safety"
fi
echo ""

# 10. Check for security headers in index.html
echo "🔟 Checking security headers in index.html..."
HEADERS_OK=1
if ! grep -q "Content-Security-Policy" index.html 2>/dev/null; then
    echo -e "${YELLOW}⚠️  CSP header not found${NC}"
    HEADERS_OK=0
fi
if ! grep -q "X-Content-Type-Options" index.html 2>/dev/null; then
    echo -e "${YELLOW}⚠️  X-Content-Type-Options not found${NC}"
    HEADERS_OK=0
fi
if [ $HEADERS_OK -eq 1 ]; then
    echo -e "${GREEN}✅ Security headers configured${NC}"
else
    echo "   Note: Some headers may need server-side configuration"
fi
echo ""

# Summary
echo "================================"
echo "📊 Security Audit Summary"
echo "================================"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! No critical issues found.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Found $ISSUES potential security concerns${NC}"
    echo "   Review the output above for details"
    echo "   See SECURITY_AUDIT.md for recommendations"
    exit 1
fi
