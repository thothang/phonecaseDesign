# Phone Case Shop - Frontend

Frontend application được xây dựng bằng React + Vite, kết nối với backend microservices qua API Gateway.

## Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn

## Cài đặt

1. **Cài đặt dependencies:**

```bash
cd front-end
npm install
```

## Chạy ứng dụng

### Bước 1: Đảm bảo Backend đã chạy

**QUAN TRỌNG**: Frontend cần backend đã chạy để hoạt động. Đảm bảo:

1. **Eureka Server** đã chạy (port 8761)
2. **API Gateway** đã chạy (port 8080)
3. **Các Microservices** đã chạy và đăng ký với Eureka:
   - Auth Service (port 8081)
   - User Service (port 8082)
   - Product Service (port 8083)
   - Design Service (port 8084)
   - Cart Service (port 8085)
   - Order Service (port 8086)
   - Payment Service (port 8087)
   - Inventory Service (port 8088)
   - Statistics Service (port 8089)

### Bước 2: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173** (hoặc port khác nếu 5173 đã được sử dụng)

## Cấu hình API

Frontend được cấu hình để gọi API qua **API Gateway** tại port **8080**.

### API Endpoints

Tất cả các API requests được định tuyến qua API Gateway:

- **Auth**: `http://localhost:8080/api/auth/*` hoặc `http://localhost:8080/login`, `http://localhost:8080/register`
- **User**: `http://localhost:8080/api/users/*`
- **Product**: `http://localhost:8080/api/products/*`
- **Design**: `http://localhost:8080/api/designs/*`
- **Cart**: `http://localhost:8080/api/cart/*`
- **Order**: `http://localhost:8080/api/orders/*`
- **Payment**: `http://localhost:8080/api/payments/*`
- **Admin**: `http://localhost:8080/api/admin/*`

## Cấu trúc Project

```
front-end/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # React components
│   ├── context/      # React Context providers
│   ├── hook/         # Custom React hooks
│   ├── pages/        # Page components
│   ├── util/         # Utility functions
│   └── mocks/        # MSW mock handlers (dev only)
├── public/           # Static files
└── package.json
```

## Tính năng

- ✅ Đăng ký / Đăng nhập người dùng
- ✅ Xem danh sách sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Quản lý giỏ hàng
- ✅ Tùy chỉnh thiết kế ốp lưng (Custom Design)
- ✅ Đặt hàng và thanh toán
- ✅ Quản lý đơn hàng
- ✅ Trang quản trị (Admin Dashboard)

## Troubleshooting

### Lỗi: "Network Error" hoặc "CORS Error"

**Nguyên nhân**: Backend chưa chạy hoặc API Gateway chưa sẵn sàng.

**Giải pháp**:
1. Kiểm tra API Gateway đã chạy: http://localhost:8080
2. Kiểm tra Eureka Dashboard: http://localhost:8761
3. Đảm bảo tất cả services đã đăng ký với Eureka

### Lỗi: "401 Unauthorized"

**Nguyên nhân**: Token JWT hết hạn hoặc không hợp lệ.

**Giải pháp**: Đăng nhập lại để lấy token mới.

### Frontend không kết nối được với Backend

**Kiểm tra**:
1. Backend services đã chạy chưa?
2. API Gateway (port 8080) có đang chạy không?
3. CORS đã được cấu hình đúng chưa?
4. Kiểm tra Network tab trong Browser DevTools để xem request/response

## Build cho Production

```bash
npm run build
```

Files build sẽ được tạo trong thư mục `dist/`.

## Preview Production Build

```bash
npm run preview
```
