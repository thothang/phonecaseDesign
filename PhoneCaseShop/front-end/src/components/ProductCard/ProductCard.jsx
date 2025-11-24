import { Heart, ShoppingCart, Star } from 'lucide-react';
import React from 'react';
import { formatCurrency } from '../../util/format';

const ProductCard = ({product}) => {

    const { name, price, oldPrice, imageUrl, rating, reviews, isNew, colors } = product;

    const formattedRating = rating.toFixed(1);

    return (
        <div className="bg-white group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            {/* Vùng Hình Ảnh */}
            <div className="relative overflow-hidden bg-gray-50 aspect-square">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge (New/Sale) */}
                {isNew && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        MỚI
                    </span>
                )}
                {oldPrice && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        SALE
                    </span>
                )}

                {/* Nút Yêu Thích (Overlay) */}
                <button
                    aria-label="Thêm vào danh sách yêu thích"
                    className="absolute top-3 right-3 p-2 bg-white/80 text-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-10 group-hover:translate-x-0"
                >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
            </div>

            {/* Thông Tin Sản Phẩm */}
            <div className="p-4 sm:p-5">
                {/* Đánh Giá */}
                <div className="flex items-center mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-semibold text-gray-800 mr-1">{formattedRating}</span>
                    <span className="text-xs text-gray-500">({reviews} Reviews)</span>
                </div>

                {/* Tên Sản Phẩm */}
                <a href={`#product-${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors duration-200 line-clamp-2 min-h-[50px]">
                        {name}
                    </h3>
                </a>

                {/* Màu Sắc */}
                <div className="flex space-x-1 mt-2 mb-3">
                    {colors.map((color, index) => (
                        <span 
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={`Màu: ${color}`}
                        ></span>
                    ))}
                </div>

                {/* Giá */}
                <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-xl font-extrabold text-indigo-700">
                        {formatCurrency(price)}
                    </span>
                    {oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(oldPrice)}
                        </span>
                    )}
                </div>

                {/* Nút Mua Hàng */}
                <button
                    className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-lg font-semibold uppercase text-sm tracking-wider shadow-md shadow-indigo-300 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào Giỏ
                </button>
            </div>
        </div>
    );
}

export default ProductCard