import React from 'react';
import { useOrders } from '../../hook/useOrder';
import { Loader, Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { formatCurrency } from '../../util/format';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrderProcess = () => {
    const { auth } = useAuth();
    const { orders, isLoading, error } = useOrders();

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': { icon: Clock, color: 'yellow', text: 'Chờ xử lý' },
            'PROCESSING': { icon: Clock, color: 'blue', text: 'Đang xử lý' },
            'SHIPPED': { icon: Truck, color: 'indigo', text: 'Đang giao hàng' },
            'DELIVERED': { icon: CheckCircle, color: 'green', text: 'Đã giao hàng' },
            'CANCELLED': { icon: XCircle, color: 'red', text: 'Đã hủy' },
            'RETURNED': { icon: XCircle, color: 'orange', text: 'Đã trả hàng' }
        };
        
        const statusInfo = statusMap[status?.toUpperCase()] || statusMap['PENDING'];
        const Icon = statusInfo.icon;
        const colorClass = `bg-${statusInfo.color}-100 text-${statusInfo.color}-800`;
        
        return (
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${colorClass} text-sm font-medium`}>
                <Icon size={16} /> {statusInfo.text}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-600">Có lỗi xảy ra khi tải danh sách đơn hàng.</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <Package className="mx-auto h-24 w-24 text-gray-300" />
                <h1 className="mt-4 text-3xl font-bold text-gray-800">Bạn chưa có đơn hàng nào</h1>
                <Link
                    to="/product"
                    className="mt-6 inline-block px-8 py-3 bg-indigo-600 text-white font-bold uppercase rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
                >
                    Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 py-12 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Theo Dõi Đơn Hàng</h1>

                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                        <p className="font-bold text-gray-900">#{order.orderNumber || order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày đặt</p>
                                        <p className="font-medium text-gray-900">{formatDate(order.createdAt || order.create_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                        <p className="font-bold text-indigo-600">{formatCurrency(order.totalAmount || order.total_amount || 0)}</p>
                                    </div>
                                    <div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                                        <p className="font-medium text-gray-900">{order.shippingAddress || order.shipping_address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                        <p className="font-medium text-gray-900">{order.shippingPhone || order.shipping_phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                                        <p className="font-medium text-gray-900">{order.paymentMethod || order.payment_method || 'COD'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                                        <p className="font-medium text-gray-900">{order.paymentStatus || order.payment_status || 'PENDING'}</p>
                                    </div>
                                </div>
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm trong đơn hàng</h3>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={item.id || index} className="flex justify-between items-center border-b pb-3 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                                        {item.productId ? 'SP' : 'TK'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {item.productId ? `Sản phẩm #${item.productId}` : `Thiết kế #${item.designId}`}
                                                        </p>
                                                        <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderProcess;
