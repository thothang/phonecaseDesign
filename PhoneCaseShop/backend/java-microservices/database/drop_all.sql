-- =============================================
-- Drop All Tables and Objects
-- Use with caution! This will delete all data!
-- =============================================

USE PhoneCaseShop;
GO

-- Disable foreign key constraints
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL"
GO

-- Drop all tables
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[payments]') AND type in (N'U'))
    DROP TABLE [dbo].[payments];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[order_items]') AND type in (N'U'))
    DROP TABLE [dbo].[order_items];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[orders]') AND type in (N'U'))
    DROP TABLE [dbo].[orders];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[cart_items]') AND type in (N'U'))
    DROP TABLE [dbo].[cart_items];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[custom_designs]') AND type in (N'U'))
    DROP TABLE [dbo].[custom_designs];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[inventory]') AND type in (N'U'))
    DROP TABLE [dbo].[inventory];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND type in (N'U'))
    DROP TABLE [dbo].[products];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
    DROP TABLE [dbo].[users];
GO

PRINT 'All tables dropped successfully!';
GO


