# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ DATABASE
## Ứng Dụng Thiết Kế Ốp Lưng Điện Thoại 2D

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mô tả ứng dụng
Ứng dụng cho phép người dùng:
- Upload ảnh thiết kế
- Chọn mẫu ốp lưng (3 mẫu: góc bo, cụm camera vuông, camera dọc)
- Chọn màu ốp lưng (đen, trắng, xanh navy, hồng phấn, trong suốt)
- Tùy chỉnh vị trí, kích thước, góc xoay của ảnh
- Xác nhận thiết kế và xem thông số kỹ thuật

### 1.2. Yêu cầu lưu trữ
Cần lưu trữ đầy đủ thông tin thiết kế để:
- Người dùng có thể chỉnh sửa lại sau này
- Nhà sản xuất có đủ thông số để tái tạo thiết kế
- Tracking được lịch sử và trạng thái đơn hàng

---

## 2. PHÂN TÍCH DỮ LIỆU TỪ CODE

### 2.1. State chính trong component
```javascript
const [design, setDesign] = useState({
  url: null,           // URL ảnh tạm thời (ObjectURL)
  filename: null,      // Tên file gốc
  x: 50,              // Vị trí X (%)
  y: 50,              // Vị trí Y (%)
  scale: 1.0,         // Tỷ lệ phóng (1.0 = 100%)
  rotation: 0         // Góc xoay (độ)
});

const [caseColor, setCaseColor] = useState('#374151');
const [selectedModelId, setSelectedModelId] = useState('model1');
```

### 2.2. Dữ liệu tham chiếu (Reference Data)

**Phone Models:**
```javascript
phoneModels = {
  model1: { id, name, aspectRatio, borderRadius, cameraClasses },
  model2: { id, name, aspectRatio, borderRadius, cameraClasses },
  model3: { id, name, aspectRatio, borderRadius, cameraClasses }
}
```

**Case Colors:**
```javascript
caseColors = [
  { name: 'Đen', value: '#374151' },
  { name: 'Trắng', value: '#F3F4F6' },
  { name: 'Xanh Navy', value: '#1E3A8A' },
  { name: 'Hồng Phấn', value: '#FBCFE8' },
  { name: 'Trong Suốt', value: 'transparent' }
]
```

---

## 3. THIẾT KẾ DATABASE SCHEMA

### 3.1. Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     Users       │
└────────┬────────┘
         │ 1
         │
         │ n
┌────────▼────────┐       n      ┌──────────────────┐
│    Designs      │───────────────│   OrderDetails   │
└────────┬────────┘               └─────────┬────────┘
         │ n                                │ n
         │                                  │
         │ 1                                │ 1
┌────────▼────────┐               ┌────────▼────────┐
│  PhoneModels    │               │     Orders      │
└─────────────────┘               └─────────────────┘
         │ n
         │
         │ 1
┌────────▼────────┐
│   CaseColors    │
└─────────────────┘
```

### 3.2. Schema chi tiết

#### **Bảng 1: `designs` (Bảng chính - Lưu thiết kế)**
| Field | Type | Constraints | Mô tả |
|-------|------|-------------|-------|
| `id` | UUID/VARCHAR(36) | PRIMARY KEY | ID thiết kế |
| `user_id` | VARCHAR(50) | INDEX, NULLABLE | ID người dùng (nếu có auth) |
| `image_url` | VARCHAR(500) | NOT NULL | URL ảnh trên cloud storage |
| `image_filename` | VARCHAR(255) | NOT NULL | Tên file gốc |
| `position_x` | DECIMAL(5,2) | NOT NULL, DEFAULT 50 | Vị trí X (0-100%) |
| `position_y` | DECIMAL(5,2) | NOT NULL, DEFAULT 50 | Vị trí Y (0-100%) |
| `scale` | DECIMAL(3,2) | NOT NULL, DEFAULT 1.0 | Tỷ lệ phóng (0.2-5.0) |
| `rotation` | SMALLINT | NOT NULL, DEFAULT 0 | Góc xoay (0-359°) |
| `phone_model_id` | VARCHAR(20) | NOT NULL, FK | ID mẫu ốp |
| `case_color` | VARCHAR(50) | NOT NULL | Mã màu (#hex hoặc 'transparent') |
| `status` | ENUM | NOT NULL, DEFAULT 'draft' | 'draft', 'confirmed', 'ordered' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tạo |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | Thời gian cập nhật |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Constraints:**
```sql
CHECK (position_x BETWEEN -20 AND 120)
CHECK (position_y BETWEEN -20 AND 120)
CHECK (scale BETWEEN 0.2 AND 5.0)
CHECK (rotation BETWEEN 0 AND 359)
```

#### **Bảng 2: `phone_models` (Tham chiếu - Mẫu ốp)**
| Field | Type | Constraints | Mô tả |
|-------|------|-------------|-------|
| `id` | VARCHAR(20) | PRIMARY KEY | 'model1', 'model2', 'model3' |
| `name` | VARCHAR(100) | NOT NULL | Tên hiển thị |
| `aspect_ratio` | VARCHAR(10) | NOT NULL | '9/18', '9/19.5', '9/19' |
| `border_radius` | VARCHAR(20) | NOT NULL | '3rem', '2.75rem', '2.5rem' |
| `camera_position` | JSON | NOT NULL | Thông tin vị trí camera |
| `is_active` | BOOLEAN | DEFAULT TRUE | Còn sản xuất không |

**Dữ liệu mẫu:**
```sql
INSERT INTO phone_models VALUES
('model1', 'Mẫu 1 (Góc Bo)', '9/18', '3rem', '{"top": "1rem", "right": "1rem"}', TRUE),
('model2', 'Mẫu 2 (Cụm Camera Vuông)', '9/19.5', '2.75rem', '{"top": "1.25rem", "left": "1.25rem"}', TRUE),
('model3', 'Mẫu 3 (Camera Dọc)', '9/19', '2.5rem', '{"top": "1rem", "center": true}', TRUE);
```

#### **Bảng 3: `case_colors` (Tham chiếu - Màu ốp)**
| Field | Type | Constraints | Mô tả |
|-------|------|-------------|-------|
| `id` | VARCHAR(20) | PRIMARY KEY | 'black', 'white', 'navy', etc. |
| `name` | VARCHAR(50) | NOT NULL | Tên màu tiếng Việt |
| `hex_value` | VARCHAR(20) | NOT NULL | Mã màu hex hoặc 'transparent' |
| `is_active` | BOOLEAN | DEFAULT TRUE | Còn cung cấp không |
| `price_modifier` | DECIMAL(10,2) | DEFAULT 0 | Chênh lệch giá (nếu có) |

**Dữ liệu mẫu:**
```sql
INSERT INTO case_colors VALUES
('black', 'Đen', '#374151', TRUE, 0),
('white', 'Trắng', '#F3F4F6', TRUE, 0),
('navy', 'Xanh Navy', '#1E3A8A', TRUE, 0),
('pink', 'Hồng Phấn', '#FBCFE8', TRUE, 5000),
('transparent', 'Trong Suốt', 'transparent', TRUE, 10000);
```

#### **Bảng 4: `users` (Tùy chọn - Nếu có hệ thống user)**
| Field | Type | Constraints | Mô tả |
|-------|------|-------------|-------|
| `id` | VARCHAR(50) | PRIMARY KEY | User ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| `name` | VARCHAR(100) | NOT NULL | Tên người dùng |
| `phone` | VARCHAR(20) | NULLABLE | Số điện thoại |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày đăng ký |

#### **Bảng 5: `orders` (Mở rộng - Quản lý đơn hàng)**
| Field | Type | Constraints | Mô tả |
|-------|------|-------------|-------|
| `id` | VARCHAR(36) | PRIMARY KEY | Order ID |
| `user_id` | VARCHAR(50) | FK | ID người dùng |
| `total_amount` | DECIMAL(12,2) | NOT NULL | Tổng tiền |
| `status` | ENUM | NOT NULL | 'pending', 'processing', 'completed' |
| `shipping_address` | TEXT | NOT NULL | Địa chỉ giao hàng |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày đặt |

#### **Bảng 6: `order_details` (Chi tiết đơn hàng)**
| Field | Type | Constraints | Mô tả |
|-------|------|-------------|-------|
| `id` | VARCHAR(36) | PRIMARY KEY | Detail ID |
| `order_id` | VARCHAR(36) | FK | ID đơn hàng |
| `design_id` | VARCHAR(36) | FK | ID thiết kế |
| `quantity` | INT | NOT NULL, DEFAULT 1 | Số lượng |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Đơn giá |

---

## 4. CHIẾN LƯỢC LƯU TRỮ ẢNH

### 4.1. Vấn đề hiện tại
- Code đang dùng `URL.createObjectURL()` → ảnh chỉ tồn tại trong session
- Không persist khi reload page

### 4.2. Giải pháp đề xuất

#### **Option 1: Cloud Storage (Khuyến nghị)**
```
Flow: Upload → Cloud Storage → Save URL to DB

Ưu điểm:
✅ Scalable, không giới hạn dung lượng
✅ CDN tích hợp sẵn (tốc độ cao)
✅ Backup tự động
✅ Giá rẻ (AWS S3: ~$0.023/GB/tháng)

Nhà cung cấp:
- AWS S3
- Google Cloud Storage
- Cloudinary (có free tier 25GB)
- Azure Blob Storage
```

#### **Option 2: Database BLOB (Không khuyến nghị)**
```
Lưu ảnh trực tiếp vào DB dưới dạng BLOB/BYTEA

Nhược điểm:
❌ Làm chậm query
❌ Tốn RAM server
❌ Backup DB lâu
❌ Không có CDN
```

### 4.3. Implementation với Cloudinary (Ví dụ)

**1. Upload từ Frontend:**
```javascript
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    // Lưu URL vào state và DB
    setDesign({
      url: data.secure_url,        // URL public
      filename: file.name,
      x: 50, y: 50, scale: 1.0, rotation: 0
    });
    
    // Call API để save vào DB
    await saveDesignToDB({
      imageUrl: data.secure_url,
      filename: file.name,
      // ... other fields
    });
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

**2. Backend API (Node.js + Express):**
```javascript
// POST /api/designs
router.post('/designs', async (req, res) => {
  const {
    imageUrl,
    filename,
    positionX,
    positionY,
    scale,
    rotation,
    phoneModelId,
    caseColor,
    userId
  } = req.body;

  // Validation
  if (!imageUrl || !filename) {
    return res.status(400).json({ error: 'Image required' });
  }

  // Insert vào DB
  const design = await db.designs.create({
    id: generateUUID(),
    user_id: userId,
    image_url: imageUrl,
    image_filename: filename,
    position_x: positionX,
    position_y: positionY,
    scale: scale,
    rotation: rotation,
    phone_model_id: phoneModelId,
    case_color: caseColor,
    status: 'draft',
    created_at: new Date()
  });

  res.json({ success: true, design });
});
```

---

## 5. SQL MIGRATION SCRIPTS

### 5.1. MySQL/PostgreSQL

```sql
-- =============================================
-- MIGRATION: Create Phone Case Design Database
-- Version: 1.0
-- Date: 2025-11-02
-- =============================================

-- Bảng Phone Models
CREATE TABLE phone_models (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    aspect_ratio VARCHAR(10) NOT NULL,
    border_radius VARCHAR(20) NOT NULL,
    camera_position JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Case Colors
CREATE TABLE case_colors (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    hex_value VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    price_modifier DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Users (Optional)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Bảng Designs (Main)
CREATE TABLE designs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(50),
    image_url VARCHAR(500) NOT NULL,
    image_filename VARCHAR(255) NOT NULL,
    position_x DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    position_y DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    scale DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    rotation SMALLINT NOT NULL DEFAULT 0,
    phone_model_id VARCHAR(20) NOT NULL,
    case_color VARCHAR(50) NOT NULL,
    status ENUM('draft', 'confirmed', 'ordered', 'cancelled') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (phone_model_id) REFERENCES phone_models(id),
    
    CONSTRAINT chk_position_x CHECK (position_x BETWEEN -20 AND 120),
    CONSTRAINT chk_position_y CHECK (position_y BETWEEN -20 AND 120),
    CONSTRAINT chk_scale CHECK (scale BETWEEN 0.2 AND 5.0),
    CONSTRAINT chk_rotation CHECK (rotation BETWEEN 0 AND 359),
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Bảng Orders
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    shipping_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_orders (user_id),
    INDEX idx_status_orders (status)
);

-- Bảng Order Details
CREATE TABLE order_details (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    design_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (design_id) REFERENCES designs(id),
    
    INDEX idx_order_details (order_id)
);

-- =============================================
-- SEED DATA
-- =============================================

-- Insert Phone Models
INSERT INTO phone_models (id, name, aspect_ratio, border_radius, camera_position) VALUES
('model1', 'Mẫu 1 (Góc Bo)', '9/18', '3rem', '{"top": "1rem", "right": "1rem", "width": "2.5rem", "height": "2.5rem"}'),
('model2', 'Mẫu 2 (Cụm Camera Vuông)', '9/19.5', '2.75rem', '{"top": "1.25rem", "left": "1.25rem", "width": "5rem", "height": "5rem"}'),
('model3', 'Mẫu 3 (Camera Dọc)', '9/19', '2.5rem', '{"top": "1rem", "center": true, "width": "2rem", "height": "6rem"}');

-- Insert Case Colors
INSERT INTO case_colors (id, name, hex_value, price_modifier) VALUES
('black', 'Đen', '#374151', 0),
('white', 'Trắng', '#F3F4F6', 0),
('navy', 'Xanh Navy', '#1E3A8A', 0),
('pink', 'Hồng Phấn', '#FBCFE8', 5000),
('transparent', 'Trong Suốt', 'transparent', 10000);
```

### 5.2. MongoDB Schema (Alternative)

```javascript
// Collection: designs
{
  _id: ObjectId(),
  userId: String,  // hoặc ObjectId nếu có collection users
  
  image: {
    url: String,      // required
    filename: String, // required
    uploadedAt: Date
  },
  
  transform: {
    x: Number,        // 0-100, default: 50
    y: Number,        // 0-100, default: 50
    scale: Number,    // 0.2-5.0, default: 1.0
    rotation: Number  // 0-359, default: 0
  },
  
  phoneCase: {
    modelId: String,  // 'model1', 'model2', 'model3'
    modelName: String,
    color: String,    // hex code hoặc 'transparent'
    colorName: String
  },
  
  status: String,     // 'draft', 'confirmed', 'ordered'
  
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date     // soft delete
}

// Indexes
db.designs.createIndex({ userId: 1, createdAt: -1 })
db.designs.createIndex({ status: 1 })
db.designs.createIndex({ deletedAt: 1 })
```

---

## 6. API ENDPOINTS ĐỀ XUẤT

### 6.1. RESTful API Design

```
BASE_URL: https://api.yourdomain.com/v1

┌─────────────────────────────────────────────────────────────┐
│ DESIGNS ENDPOINTS                                            │
├─────────────────────────────────────────────────────────────┤
│ POST   /designs              Tạo thiết kế mới               │
│ GET    /designs              Lấy danh sách thiết kế         │
│ GET    /designs/:id          Lấy chi tiết 1 thiết kế        │
│ PUT    /designs/:id          Cập nhật thiết kế              │
│ DELETE /designs/:id          Xóa thiết kế (soft delete)     │
│ POST   /designs/:id/confirm  Xác nhận thiết kế              │
├─────────────────────────────────────────────────────────────┤
│ REFERENCE DATA                                               │
├─────────────────────────────────────────────────────────────┤
│ GET    /phone-models         Lấy danh sách mẫu ốp          │
│ GET    /case-colors          Lấy danh sách màu ốp          │
├─────────────────────────────────────────────────────────────┤
│ ORDERS                                                       │
├─────────────────────────────────────────────────────────────┤
│ POST   /orders               Tạo đơn hàng                   │
│ GET    /orders               Lấy danh sách đơn hàng         │
│ GET    /orders/:id           Chi tiết đơn hàng              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2. Request/Response Examples

#### **POST /designs - Tạo thiết kế mới**
```json
// Request
POST /api/v1/designs
Content-Type: application/json
Authorization: Bearer {token}

{
  "imageUrl": "https://cloudinary.com/designs/abc123.jpg",
  "filename": "my-design.png",
  "transform": {
    "x": 50,
    "y": 50,
    "scale": 1.0,
    "rotation": 0
  },
  "phoneCase": {
    "modelId": "model1",
    "color": "#374151"
  }
}

// Response 201 Created
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user123",
    "image": {
      "url": "https://cloudinary.com/designs/abc123.jpg",
      "filename": "my-design.png"
    },
    "transform": {
      "x": 50,
      "y": 50,
      "scale": 1.0,
      "rotation": 0
    },
    "phoneCase": {
      "modelId": "model1",
      "modelName": "Mẫu 1 (Góc Bo)",
      "color": "#374151",
      "colorName": "Đen"
    },
    "status": "draft",
    "createdAt": "2025-11-02T10:30:00Z",
    "updatedAt": "2025-11-02T10:30:00Z"
  }
}
```

#### **GET /designs - Lấy danh sách thiết kế**
```json
// Request
GET /api/v1/designs?status=draft&page=1&limit=10
Authorization: Bearer {token}

// Response 200 OK
{
  "success": true,
  "data": {
    "designs": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "image": {
          "url": "https://cloudinary.com/designs/abc123.jpg",
          "thumbnail": "https://cloudinary.com/designs/abc123_thumb.jpg"
        },
        "phoneCase": {
          "modelName": "Mẫu 1 (Góc Bo)",
          "colorName": "Đen"
        },
        "status": "draft",
        "createdAt": "2025-11-02T10:30:00Z"
      }
      // ... more designs
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### **PUT /designs/:id - Cập nhật thiết kế**
```json
// Request
PUT /api/v1/designs/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
Authorization: Bearer {token}

{
  "transform": {
    "x": 60,
    "y": 45,
    "scale": 1.2,
    "rotation": 15
  },
  "phoneCase": {
    "color": "#1E3A8A"
  }
}

// Response 200 OK
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "transform": {
      "x": 60,
      "y": 45,
      "scale": 1.2,
      "rotation": 15
    },
    "phoneCase": {
      "modelId": "model1",
      "modelName": "Mẫu 1 (Góc Bo)",
      "color": "#1E3A8A",
      "colorName": "Xanh Navy"
    },
    "updatedAt": "2025-11-02T11:45:00Z"
  }
}
```

---

## 7. SECURITY & BEST PRACTICES

### 7.1. Bảo mật Upload ảnh

```javascript
// Validation rules
const imageUploadRules = {
  maxFileSize: 5 * 1024 * 1024,  // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  minDimensions: { width: 500, height: 500 },
  maxDimensions: { width: 4096, height: 4096 }
};

// Backend validation
const validateImage = async (file) => {
  // Check file size
  if (file.size > imageUploadRules.maxFileSize) {
    throw new Error('File quá lớn (max 5MB)');
  }
  
  // Check MIME type
  if (!imageUploadRules.allowedTypes.includes(file.mimetype)) {
    throw new Error('Định dạng file không hợp lệ');
  }
  
  // Check dimensions (using sharp library)
  const metadata = await sharp(file.buffer).metadata();
  if (metadata.width < 500 || metadata.height < 500) {
    throw new Error('Ảnh phải có kích thước tối thiểu 500x500px');
  }
  
  return true;
};
```

### 7.2. Rate Limiting

```javascript
// Express rate limiter
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per 15 minutes
  message: 'Quá nhiều yêu cầu upload, vui lòng thử lại sau'
});

app.post('/api/designs', uploadLimiter, createDesign);
```

### 7.3. Database Indexes

```sql
-- Tối ưu query performance
CREATE INDEX idx_user_designs ON designs(user_id, created_at DESC);
CREATE INDEX idx_status_active ON designs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_search_filename ON designs(image_filename) USING gin(to_tsvector('english', image_filename));
```

---

## 8. TESTING CHECKLIST

### 8.1. Unit Tests
```
□ Validation: position_x/y trong range -20 đến 120
□ Validation: scale trong range 0.2 đến 5.0
□ Validation: rotation trong range 0 đến 359
□ Upload image: chỉ chấp nhận định dạng cho phép
□ Upload image: reject file > 5MB
□ Soft delete: không xóa thật khỏi DB
```

### 8.2. Integration Tests
```
□ POST /designs: tạo design thành công
□ GET