# Check .env file configuration
Write-Host "Checking .env file..." -ForegroundColor Cyan

if (Test-Path .env) {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    Write-Host ""
    
    $envContent = Get-Content .env
    $hasDatabaseUrl = $false
    $hasNextAuthSecret = $false
    $hasNextAuthUrl = $false
    
    foreach ($line in $envContent) {
        if ($line -match "^DATABASE_URL=") {
            $hasDatabaseUrl = $true
            $dbUrl = $line -replace '^DATABASE_URL=["'']?(.*)["'']?$', '$1'
            Write-Host "DATABASE_URL found:" -ForegroundColor Yellow
            Write-Host "  $dbUrl" -ForegroundColor Gray
            
            if ($dbUrl -match "^postgresql://" -or $dbUrl -match "^postgres://") {
                Write-Host "  ✓ Valid PostgreSQL URL format" -ForegroundColor Green
            } else {
                Write-Host "  ✗ Invalid format! Must start with postgresql:// or postgres://" -ForegroundColor Red
                Write-Host ""
                Write-Host "Example format:" -ForegroundColor Yellow
                Write-Host '  DATABASE_URL="postgresql://user:password@host:5432/database"' -ForegroundColor Gray
            }
            Write-Host ""
        }
        
        if ($line -match "^NEXTAUTH_SECRET=") {
            $hasNextAuthSecret = $true
        }
        
        if ($line -match "^NEXTAUTH_URL=") {
            $hasNextAuthUrl = $true
        }
    }
    
    Write-Host "--- Summary ---" -ForegroundColor Cyan
    if (-not $hasDatabaseUrl) {
        Write-Host "✗ DATABASE_URL is missing!" -ForegroundColor Red
        Write-Host "  Add this line to .env:" -ForegroundColor Yellow
        Write-Host '  DATABASE_URL="postgresql://user:password@host:5432/database"' -ForegroundColor Gray
    } else {
        Write-Host "✓ DATABASE_URL is present" -ForegroundColor Green
    }
    
    if (-not $hasNextAuthSecret) {
        Write-Host "⚠ NEXTAUTH_SECRET is missing (optional, only needed for admin login)" -ForegroundColor Yellow
    } else {
        Write-Host "✓ NEXTAUTH_SECRET is present" -ForegroundColor Green
    }
    
    if (-not $hasNextAuthUrl) {
        Write-Host "⚠ NEXTAUTH_URL is missing (optional, defaults to http://localhost:3000)" -ForegroundColor Yellow
    } else {
        Write-Host "✓ NEXTAUTH_URL is present" -ForegroundColor Green
    }
    
} else {
    Write-Host "✗ .env file does not exist!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Create a .env file with:" -ForegroundColor Yellow
    Write-Host 'DATABASE_URL="postgresql://user:password@host:5432/database"' -ForegroundColor Gray
    Write-Host 'NEXTAUTH_SECRET="your-secret-key"' -ForegroundColor Gray
    Write-Host 'NEXTAUTH_URL="http://localhost:3000"' -ForegroundColor Gray
}

Write-Host ""
Write-Host "For help, see DATABASE_SETUP.md" -ForegroundColor Cyan