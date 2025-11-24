# Database Setup Guide

Hướng dẫn thiết lập database cho hệ thống Phone Case Shop Microservices.

## Yêu cầu

- SQL Server 2019 hoặc cao hơn
- SQL Server Management Studio (SSMS)
- Quyền tạo database và user

## Các bước thiết lập

### Bước 1: Tạo Database

1. Mở SQL Server Management Studio (SSMS)
2. Kết nối với SQL Server instance
3. Tạo database mới:

```sql
CREATE DATABASE PhoneCaseShop;
GO
```

Hoặc sử dụng SQL Server Authentication với username/password của bạn.

### Bước 2: Chạy Schema Script

1. Mở file `schema.sql` trong SSMS
2. Đảm bảo đã chọn database `PhoneCaseShop`
3. Chạy toàn bộ script (F5 hoặc Execute)
4. Kiểm tra các bảng đã được tạo thành công

### Bước 3: Chạy Sample Data (Tùy chọn)

1. Mở file `sample_data.sql` trong SSMS
2. Đảm bảo đã chọn database `PhoneCaseShop`
3. Chạy script để insert dữ liệu mẫu

**Lưu ý**: Sample data bao gồm:
- 4 users (1 admin, 1 employee, 2 customers)
- 8 products
- Inventory data
- Sample orders và payments

### Bước 4: Cấu hình Connection String

Cập nhật connection string trong các file `application.yml` của các services:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=PhoneCaseShop;encrypt=false;trustServerCertificate=true
    username: sa  # Thay đổi theo username của bạn
    password: YourPassword123  # Thay đổi theo password của bạn
```

## Cấu trúc Database

### Các bảng chính:

1. **users** - Thông tin người dùng
2. **products** - Sản phẩm
3. **inventory** - Tồn kho
4. **custom_designs** - Thiết kế tùy chỉnh
5. **cart_items** - Giỏ hàng
6. **orders** - Đơn hàng
7. **order_items** - Chi tiết đơn hàng
8. **payments** - Thanh toán

### Relationships:

```
users (1) ──< (N) custom_designs
users (1) ──< (N) cart_items
users (1) ──< (N) orders
users (1) ──< (N) payments

products (1) ──< (1) inventory
products (1) ──< (N) cart_items
products (1) ──< (N) order_items

orders (1) ──< (1) payments
orders (1) ──< (N) order_items

custom_designs (1) ──< (N) cart_items
custom_designs (1) ──< (N) order_items
```

## Indexes

Database đã được tối ưu với các indexes:

- `IX_users_email` - Tìm kiếm user theo email
- `IX_products_is_active` - Lọc sản phẩm active
- `IX_orders_order_number` - Tìm kiếm order theo số đơn
- `IX_orders_status` - Lọc order theo trạng thái
- Và nhiều indexes khác cho performance

## Triggers

Các triggers tự động cập nhật `updated_at` timestamp:

- `TR_users_updated_at`
- `TR_products_updated_at`
- `TR_orders_updated_at`
- `TR_payments_updated_at`
- `TR_custom_designs_updated_at`
- `TR_cart_items_updated_at`

## Sample Data Credentials

Nếu đã chạy `sample_data.sql`, bạn có thể đăng nhập với:

**Admin:**
- Email: `admin@phonecase.com`
- Password: `password123`

**Employee:**
- Email: `employee@phonecase.com`
- Password: `password123`

**Customer:**
- Email: `customer1@example.com`
- Password: `password123`

**⚠️ LƯU Ý QUAN TRỌNG**: 
- Các password trong sample data đã được hash bằng BCrypt
- Trong production, bạn PHẢI thay đổi tất cả passwords
- Không sử dụng sample data trong môi trường production

## Troubleshooting

### Lỗi: Cannot connect to SQL Server

1. Kiểm tra SQL Server đã chạy chưa
2. Kiểm tra SQL Server Browser service
3. Kiểm tra firewall settings
4. Kiểm tra TCP/IP protocol đã enable chưa

### Lỗi: Login failed

1. Kiểm tra username/password
2. Kiểm tra SQL Server Authentication mode
3. Kiểm tra user có quyền tạo database

### Lỗi: Foreign key constraint

1. Đảm bảo đã chạy schema.sql trước
2. Kiểm tra thứ tự insert data
3. Kiểm tra foreign key relationships

## Backup và Restore

### Backup Database:

```sql
BACKUP DATABASE PhoneCaseShop
TO DISK = 'C:\Backup\PhoneCaseShop.bak'
WITH FORMAT;
```

### Restore Database:

```sql
RESTORE DATABASE PhoneCaseShop
FROM DISK = 'C:\Backup\PhoneCaseShop.bak'
WITH REPLACE;
```

## Maintenance

### Xóa tất cả dữ liệu (giữ lại schema):

```sql
USE PhoneCaseShop;
GO

DELETE FROM [payments];
DELETE FROM [order_items];
DELETE FROM [orders];
DELETE FROM [cart_items];
DELETE FROM [custom_designs];
DELETE FROM [inventory];
DELETE FROM [products];
DELETE FROM [users];
GO
```

### Xóa database:

```sql
USE master;
GO
DROP DATABASE PhoneCaseShop;
GO
```

## Performance Tips

1. **Regular Index Maintenance**: Chạy index rebuild định kỳ
2. **Statistics Update**: Cập nhật statistics thường xuyên
3. **Backup Strategy**: Backup database hàng ngày
4. **Monitor Queries**: Sử dụng SQL Server Profiler để monitor slow queries

## Liên hệ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. SQL Server logs
2. Application logs
3. Connection string configuration


