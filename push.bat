@echo off
cd /d "e:\Merged-project-Dan\orchids-escape-houses"
git add scripts/check-*.ts scripts/test-*.ts scripts/check-auth-db.ts
git commit -m "Fix all mismatched quotes in script imports"
git push origin main
echo Done!
pause
