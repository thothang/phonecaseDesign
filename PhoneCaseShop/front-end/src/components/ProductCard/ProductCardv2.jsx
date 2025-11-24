import React from 'react';
import { useCartModal } from '../../context/useCartModal';

// Hàm format giá tiền sang định dạng VND
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

// Component Card sản phẩm
const ProductCardv2 = ({ product }) => {
    const { openModal } = useCartModal();
    // Xử lý lỗi khi load ảnh
    const handleImageError = (e) => {
        e.target.onerror = null; // Ngăn chặn loop vô hạn nếu fallback cũng lỗi
        e.target.src = 'https://placehold.co/400x400/cccccc/000000?text=Image+Not+Found';
    };

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-100">
            {/* Vùng Ảnh Sản Phẩm */}
            <div className="relative overflow-hidden w-full aspect-square">
                <img
                    src={product.imageUrl || product.case_type_image_url || 'https://placehold.co/400x400/cccccc/000000?text=No+Image'}
                    alt={product.name || product.case_type_name || 'Product'}
                    className="w-full h-full object-cover transition duration-500 ease-in-out hover:opacity-90"
                    onError={handleImageError}
                    loading="lazy"
                />
            </div>

            {/* Thông tin Sản Phẩm */}
            <div className="p-4 sm:p-5 flex flex-col justify-between h-auto">
                <div>
                    {/* Tên Sản Phẩm */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 leading-tight line-clamp-2">
                        {product.name || product.case_type_name || 'Product Name'}
                    </h3>

                    {/* Giá Tiền */}
                    <p className="text-2xl font-extrabold text-indigo-600 mb-3">
                        {formatPrice(product.price || product.case_type_price || 0)}
                    </p>

                    {/* Mô tả ngắn */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                        {product.description || product.case_type_description || ''}
                    </p>
                </div>

                {/* Nút Thao Tác */}
                <button
                    onClick={() => openModal(product)}
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg font-semibold text-sm sm:text-base transition duration-200 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 active:bg-indigo-700 shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.435a.99 0 00.589.658c.277.086.564.13.853.13h6.963a.998.998 0 00.77-.37l2.893-4.34a1 1 0 00-.773-1.63H6.723a1 1 0 00-.987.728L5.22 8h11.56a.25.25 0 010 .5H5.22c-.22 0-.427.13-.518.337l-1.358 5.434a1 1 0 00.988 1.229h11.56a.25.25 0 010 .5H4.372a2 2 0 01-1.977-2.457L3 1z" />
                    </svg>
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default ProductCardv2;