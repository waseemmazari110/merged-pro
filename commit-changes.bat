@echo off
cd /d "e:\Merged-project-Dan\orchids-escape-houses"
git add src/components/auth/UnifiedAuthForm.tsx
git commit -m "Fix email input and CSS preload warnings"
git push origin main
echo Done!
pause
