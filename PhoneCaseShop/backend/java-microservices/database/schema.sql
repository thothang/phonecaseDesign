-- =============================================
-- Phone Case Shop Database Schema
-- SQL Server Database Script
-- =============================================

-- Create Database (Run this separately if database doesn't exist)
-- CREATE DATABASE PhoneCaseShop;
-- GO
-- USE PhoneCaseShop;
-- GO

-- =============================================
-- 1. USERS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[users] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [name] NVARCHAR(255) NOT NULL,
        [email] NVARCHAR(255) NOT NULL UNIQUE,
        [password] NVARCHAR(255) NOT NULL,
        [role] NVARCHAR(50) NOT NULL DEFAULT 'CUSTOMER', -- CUSTOMER, ADMIN, EMPLOYEE
        [phone] NVARCHAR(20) NULL,
        [address] NVARCHAR(500) NULL,
        [created_at] DATETIME2 DEFAULT GETDATE(),
        [updated_at] DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX IX_users_email ON [dbo].[users]([email]);
    CREATE INDEX IX_users_role ON [dbo].[users]([role]);
END
GO

-- =============================================
-- 2. PRODUCTS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[products] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [name] NVARCHAR(255) NOT NULL,
        [description] NVARCHAR(1000) NULL,
        [price] DECIMAL(18,2) NOT NULL,
        [category] NVARCHAR(100) NULL,
        [brand] NVARCHAR(100) NULL,
        [model] NVARCHAR(100) NULL,
        [color] NVARCHAR(50) NULL,
        [material] NVARCHAR(100) NULL,
        [image_url] NVARCHAR(500) NULL,
        [stock_quantity] INT DEFAULT 0,
        [is_active] BIT DEFAULT 1,
        [created_at] DATETIME2 DEFAULT GETDATE(),
        [updated_at] DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX IX_products_is_active ON [dbo].[products]([is_active]);
    CREATE INDEX IX_products_category ON [dbo].[products]([category]);
    CREATE INDEX IX_products_brand ON [dbo].[products]([brand]);
END
GO

-- =============================================
-- 3. INVENTORY TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[inventory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[inventory] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [product_id] BIGINT NOT NULL UNIQUE,
        [quantity] INT NOT NULL DEFAULT 0,
        [reserved_quantity] INT DEFAULT 0,
        [available_quantity] AS ([quantity] - [reserved_quantity]),
        [reorder_level] INT DEFAULT 10,
        [last_updated] DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([id]) ON DELETE CASCADE
    );
    
    CREATE INDEX IX_inventory_product_id ON [dbo].[inventory]([product_id]);
END
GO

-- =============================================
-- 4. CUSTOM_DESIGNS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[custom_designs]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[custom_designs] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [user_id] BIGINT NOT NULL,
        [design_name] NVARCHAR(255) NULL,
        [image_data] NVARCHAR(MAX) NULL, -- Base64 encoded image
        [phone_model] NVARCHAR(100) NULL,
        [case_type] NVARCHAR(100) NULL,
        [design_config] NVARCHAR(MAX) NULL, -- JSON configuration
        [created_at] DATETIME2 DEFAULT GETDATE(),
        [updated_at] DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE
    );
    
    CREATE INDEX IX_custom_designs_user_id ON [dbo].[custom_designs]([user_id]);
END
GO

-- =============================================
-- 5. CART_ITEMS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[cart_items]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[cart_items] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [user_id] BIGINT NOT NULL,
        [product_id] BIGINT NULL,
        [design_id] BIGINT NULL,
        [quantity] INT NOT NULL DEFAULT 1,
        [price] DECIMAL(18,2) NOT NULL,
        [created_at] DATETIME2 DEFAULT GETDATE(),
        [updated_at] DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE,
        FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([design_id]) REFERENCES [dbo].[custom_designs]([id]) ON DELETE NO ACTION,
        CHECK ([product_id] IS NOT NULL OR [design_id] IS NOT NULL)
    );
    
    CREATE INDEX IX_cart_items_user_id ON [dbo].[cart_items]([user_id]);
    CREATE INDEX IX_cart_items_product_id ON [dbo].[cart_items]([product_id]);
    CREATE INDEX IX_cart_items_design_id ON [dbo].[cart_items]([design_id]);
END
GO

-- =============================================
-- 6. ORDERS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[orders]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[orders] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [order_number] NVARCHAR(100) NOT NULL UNIQUE,
        [user_id] BIGINT NOT NULL,
        [status] NVARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED
        [total_amount] DECIMAL(18,2) NOT NULL,
        [shipping_address] NVARCHAR(500) NOT NULL,
        [shipping_phone] NVARCHAR(20) NOT NULL,
        [payment_method] NVARCHAR(50) NOT NULL DEFAULT 'COD',
        [payment_status] NVARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, REFUNDED
        [shipping_date] DATETIME2 NULL,
        [delivery_date] DATETIME2 NULL,
        [cancellation_reason] NVARCHAR(500) NULL,
        [return_reason] NVARCHAR(500) NULL,
        [created_at] DATETIME2 DEFAULT GETDATE(),
        [updated_at] DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id])
    );
    
    CREATE INDEX IX_orders_user_id ON [dbo].[orders]([user_id]);
    CREATE INDEX IX_orders_order_number ON [dbo].[orders]([order_number]);
    CREATE INDEX IX_orders_status ON [dbo].[orders]([status]);
    CREATE INDEX IX_orders_created_at ON [dbo].[orders]([created_at]);
END
GO

-- =============================================
-- 7. ORDER_ITEMS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[order_items]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[order_items] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [order_id] BIGINT NOT NULL,
        [product_id] BIGINT NULL,
        [design_id] BIGINT NULL,
        [quantity] INT NOT NULL,
        [price] DECIMAL(18,2) NOT NULL,
        [subtotal] DECIMAL(18,2) NOT NULL,
        FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([id]) ON DELETE CASCADE,
        FOREIGN KEY ([product_id]) REFERENCES [dbo].[products]([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([design_id]) REFERENCES [dbo].[custom_designs]([id]) ON DELETE NO ACTION,
        CHECK ([product_id] IS NOT NULL OR [design_id] IS NOT NULL)
    );
    
    CREATE INDEX IX_order_items_order_id ON [dbo].[order_items]([order_id]);
    CREATE INDEX IX_order_items_product_id ON [dbo].[order_items]([product_id]);
END
GO

-- =============================================
-- 8. PAYMENTS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[payments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[payments] (
        [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
        [order_id] BIGINT NOT NULL UNIQUE,
        [user_id] BIGINT NOT NULL,
        [amount] DECIMAL(18,2) NOT NULL,
        [payment_method] NVARCHAR(50) NOT NULL DEFAULT 'COD',
        [payment_status] NVARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, REFUNDED, FAILED
        [payment_date] DATETIME2 NULL,
        [created_at] DATETIME2 DEFAULT GETDATE(),
        [updated_at] DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY ([order_id]) REFERENCES [dbo].[orders]([id]),
        FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id])
    );
    
    CREATE INDEX IX_payments_order_id ON [dbo].[payments]([order_id]);
    CREATE INDEX IX_payments_user_id ON [dbo].[payments]([user_id]);
    CREATE INDEX IX_payments_status ON [dbo].[payments]([payment_status]);
END
GO

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update updated_at timestamp
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_users_updated_at')
    DROP TRIGGER TR_users_updated_at;
GO

CREATE TRIGGER TR_users_updated_at
ON [dbo].[users]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[users]
    SET [updated_at] = GETDATE()
    FROM [dbo].[users] u
    INNER JOIN inserted i ON u.id = i.id;
END
GO

-- Trigger for products updated_at
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_products_updated_at')
    DROP TRIGGER TR_products_updated_at;
GO

CREATE TRIGGER TR_products_updated_at
ON [dbo].[products]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[products]
    SET [updated_at] = GETDATE()
    FROM [dbo].[products] p
    INNER JOIN inserted i ON p.id = i.id;
END
GO

-- Trigger for orders updated_at
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_orders_updated_at')
    DROP TRIGGER TR_orders_updated_at;
GO

CREATE TRIGGER TR_orders_updated_at
ON [dbo].[orders]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[orders]
    SET [updated_at] = GETDATE()
    FROM [dbo].[orders] o
    INNER JOIN inserted i ON o.id = i.id;
END
GO

-- Trigger for payments updated_at
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_payments_updated_at')
    DROP TRIGGER TR_payments_updated_at;
GO

CREATE TRIGGER TR_payments_updated_at
ON [dbo].[payments]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[payments]
    SET [updated_at] = GETDATE()
    FROM [dbo].[payments] p
    INNER JOIN inserted i ON p.id = i.id;
END
GO

-- Trigger for custom_designs updated_at
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_custom_designs_updated_at')
    DROP TRIGGER TR_custom_designs_updated_at;
GO

CREATE TRIGGER TR_custom_designs_updated_at
ON [dbo].[custom_designs]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[custom_designs]
    SET [updated_at] = GETDATE()
    FROM [dbo].[custom_designs] cd
    INNER JOIN inserted i ON cd.id = i.id;
END
GO

-- Trigger for cart_items updated_at
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_cart_items_updated_at')
    DROP TRIGGER TR_cart_items_updated_at;
GO

CREATE TRIGGER TR_cart_items_updated_at
ON [dbo].[cart_items]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[cart_items]
    SET [updated_at] = GETDATE()
    FROM [dbo].[cart_items] ci
    INNER JOIN inserted i ON ci.id = i.id;
END
GO

PRINT 'Database schema created successfully!';
GO

