# Script để kiểm tra các ports đang được sử dụng bởi các services
# Sử dụng: .\check-ports.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kiểm tra Ports của Microservices" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Danh sách ports của các services
$services = @{
    "8761" = "Eureka Server"
    "8080" = "API Gateway"
    "8081" = "Auth Service"
    "8082" = "User Service"
    "8083" = "Product Service"
    "8084" = "Design Service"
    "8085" = "Cart Service"
    "8086" = "Order Service"
    "8087" = "Payment Service"
    "8088" = "Inventory Service"
    "8089" = "Statistics Service"
}

Write-Host "Port    | Service Name          | Status" -ForegroundColor Yellow
Write-Host "--------|-----------------------|--------" -ForegroundColor Yellow

foreach ($port in $services.Keys | Sort-Object) {
    $serviceName = $services[$port]
    $result = netstat -ano | findstr ":$port " | findstr "LISTENING"
    
    if ($result) {
        $pid = ($result -split '\s+')[-1]
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        $processName = if ($process) { $process.ProcessName } else { "Unknown" }
        Write-Host "$port     | $($serviceName.PadRight(21)) | ✓ Running (PID: $pid)" -ForegroundColor Green
    } else {
        Write-Host "$port     | $($serviceName.PadRight(21)) | ✗ Not Running" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

