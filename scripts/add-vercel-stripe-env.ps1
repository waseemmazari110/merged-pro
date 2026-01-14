# Add all Stripe Price environment variables to Vercel
# Run this script: .\scripts\add-vercel-stripe-env.ps1

Write-Host "🔧 Adding Stripe Price IDs to Vercel..." -ForegroundColor Cyan
Write-Host ""

$prices = @{
    "STRIPE_PRICE_BASIC_MONTHLY" = "price_1SkW5KIakKHMdeEkvyqwTFba"
    "STRIPE_PRICE_BASIC_YEARLY" = "price_1SkW5qIakKHMdeEkEZlxCFuV"
    "STRIPE_PRICE_PREMIUM_MONTHLY" = "price_1SkW6HIakKHMdeEklSTV8dDm"
    "STRIPE_PRICE_PREMIUM_YEARLY" = "price_1SkW72IakKHMdeEkXBfUXWsh"
    "STRIPE_PRICE_ENTERPRISE_MONTHLY" = "price_1SkW7PIakKHMdeEkojicRz1N"
    "STRIPE_PRICE_ENTERPRISE_YEARLY" = "price_1SkW7sIakKHMdeEkaxfLtsjI"
}

$environments = @("production", "preview", "development")

foreach ($varName in $prices.Keys) {
    $value = $prices[$varName]
    Write-Host "Adding $varName..." -ForegroundColor Yellow
    
    foreach ($env in $environments) {
        try {
            $value | vercel env add $varName $env 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Added to $env" -ForegroundColor Green
            } else {
                Write-Host "  Already exists in $env (skipping)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "  Already exists in $env (skipping)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

Write-Host "✅ Done! Now removing old variables..." -ForegroundColor Cyan
Write-Host ""

# Remove old incorrectly named variables
$oldVars = @(
    "STRIPE_BASIC_MONTHLY"
    "STRIPE_BASIC_YEARLY"
    "STRIPE_PREMIUM_MONTHLY"
    "STRIPE_PREMIUM_YEARLY"
    "STRIPE_ENTERPRISE_MONTHLY"
    "STRIPE_ENTERPRISE_YEARLY"
)

foreach ($oldVar in $oldVars) {
    Write-Host "Removing old variable: $oldVar..." -ForegroundColor Yellow
    foreach ($env in $environments) {
        try {
            vercel env rm $oldVar $env --yes 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Removed from $env" -ForegroundColor Green
            }
        } catch {
            Write-Host "  Not found in $env (skipping)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

Write-Host "✅ All done! Environment variables updated on Vercel." -ForegroundColor Green
Write-Host ""
Write-Host "📌 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Redeploy your application: vercel --prod"
Write-Host "  2. Or wait for automatic deployment on next git push"
Write-Host ""
