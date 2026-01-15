#!/usr/bin/env pwsh
Set-Location "e:\Merged-project-Dan\orchids-escape-houses"
Write-Host "Committing changes..." -ForegroundColor Green
git add src/components/auth/UnifiedAuthForm.tsx
git commit -m "Fix email input disabled and CSS preload warnings on login pages"
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main
Write-Host "Complete!" -ForegroundColor Green
