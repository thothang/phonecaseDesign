# Script để dừng tất cả Java services (Microservices)
# Sử dụng: .\stop-all-services.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dừng tất cả Java Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra các Java processes đang chạy
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue

if ($javaProcesses) {
    Write-Host "Tìm thấy $($javaProcesses.Count) Java process(es) đang chạy:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($proc in $javaProcesses) {
        Write-Host "  PID: $($proc.Id) - Memory: $([math]::Round($proc.WS / 1MB, 2)) MB" -ForegroundColor Gray
    }
    
    Write-Host ""
    $confirm = Read-Host "Bạn có muốn dừng TẤT CẢ các Java processes? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host ""
        Write-Host "Đang dừng các processes..." -ForegroundColor Yellow
        
        foreach ($proc in $javaProcesses) {
            try {
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Host "  ✓ Đã dừng PID: $($proc.Id)" -ForegroundColor Green
            } catch {
                Write-Host "  ✗ Không thể dừng PID: $($proc.Id)" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        Write-Host "Hoàn thành!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Đã hủy." -ForegroundColor Yellow
    }
} else {
    Write-Host "Không tìm thấy Java process nào đang chạy." -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

