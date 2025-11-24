// Định nghĩa dữ liệu mẫu cho một bài post cụ thể
export const MOCK_POST_DETAIL = {
  postId: 'p101',
  title: 'Setup MSW thành công!',
  content: 'Dữ liệu này được lấy từ file mockData.ts.',
  author: 'Gemini AI',
};

export const MOCK_PHONE_MODELS = [
  { id: 'pm1', name: 'iPhone 14 Pro', aspect_ratio: '9/18', border_radius: '3rem', camera_position: '{"top": "1rem", "right": "1rem"}', isActive: true, creatAt: '' },
  { id: 'pm2', name: 'Galaxy S23 Ultra', aspect_ratio: '9/19.5', border_radius: '2.75rem', camera_position: '{"top": "1rem", "left": "1rem"}', isActive: true, creatAt: '' },
  { id: 'pm3', name: 'Pixel 7 Pro', aspect_ratio: '9/19', border_radius: '2.5rem', camera_position: '{"top": "1rem", "center": true}', isActive: true, creatAt: '' },
];

export const MOCK_CASE_TYPES = [
  { id: 'ct1', name: 'Ốp lưng dẻo iPhone 14 Pro', description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', image_url: '', creatAt: '', price: 299000 },
  { id: 'ct2', name: 'Ốp lưng cứng', description: 'Ốp lưng làm từ nhựa cứng PC, bảo vệ máy tối ưu.', image_url: '', creatAt: '', price: 109000 },
  { id: 'ct3', name: 'Ốp lưng ví', description: 'Ốp lưng kiêm ví đựng thẻ, tiện lợi khi di chuyển.', image_url: '', creatAt: '', price: 99000 },
  { id: 'ct4', name: 'Ốp lưng cứng Galaxy S23 Ultra', description: 'Ốp lưng làm từ nhựa cứng PC, bảo vệ máy tối ưu.', image_url: '', creatAt: '', price: 399000 },
  { id: 'ct5', name: 'Ốp lưng dẻo Pixel 7 Pro', description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', image_url: '', creatAt: '', price: 293000 },
  { id: 'ct6', name: 'Ốp lưng cứng Pixel 7 Pro', description: 'Ốp lưng làm từ nhựa cứng PC, bảo vệ máy tối ưu.', image_url: '', creatAt: '', price: 267000 },
];

export const MOCK_PRODUCT_1 = {
  id: 'inv1', phone_model_id: 'pm1', case_type_id: 'ct1', case_type_name: 'Ốp lưng dẻo iPhone 14 Pro', case_type_price: 299000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'iPhone 14 Pro', quantity: 200
};

export const MOCK_PRODUCTS_LIST = [
  { id: 'inv1', phone_model_id: 'pm1', case_type_id: 'ct1', case_type_name: 'Ốp lưng dẻo iPhone 14 Pro', case_type_price: 299000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'iPhone 14 Pro', quantity: 200 },
  { id: 'inv2', phone_model_id: 'pm1', case_type_id: 'ct2', case_type_name: 'Ốp lưng cứng iPhone 14 Pro', case_type_price: 109000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'iPhone 14 Pro', quantity: 150 },
  { id: 'inv3', phone_model_id: 'pm2', case_type_id: 'ct3', case_type_name: 'Ốp lưng dẻo Galaxy S23 Ultra', case_type_price: 99000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'Galaxy S23 Ultra', quantity: 180 },
  { id: 'inv4', phone_model_id: 'pm2', case_type_id: 'ct4', case_type_name: 'Ốp lưng cứng Galaxy S23 Ultra', case_type_price: 399000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'Galaxy S23 Ultra', quantity: 220 },
  { id: 'inv5', phone_model_id: 'pm3', case_type_id: 'ct5', case_type_name: 'Ốp lưng dẻo Pixel 7 Pro', case_type_price: 293000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'Pixel 7 Pro', quantity: 160 },
  { id: 'inv6', phone_model_id: 'pm3', case_type_id: 'ct6', case_type_name: 'Ốp lưng cứng Pixel 7 Pro', case_type_price: 267000, case_type_description: 'Ốp lưng làm từ chất liệu TPU dẻo dai, chống sốc tốt.', case_type_image_url: 'https://placehold.co/400x400/8B5CF6/ffffff?text=Glass+Case', phone_model_name: 'Pixel 7 Pro', quantity: 140 },
];

//Đây là kho hàng
export const MOCK_INVENTORY_ITEMS = [
  { id: 'inv1', quantity: 200, phone_model_id: 'pm1', case_type_id: 'ct1', creatAt: '', updateAt: '' },
  { id: 'inv2', quantity: 200, phone_model_id: 'pm2', case_type_id: 'ct2', creatAt: '', updateAt: '' },
  { id: 'inv3', quantity: 200, phone_model_id: 'pm3', case_type_id: 'ct3', creatAt: '', updateAt: '' },
  { id: 'inv4', quantity: 200, phone_model_id: 'pm1', case_type_id: 'ct2', creatAt: '', updateAt: '' },
  { id: 'inv5', quantity: 200, phone_model_id: 'pm2', case_type_id: 'ct3', creatAt: '', updateAt: '' },
  { id: 'inv6', quantity: 200, phone_model_id: 'pm3', case_type_id: 'ct1', creatAt: '', updateAt: '' },
];

export const MOCK_USER_BY_ID = {
  id: '1',
  name: 'Bảo',
  email: 'bao@example.com',
  phone: '0123456789',
}

export const MOCK_CARTS = { id: '1', user_id: '1' }


export const MOCK_CART_ITEMS = [
  { id: '1', cart_id: '1', inventory_item_id: 'inv1', design_id: '', quantity: 4, unit_price: 299000 * 4 },
  { id: '2', cart_id: '1', inventory_item_id: 'inv2', design_id: '', quantity: 2, unit_price: 109000 * 2 }
]

export const MOCK_ORDER = { id: '1', user_id: '1', total_amount: '1444000', status: 'pending', shipping_address: '', shipping_name: '', payment_method: '', note: '', create_at: '', update_at: '' }

export const MOCK_ORDER_ITEMS = [
  { id: '1', order_id: '1', inventory_item_id: 'inv1', quantity: 4, price: 299000 * 4, create_at: '' },
  { id: '2', order_id: '1', inventory_item_id: 'inv2', quantity: 2, price: 109000 * 2, create_at: '' }
]

export const MOCK_DESIGNS = { id: '1', user_id: '1', image_url: 'https://i.pinimg.com/736x/b2/c5/77/b2c577a51278564470b2deccaf69a5fb.jpg', image_filename: 'sussy', position_x: 50, position_y: 50, scale: 1.0, rotation: 0, phone_model_id: 'pm1', case_color_id: '1', status: 'draft', color_hex_value: '#374151' }

export const MOCK_ROLES = [
  { id: '1', name: 'ADMIN', description: 'Quản trị viên của hệ thống', create_at: '' },
  { id: '2', name: 'USER', description: 'Người dùng đã đăng ký của hệ thống', create_at: '' }
]

export const MOCK_ADMIN_ACCOUNT = { id: '0', name: 'admin', email: 'admin@gmail.com', phone: '01234567', role_id: '1', create_at: '' }

export const MOCK_USERS = [
  {id: '1',name: 'Bảo',email: 'bao@example.com',phone: '0123456789',},
  {id: '2',name: 'Minh',email: 'minh@example.com',phone: '0987654321',},
  {id: '3',name: 'Lan',email: 'lan@example.com',phone: '0911222333',},
  {id: '4',name: 'Hùng',email: 'hung@example.com',phone: '0933444555',},
  {id: '5',name: 'Trâm',email: 'tram@example.com',phone: '0977555444',},
];





