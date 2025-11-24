-- =============================================
-- Phone Case Shop - Sample Data
-- SQL Server Sample Data Script
-- =============================================

USE PhoneCaseShop;
GO

-- =============================================
-- 1. INSERT SAMPLE USERS
-- =============================================

-- Admin User (password: admin123)
INSERT INTO [dbo].[users] ([name], [email], [password], [role], [phone], [address])
VALUES 
    ('Admin User', 'admin@phonecase.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', '0123456789', '123 Admin Street, City'),
    ('Employee User', 'employee@phonecase.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLOYEE', '0987654321', '456 Employee Street, City'),
    ('Customer 1', 'customer1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', '0111111111', '789 Customer Street, City'),
    ('Customer 2', 'customer2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', '0222222222', '321 Customer Avenue, City');

-- Note: Password hash is for 'password123' - Change this in production!
-- To generate new password hash, use BCrypt with cost 10

GO

-- =============================================
-- 2. INSERT SAMPLE PRODUCTS
-- =============================================

INSERT INTO [dbo].[products] ([name], [description], [price], [category], [brand], [model], [color], [material], [image_url], [stock_quantity], [is_active])
VALUES
    ('iPhone 15 Pro Max Case', 'Premium protective case for iPhone 15 Pro Max with shock absorption', 29.99, 'Phone Case', 'Apple', 'iPhone 15 Pro Max', 'Black', 'Silicone', 'https://example.com/images/iphone15pm-black.jpg', 100, 1),
    ('Samsung Galaxy S24 Ultra Case', 'Durable case for Samsung Galaxy S24 Ultra with camera protection', 34.99, 'Phone Case', 'Samsung', 'Galaxy S24 Ultra', 'Blue', 'TPU', 'https://example.com/images/s24ultra-blue.jpg', 80, 1),
    ('iPhone 14 Case - Clear', 'Crystal clear case showing your phone design', 19.99, 'Phone Case', 'Apple', 'iPhone 14', 'Clear', 'Polycarbonate', 'https://example.com/images/iphone14-clear.jpg', 150, 1),
    ('Google Pixel 8 Pro Case', 'Protective case with MagSafe compatibility', 27.99, 'Phone Case', 'Google', 'Pixel 8 Pro', 'Red', 'Silicone', 'https://example.com/images/pixel8pro-red.jpg', 60, 1),
    ('OnePlus 12 Case', 'Rugged case for OnePlus 12 with extra protection', 24.99, 'Phone Case', 'OnePlus', 'OnePlus 12', 'Green', 'TPU', 'https://example.com/images/oneplus12-green.jpg', 90, 1),
    ('iPhone 13 Mini Case', 'Compact case for iPhone 13 Mini', 17.99, 'Phone Case', 'Apple', 'iPhone 13 Mini', 'Pink', 'Silicone', 'https://example.com/images/iphone13mini-pink.jpg', 120, 1),
    ('Samsung Galaxy S23 Case', 'Slim protective case for Galaxy S23', 22.99, 'Phone Case', 'Samsung', 'Galaxy S23', 'Purple', 'TPU', 'https://example.com/images/s23-purple.jpg', 110, 1),
    ('Custom Design Case', 'Create your own custom design', 39.99, 'Custom', 'Custom', 'All Models', 'Custom', 'Various', 'https://example.com/images/custom.jpg', 0, 1);

GO

-- =============================================
-- 3. INSERT INVENTORY DATA
-- =============================================

INSERT INTO [dbo].[inventory] ([product_id], [quantity], [reserved_quantity], [reorder_level])
SELECT 
    [id],
    [stock_quantity],
    0,
    10
FROM [dbo].[products]
WHERE [is_active] = 1;

GO

-- =============================================
-- 4. INSERT SAMPLE CUSTOM DESIGNS
-- =============================================

INSERT INTO [dbo].[custom_designs] ([user_id], [design_name], [phone_model], [case_type], [design_config])
VALUES
    (3, 'My Custom Design 1', 'iPhone 15 Pro Max', 'Clear Case', '{"background": "blue", "text": "Hello World"}'),
    (3, 'Personalized Case', 'Samsung Galaxy S24 Ultra', 'Protective Case', '{"image": "base64...", "position": "center"}'),
    (4, 'Gaming Theme', 'iPhone 14', 'Gaming Case', '{"theme": "gaming", "colors": ["red", "black"]}');

GO

-- =============================================
-- 5. INSERT SAMPLE CART ITEMS
-- =============================================

INSERT INTO [dbo].[cart_items] ([user_id], [product_id], [quantity], [price])
VALUES
    (3, 1, 2, 29.99),
    (3, 3, 1, 19.99),
    (4, 2, 1, 34.99);

GO

-- =============================================
-- 6. INSERT SAMPLE ORDERS
-- =============================================

INSERT INTO [dbo].[orders] ([order_number], [user_id], [status], [total_amount], [shipping_address], [shipping_phone], [payment_method], [payment_status], [created_at])
VALUES
    ('ORD' + CAST(DATEDIFF(SECOND, '1970-01-01', GETDATE()) AS VARCHAR), 3, 'PENDING', 79.97, '789 Customer Street, City', '0111111111', 'COD', 'PENDING', GETDATE()),
    ('ORD' + CAST(DATEDIFF(SECOND, '1970-01-01', GETDATE()) + 1 AS VARCHAR), 3, 'PROCESSING', 49.98, '789 Customer Street, City', '0111111111', 'COD', 'PENDING', DATEADD(DAY, -1, GETDATE())),
    ('ORD' + CAST(DATEDIFF(SECOND, '1970-01-01', GETDATE()) + 2 AS VARCHAR), 4, 'SHIPPED', 34.99, '321 Customer Avenue, City', '0222222222', 'COD', 'PENDING', DATEADD(DAY, -2, GETDATE()));

GO

-- =============================================
-- 7. INSERT ORDER ITEMS
-- =============================================

DECLARE @Order1Id BIGINT = (SELECT TOP 1 [id] FROM [dbo].[orders] ORDER BY [created_at] DESC);
DECLARE @Order2Id BIGINT = (SELECT TOP 1 [id] FROM [dbo].[orders] ORDER BY [created_at] DESC OFFSET 1 ROW);
DECLARE @Order3Id BIGINT = (SELECT TOP 1 [id] FROM [dbo].[orders] ORDER BY [created_at] DESC OFFSET 2 ROW);

INSERT INTO [dbo].[order_items] ([order_id], [product_id], [quantity], [price], [subtotal])
VALUES
    (@Order1Id, 1, 2, 29.99, 59.98),
    (@Order1Id, 3, 1, 19.99, 19.99),
    (@Order2Id, 1, 1, 29.99, 29.99),
    (@Order2Id, 3, 1, 19.99, 19.99),
    (@Order3Id, 2, 1, 34.99, 34.99);

GO

-- =============================================
-- 8. INSERT PAYMENTS
-- =============================================

DECLARE @Order1Id BIGINT = (SELECT TOP 1 [id] FROM [dbo].[orders] ORDER BY [created_at] DESC);
DECLARE @Order2Id BIGINT = (SELECT TOP 1 [id] FROM [dbo].[orders] ORDER BY [created_at] DESC OFFSET 1 ROW);
DECLARE @Order3Id BIGINT = (SELECT TOP 1 [id] FROM [dbo].[orders] ORDER BY [created_at] DESC OFFSET 2 ROW);

INSERT INTO [dbo].[payments] ([order_id], [user_id], [amount], [payment_method], [payment_status])
VALUES
    (@Order1Id, 3, 79.97, 'COD', 'PENDING'),
    (@Order2Id, 3, 49.98, 'COD', 'PENDING'),
    (@Order3Id, 4, 34.99, 'COD', 'PENDING');

GO

PRINT 'Sample data inserted successfully!';
PRINT '';
PRINT 'Default login credentials:';
PRINT 'Admin: admin@phonecase.com / password123';
PRINT 'Employee: employee@phonecase.com / password123';
PRINT 'Customer: customer1@example.com / password123';
PRINT '';
PRINT 'NOTE: Please change passwords in production!';
GO


