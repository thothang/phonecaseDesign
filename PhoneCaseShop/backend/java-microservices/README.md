# Phone Case Shop - Microservices Backend

Hệ thống backend microservices cho cửa hàng bán ốp lưng điện thoại, được xây dựng bằng Java Spring Boot với kiến trúc microservices.

## Kiến trúc hệ thống

Hệ thống được chia thành các microservices sau:

1. **Eureka Server** (Port 8761) - Service Discovery
2. **API Gateway** (Port 8080) - Entry point cho tất cả các request
3. **Auth Service** (Port 8081) - Xác thực và đăng nhập với JWT
4. **User Service** (Port 8082) - Quản lý người dùng
5. **Product Service** (Port 8083) - Quản lý sản phẩm và tìm kiếm
6. **Design Service** (Port 8084) - Quản lý thiết kế ốp tùy chỉnh
7. **Cart Service** (Port 8085) - Quản lý giỏ hàng
8. **Order Service** (Port 8086) - Quản lý đơn hàng, theo dõi, cập nhật trạng thái
9. **Payment Service** (Port 8087) - Xử lý thanh toán COD
10. **Inventory Service** (Port 8088) - Quản lý tồn kho
11. **Statistics Service** (Port 8089) - Thống kê và báo cáo

## Yêu cầu hệ thống

- **Java**: JDK 17 hoặc cao hơn
- **Maven**: 3.6+ 
- **SQL Server**: SQL Server 2019+ hoặc SQL Server Express
- **IDE**: IntelliJ IDEA (khuyến nghị)
- **Database**: SQL Server Management Studio (SSMS)

## Cài đặt và Cấu hình

### 1. Cài đặt SQL Server

1. Cài đặt SQL Server và SQL Server Management Studio (SSMS)
2. Tạo database mới với tên `PhoneCaseShop`
3. Cấu hình SQL Server để chấp nhận kết nối:
   - Mở SQL Server Configuration Manager
   - Enable TCP/IP protocol
   - Restart SQL Server service

### 2. Cấu hình Database Connection

Mở file `application.yml` trong mỗi service và cập nhật thông tin kết nối:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=PhoneCaseShop;encrypt=false;trustServerCertificate=true
    username: sa  # Thay đổi theo username của bạn
    password: YourPassword123  # Thay đổi theo password của bạn
```

**Lưu ý**: Cập nhật `username` và `password` trong tất cả các file `application.yml` của các services.

### 3. Cài đặt Dependencies

Mở terminal/command prompt tại thư mục `backend/java-microservices` và chạy:

```bash
mvn clean install
```

Lệnh này sẽ build tất cả các modules và tải về các dependencies cần thiết.

## Chạy ứng dụng

### ⚠️ QUAN TRỌNG: Thứ tự khởi động

**BẮT BUỘC phải chạy theo thứ tự sau:**

1. **Eureka Server** (BẮT BUỘC chạy đầu tiên)
2. **API Gateway** (Sau khi Eureka đã chạy)
3. **Các Microservices** (Có thể chạy song song sau khi Eureka và Gateway đã chạy)

**Lưu ý**: Nếu chạy các services trước khi Eureka Server khởi động, bạn sẽ thấy lỗi "Connection refused". Đây là bình thường - các services sẽ tự động đăng ký lại khi Eureka Server sẵn sàng.

### Cách 1: Chạy từ IntelliJ IDEA (Khuyến nghị)

1. **Mở project trong IntelliJ IDEA**:
   - File → Open → Chọn thư mục `backend/java-microservices`
   - IntelliJ sẽ tự động nhận diện đây là Maven project

2. **Chạy các services theo thứ tự**:

   **Bước 1: Chạy Eureka Server (BẮT BUỘC ĐẦU TIÊN)**
   - Mở file `eureka-server/src/main/java/com/phonecase/eureka/EurekaServerApplication.java`
   - Click chuột phải → Run 'EurekaServerApplication'
   - **Đợi cho đến khi thấy log: "Started EurekaServerApplication"**
   - Kiểm tra Eureka Dashboard: http://localhost:8761
   - **KHÔNG chạy services khác cho đến khi Eureka đã khởi động hoàn toàn**

   **Bước 2: Chạy API Gateway**
   - Mở file `api-gateway/src/main/java/com/phonecase/gateway/ApiGatewayApplication.java`
   - Click chuột phải → Run 'ApiGatewayApplication'
   - Đợi cho đến khi thấy log: "Started ApiGatewayApplication"

   **Bước 3: Chạy các Microservices** (có thể chạy song song sau khi Eureka đã chạy):
   - `AuthServiceApplication` (Port 8081)
   - `UserServiceApplication` (Port 8082)
   - `ProductServiceApplication` (Port 8083)
   - `DesignServiceApplication` (Port 8084)
   - `CartServiceApplication` (Port 8085)
   - `OrderServiceApplication` (Port 8086)
   - `PaymentServiceApplication` (Port 8087)
   - `InventoryServiceApplication` (Port 8088)
   - `StatisticsServiceApplication` (Port 8089)

3. **Kiểm tra Eureka Dashboard**:
   - Mở trình duyệt và truy cập: http://localhost:8761
   - Bạn sẽ thấy tất cả các services đã đăng ký trong phần "Instances currently registered with Eureka"

### Cách 2: Chạy bằng Maven từ Command Line

Mở terminal tại thư mục `backend/java-microservices`:

```bash
# Terminal 1 - Eureka Server
cd eureka-server
mvn spring-boot:run

# Terminal 2 - API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 3 - Auth Service
cd auth-service
mvn spring-boot:run

# Terminal 4 - User Service
cd user-service
mvn spring-boot:run

# Terminal 5 - Product Service
cd product-service
mvn spring-boot:run

# Terminal 6 - Design Service
cd design-service
mvn spring-boot:run

# Terminal 7 - Cart Service
cd cart-service
mvn spring-boot:run

# Terminal 8 - Order Service
cd order-service
mvn spring-boot:run

# Terminal 9 - Payment Service
cd payment-service
mvn spring-boot:run

# Terminal 10 - Inventory Service
cd inventory-service
mvn spring-boot:run

# Terminal 11 - Statistics Service
cd statistics-service
mvn spring-boot:run
```

### Cách 3: Chạy tất cả bằng Run Configuration trong IntelliJ

1. Tạo Run Configuration cho từng service:
   - Run → Edit Configurations
   - Click "+" → Application
   - Đặt tên và chọn Main class cho mỗi service
   - Lưu configuration

2. Tạo Compound Run Configuration:
   - Run → Edit Configurations
   - Click "+" → Compound
   - Chọn tất cả các services
   - Chạy Compound configuration để chạy tất cả cùng lúc

## Troubleshooting (Xử lý lỗi)

### Lỗi: "Connection refused: Connect to http://localhost:8761"

**Nguyên nhân**: Bạn đã chạy các services trước khi Eureka Server khởi động.

**Giải pháp**:
1. **Dừng tất cả services** đang chạy
2. **Chạy Eureka Server trước** và đợi đến khi thấy log "Started EurekaServerApplication"
3. **Sau đó mới chạy các services khác**

**Lưu ý**: Với cấu hình mới, các services sẽ tự động retry kết nối đến Eureka mỗi 5-10 giây. Nếu bạn thấy warning "Connection refused" nhưng service vẫn khởi động thành công, đó là bình thường - service sẽ tự động đăng ký khi Eureka sẵn sàng.

### Lỗi: Service không xuất hiện trong Eureka Dashboard

**Nguyên nhân**: Service chưa đăng ký thành công với Eureka.

**Giải pháp**:
1. Kiểm tra Eureka Server đã chạy: http://localhost:8761
2. Kiểm tra log của service - tìm dòng "registration status: 204" (thành công) hoặc "registration failed" (thất bại)
3. Đảm bảo port của service không bị conflict với service khác
4. Restart service sau khi Eureka đã chạy

### Lỗi: Database connection failed

**Nguyên nhân**: SQL Server chưa chạy hoặc thông tin kết nối sai.

**Giải pháp**:
1. Kiểm tra SQL Server đã chạy
2. Kiểm tra database `PhoneCaseShop` đã được tạo
3. Cập nhật `username` và `password` trong file `application.yml` của từng service

## Kiểm tra hệ thống

### 1. Kiểm tra Eureka Server
- URL: http://localhost:8761
- Xác nhận tất cả services đã đăng ký trong phần "Instances currently registered with Eureka"

### 2. Test API qua API Gateway

Tất cả các API được truy cập qua API Gateway tại port 8080:

**Đăng ký người dùng:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "password123"
}
```

**Đăng nhập:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Lấy danh sách sản phẩm:**
```bash
GET http://localhost:8080/api/products/all
```

**Tìm kiếm sản phẩm:**
```bash
GET http://localhost:8080/api/products/search?keyword=iphone
```

**Đăng nhập Admin:**
```bash
POST http://localhost:8080/api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

## Các chức năng chính

### Cho Khách Hàng (Customer):
- ✅ Đăng ký / Đăng nhập
- ✅ Tìm kiếm sản phẩm
- ✅ Thiết kế ốp tùy chỉnh
- ✅ Quản lý tài khoản
- ✅ Xử lý giỏ hàng
- ✅ Thanh toán (COD)
- ✅ Theo dõi đơn hàng
- ✅ Đăng xuất

### Cho Khách Vãng Lai (Guest):
- ✅ Tìm kiếm sản phẩm
- ✅ Thiết kế ốp tùy chỉnh
- ✅ Đăng ký

### Cho Quản Trị Viên (Admin):
- ✅ Đăng nhập quản trị
- ✅ Quản lý người dùng
- ✅ Quản lý sản phẩm
- ✅ Quản lý tồn kho
- ✅ Quản lý đơn hàng
- ✅ Thống kê

### Cho Nhân Viên (Employee):
- ✅ Quản lý sản phẩm
- ✅ Quản lý tồn kho
- ✅ Quản lý đơn hàng
- ✅ Cập nhật trạng thái đơn hàng (Xử lý, Vận chuyển, Trả hàng, Hủy)

## Cấu trúc Database

Hệ thống sẽ tự động tạo các bảng sau khi chạy lần đầu (nhờ `ddl-auto: update`):

- `users` - Người dùng
- `products` - Sản phẩm
- `custom_designs` - Thiết kế tùy chỉnh
- `cart_items` - Giỏ hàng
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `payments` - Thanh toán
- `inventory` - Tồn kho

## JWT Authentication

Hệ thống sử dụng JWT (JSON Web Token) cho xác thực:

1. Sau khi đăng nhập thành công, client nhận được token
2. Gửi token trong header của các request cần xác thực:
   ```
   Authorization: Bearer <token>
   ```

## Thanh toán COD (Cash on Delivery)

- Thanh toán COD được xử lý tự động khi đơn hàng được giao thành công
- Trạng thái thanh toán: PENDING → PAID (khi đơn hàng DELIVERED)

## Scripts tiện ích

Trong thư mục `backend/java-microservices`, có 2 scripts PowerShell để quản lý services:

### 1. Kiểm tra ports đang được sử dụng

```powershell
.\check-ports.ps1
```

Script này sẽ hiển thị trạng thái của tất cả các services và ports tương ứng:
- ✓ Running: Service đang chạy (kèm PID)
- ✗ Not Running: Service chưa chạy

### 2. Dừng tất cả Java services

```powershell
.\stop-all-services.ps1
```

Script này sẽ:
- Liệt kê tất cả Java processes đang chạy
- Hỏi xác nhận trước khi dừng
- Dừng tất cả các Java processes một cách an toàn

⚠️ **Lưu ý**: Script sẽ dừng TẤT CẢ các Java applications, không chỉ microservices.

## Xử lý lỗi thường gặp

### 1. Lỗi kết nối database
- Kiểm tra SQL Server đã chạy chưa
- Kiểm tra username/password trong application.yml
- Kiểm tra SQL Server đã enable TCP/IP chưa

### 2. Port đã được sử dụng

**Lỗi**: `Port XXXX was already in use`

**Nguyên nhân**: Port đã được sử dụng bởi một process khác (thường là service đã chạy từ trước).

**Giải pháp**:

**Cách 1: Dừng process đang sử dụng port (Khuyến nghị)**

Trên Windows PowerShell:
```powershell
# Tìm process đang sử dụng port
netstat -ano | findstr :8083

# Dừng process (thay PID bằng số từ lệnh trên)
taskkill /F /PID <PID>
```

**Cách 2: Thay đổi port trong application.yml**

Mở file `application.yml` của service và thay đổi port:
```yaml
server:
  port: 8093  # Thay đổi port khác
```

**Cách 3: Sử dụng script tiện ích (Khuyến nghị)**

Trong thư mục `backend/java-microservices`, có 2 scripts PowerShell:

1. **Kiểm tra ports đang được sử dụng:**
```powershell
.\check-ports.ps1
```

2. **Dừng tất cả Java services:**
```powershell
.\stop-all-services.ps1
```

**Cách 4: Dừng tất cả Java processes thủ công (Cẩn thận!)**

```powershell
taskkill /F /IM java.exe
```

⚠️ **Lưu ý**: Cách này sẽ dừng TẤT CẢ các Java applications đang chạy, bao gồm cả các services khác.

### 3. Service không đăng ký được với Eureka
- Kiểm tra Eureka Server đã chạy chưa
- Kiểm tra URL Eureka trong `application.yml`

### 4. Lỗi build Maven
- Xóa thư mục `.m2/repository` và build lại
- Kiểm tra kết nối internet để tải dependencies

### 5. Lỗi UnknownHostException: Failed to resolve 'MSI.mshome.net'

**Lỗi**: `java.net.UnknownHostException: Failed to resolve 'MSI.mshome.net'`

**Nguyên nhân**: Spring Cloud Gateway không thể resolve hostname từ Eureka, thường xảy ra khi Eureka trả về hostname thay vì IP address.

**Giải pháp**: Đã được cấu hình tự động trong tất cả các services:
- `prefer-ip-address: true` - Sử dụng IP address thay vì hostname
- `hostname: localhost` - Đặt hostname là localhost

Nếu vẫn gặp lỗi:
1. Restart tất cả services để áp dụng cấu hình mới
2. Kiểm tra Eureka Dashboard để xem services đã đăng ký với IP address chưa
3. Đảm bảo tất cả services đã được cập nhật với cấu hình mới

## Chạy Frontend

### Yêu cầu

- Node.js >= 18.x
- npm hoặc yarn
- Backend đã chạy (Eureka Server, API Gateway, và các Microservices)

### Các bước

1. **Mở terminal tại thư mục `front-end`:**

```bash
cd ../../front-end
```

2. **Cài đặt dependencies (nếu chưa cài):**

```bash
npm install
```

3. **Chạy frontend:**

```bash
npm run dev
```

4. **Truy cập ứng dụng:**

- Frontend: http://localhost:5173
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761

### Lưu ý

- Frontend được cấu hình để gọi API qua **API Gateway** (port 8080)
- Vite proxy tự động forward requests từ `/api/*` đến `http://localhost:8080`
- Đảm bảo backend đã chạy trước khi chạy frontend

## Tài liệu API và Testing

### Frontend Integration

✅ **Frontend đã được cấu hình để gọi backend:**
- Vite proxy đã được setup trong `vite.config.js`
- Tất cả API calls đã được implement trong `front-end/src/api/`
- Frontend gọi API qua API Gateway (port 8080)

### Test API với Dữ liệu Mẫu

📖 **Xem hướng dẫn chi tiết:** [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

**Tóm tắt nhanh:**

1. **Setup Database:**
   - Chạy `database/schema.sql` để tạo schema
   - Chạy `database/sample_data.sql` để insert dữ liệu mẫu

2. **Tài khoản Test:**
   - Admin: `admin@phonecase.com` / `password123`
   - Customer: `customer1@example.com` / `password123`

3. **Test API:**
   - Postman: Import collection từ `API_TESTING_GUIDE.md`
   - cURL: Sử dụng các commands trong guide
   - Frontend: http://localhost:5173

Tất cả các endpoints được định tuyến qua API Gateway tại port 8080.

## Liên hệ và Hỗ trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Logs của từng service trong console
2. Eureka Dashboard để xem services đã đăng ký chưa
3. Database connection trong SSMS

---

**Lưu ý**: Đảm bảo tất cả các services đã chạy trước khi test API. Thứ tự khởi động quan trọng: Eureka Server → API Gateway → Các services khác.


