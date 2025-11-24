import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hook/useCart';
import { useCreateOrder } from '../../hook/useOrder';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../util/format';
import { Loader } from 'lucide-react';
import { createPayment } from '../../api/paymentAPI';
import { clearCart } from '../../api/cartAPI';
import { useQueryClient } from '@tanstack/react-query';

const Order = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { cartItems, isLoading: isCartLoading } = useCart();
    const createOrderMutation = useCreateOrder();

    const [shippingInfo, setShippingInfo] = useState({
        name: auth?.user?.name || '',
        address: '',
        phone: '',
        note: '',
    });

    const subtotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = {
            userId: auth?.user?.id,
            totalAmount: total,
            shippingAddress: shippingInfo.address,
            shippingPhone: shippingInfo.phone,
            paymentMethod: 'COD',
            items: cartItems.map(item => ({
                productId: item.productId || (item.designId ? null : item.id), // Use productId, null if it's a design
                designId: item.designId || null, // Support custom designs
                quantity: item.quantity || 1,
                price: typeof item.price === 'number' ? item.price : parseFloat(item.price)
            }))
        };

        try {
            // Create order
            const order = await createOrderMutation.mutateAsync(orderData);
            
            // Create payment for COD
            const paymentData = {
                orderId: order.id,
                userId: auth?.user?.id,
                amount: total,
                paymentMethod: 'COD'
            };
            
            await createPayment(paymentData, auth?.token);
            
            // Clear cart after successful order
            try {
                await clearCart(auth?.user?.id, auth?.token);
                // Invalidate cart query to refresh
                queryClient.invalidateQueries({ queryKey: ['cart', auth?.user?.id] });
            } catch (cartError) {
                console.error('Error clearing cart:', cartError);
                // Don't fail the order if cart clearing fails
            }
            
            // Navigate to order process/tracking page
            navigate(`/order-process`);
        } catch (error) {
            alert('Failed to create order: ' + (error.response?.data?.message || error.message));
        }
    };

    if (isCartLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return <div className="text-center py-20">Giỏ hàng trống. Vui lòng thêm sản phẩm.</div>;
    }

    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Thanh Toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipping Info Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={shippingInfo.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={shippingInfo.address}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={shippingInfo.phone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                <textarea
                                    name="note"
                                    rows={3}
                                    value={shippingInfo.note}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={createOrderMutation.isLoading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-indigo-700 transition-all duration-300 shadow-md mt-6"
                            >
                                {createOrderMutation.isLoading ? 'Đang xử lý...' : 'Đặt Hàng'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>
                        <div className="space-y-4 mb-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                                            <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span>{formatCurrency(shippingFee)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t mt-2">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
