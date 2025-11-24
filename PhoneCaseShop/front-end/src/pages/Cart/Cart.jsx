import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Loader } from 'lucide-react';
import { formatCurrency } from '../../util/format';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hook/useCart';
import { updateCartQuantity, removeFromCart } from '../../api/cartAPI';
import { useQueryClient } from '@tanstack/react-query';

const Cart = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { cartItems: fetchedCartItems, isLoading } = useCart();

    const [cartItems, setCartItems] = useState([]);
    const [updatingItems, setUpdatingItems] = useState(new Set());

    useEffect(() => {
        // If not authenticated, redirect to login
        if (!auth || !auth.user) {
            navigate('/login', { replace: true });
        }
    }, [auth, navigate]);

    useEffect(() => {
        if (fetchedCartItems) {
            setCartItems(fetchedCartItems);
        }
    }, [fetchedCartItems]);

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        if (!auth?.token) return;

        setUpdatingItems(prev => new Set(prev).add(cartItemId));
        try {
            await updateCartQuantity(cartItemId, newQuantity, auth.token);
            // Invalidate and refetch cart
            queryClient.invalidateQueries({ queryKey: ['cart', auth.user.id] });
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Lỗi khi cập nhật số lượng: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        if (!auth?.token) return;
        
        setUpdatingItems(prev => new Set(prev).add(cartItemId));
        try {
            await removeFromCart(cartItemId, auth.token);
            // Invalidate and refetch cart
            queryClient.invalidateQueries({ queryKey: ['cart', auth.user.id] });
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemId);
                return newSet;
            });
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 30000; // Example shipping fee
    const total = subtotal + shippingFee;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <ShoppingCart className="mx-auto h-24 w-24 text-gray-300" />
                <h1 className="mt-4 text-3xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h1>
                <p className="mt-2 text-lg text-gray-500">
                    Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
                </p>
                <Link
                    to="/product"
                    className="mt-6 inline-block px-8 py-3 bg-indigo-600 text-white font-bold uppercase rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
                >
                    Bắt đầu mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Giỏ Hàng Của Bạn</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
                        {cartItems.map(item => {
                            // Support both backend format and old mock format
                            const itemName = item.name || item.productName || 'Sản phẩm';
                            const itemImage = item.imageUrl || item.productImageUrl || 'https://placehold.co/200x200/cccccc/000000?text=No+Image';
                            const itemPrice = item.price || 0;
                            
                            return (
                            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6 last:border-b-0">
                                <img src={itemImage} alt={itemName} className="w-24 h-24 object-cover rounded-lg shadow-md" />

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-gray-800">{itemName}</h3>
                                    {item.designId && (
                                        <p className="text-sm text-indigo-600">Thiết kế tùy chỉnh</p>
                                    )}
                                    <p className="text-md font-semibold text-indigo-600 mt-1">{formatCurrency(itemPrice)}</p>
                                </div>

                                {/* Quantity and Remove */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button 
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                                            disabled={updatingItems.has(item.id) || item.quantity <= 1}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-4 font-semibold min-w-[3rem] text-center">
                                            {updatingItems.has(item.id) ? <Loader className="animate-spin h-4 w-4 inline" /> : item.quantity}
                                        </span>
                                        <button 
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                                            disabled={updatingItems.has(item.id)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)} 
                                        disabled={updatingItems.has(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updatingItems.has(item.id) ? <Loader className="animate-spin h-5 w-5" /> : <Trash2 size={20} />}
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold border-b pb-4 mb-4">Tóm Tắt Đơn Hàng</h2>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-semibold">{formatCurrency(shippingFee)}</span>
                                </div>
                                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Tổng cộng</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/order')}
                                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-indigo-700 transition-all duration-300 shadow-md"
                            >
                                Tiến hành Thanh toán
                            </button>
                            <Link to="/product" className="block text-center mt-4 text-indigo-600 hover:underline font-medium">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
