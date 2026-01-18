# Script để chạy cả Shell và Dashboard cùng lúc
# Cách dùng: .\start-all.ps1

Write-Host "🚀 Bắt đầu chạy Micro Frontend..." -ForegroundColor Green
Write-Host ""
Write-Host "📦 Terminal 1: Đang khởi động Dashboard (Port 4201)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run start:dashboard"

Start-Sleep -Seconds 3

Write-Host "📦 Terminal 2: Đang khởi động Shell (Port 4200)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run start:shell"

Write-Host ""
Write-Host "✅ Đã khởi động cả hai ứng dụng!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Shell sẽ chạy ở: http://localhost:4200" -ForegroundColor Cyan
Write-Host "📍 Dashboard sẽ chạy ở: http://localhost:4201" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Mở trình duyệt và vào http://localhost:4200" -ForegroundColor Yellow
Write-Host "💡 Click vào link 'Xem Dashboard (Remote)' để test Micro Frontend!" -ForegroundColor Yellow
