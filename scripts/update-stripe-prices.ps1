# Update Stripe Price IDs on Vercel
# New pricing structure

Write-Host "Updating Stripe Price IDs on Vercel..." -ForegroundColor Cyan

# New Price IDs
$priceIds = @{
    "STRIPE_PRICE_BASIC_MONTHLY" = "price_1SlA8rI0J9sqa21Cpr3kyVzE"
    "STRIPE_PRICE_BASIC_YEARLY" = "price_1SlA97I0J9sqa21Cs4lB88Zd"
    "STRIPE_PRICE_PREMIUM_MONTHLY" = "price_1SlA9zI0J9sqa21C5otPYqAU"
    "STRIPE_PRICE_PREMIUM_YEARLY" = "price_1SlAAMI0J9sqa21CgTlHU0xg"
    "STRIPE_PRICE_ENTERPRISE_MONTHLY" = "price_1SlAAtI0J9sqa21CYrz1BcfW"
    "STRIPE_PRICE_ENTERPRISE_YEARLY" = "price_1SlABDI0J9sqa21CMj7l3PUz"
}

# Update each environment variable for all environments
foreach ($key in $priceIds.Keys) {
    $value = $priceIds[$key]
    Write-Host "Updating $key = $value" -ForegroundColor Yellow
    
    # Update for Production, Preview, and Development
    vercel env rm $key production --yes 2>$null
    vercel env rm $key preview --yes 2>$null
    vercel env rm $key development --yes 2>$null
    
    echo $value | vercel env add $key production
    echo $value | vercel env add $key preview
    echo $value | vercel env add $key development
}

Write-Host "All Stripe price IDs updated successfully!" -ForegroundColor Green
Write-Host "Now redeploy your project on Vercel" -ForegroundColor Cyan
