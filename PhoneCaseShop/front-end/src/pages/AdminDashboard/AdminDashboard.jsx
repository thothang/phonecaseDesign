import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkAdminAuth } from '../../api/userApi';
import { 
    useAdminUsers, 
    useAdminProducts, 
    useAdminInventory,
    useAdminStatistics,
    useAdminOrders,
    useUpdateUser,
    useDeleteUser,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
    useUpdateInventory,
    useDeleteInventory,
    useUpdateOrderStatus
} from '../../hook/useAdmin';
import {
    Users,
    BarChart2,
    Package,
    Layers,
    ShoppingCart,
    Menu,
    X,
    LogOut,
    Search,
    Plus,
    Edit,
    Trash2,
    Save,
    XCircle,
    Loader
} from 'lucide-react';
import { formatCurrency } from '../../util/format';

// Product Modal Component
const ProductModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        brand: '',
        model: '',
        color: '',
        material: '',
        imageUrl: '',
        stockQuantity: 0,
        isActive: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="mt-1 block w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL ảnh</label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('statistics');

    // Data fetching hooks
    const { data: users, isLoading: isLoadingUsers } = useAdminUsers();
    const { data: products, isLoading: isLoadingProducts } = useAdminProducts();
    const { data: inventory, isLoading: isLoadingInventory } = useAdminInventory();
    const { data: orders, isLoading: isLoadingOrders } = useAdminOrders();
    
    // Mutations
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();
    const updateInventoryMutation = useUpdateInventory();
    const deleteInventoryMutation = useDeleteInventory();
    const updateOrderStatusMutation = useUpdateOrderStatus();
    
    // Local state for editing
    const [editingUser, setEditingUser] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingInventory, setEditingInventory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    
    // Sorting states
    const [userSortBy, setUserSortBy] = useState('name'); // 'name' or 'role'
    const [userSortOrder, setUserSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [productSortBy, setProductSortBy] = useState('name'); // 'name' or 'price'
    const [productSortOrder, setProductSortOrder] = useState('asc');
    const [inventorySortBy, setInventorySortBy] = useState('productId'); // 'productId', 'productName', 'quantity', 'availableQuantity'
    const [inventorySortOrder, setInventorySortOrder] = useState('asc');
    const [orderSortBy, setOrderSortBy] = useState('createdAt'); // 'orderNumber', 'createdAt', 'totalAmount', 'status'
    const [orderSortOrder, setOrderSortOrder] = useState('desc');
    
    // Data fetching hooks
    const { data: statistics, isLoading: isLoadingStatistics } = useAdminStatistics(null);
    
    // Reset search term and sorting when switching tabs
    useEffect(() => {
        setSearchTerm('');
        setEditingUser(null);
        setEditingProduct(null);
        setEditingInventory(null);
        setShowProductModal(false);
        // Reset sorting states
        setUserSortBy('name');
        setUserSortOrder('asc');
        setProductSortBy('name');
        setProductSortOrder('asc');
        setInventorySortBy('productId');
        setInventorySortOrder('asc');
        setOrderSortBy('createdAt');
        setOrderSortOrder('desc');
    }, [activeTab]);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = auth.token;
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                await checkAdminAuth(token);
                setIsLoading(false);
            } catch (error) {
                console.error("Admin auth check failed", error);
                setAuth({ user: null, token: null });
                navigate('/admin/login');
            }
        };

        verifyAdmin();
    }, [auth.token, navigate, setAuth]);

    const handleLogout = () => {
        setAuth({ user: null, token: null });
        navigate('/admin/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const menuItems = [
        { id: 'statistics', label: 'Thống kê', icon: BarChart2 },
        { id: 'users', label: 'Quản lý người dùng', icon: Users },
        { id: 'products', label: 'Quản lý sản phẩm', icon: Package },
        { id: 'inventory', label: 'Quản lý tồn kho', icon: Layers },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingCart },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'statistics':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Tổng quan thống kê</h3>
                        </div>
                        {isLoadingStatistics ? (
                            <div className="text-center py-8">
                                <Loader className="animate-spin h-8 w-8 mx-auto text-red-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                    <p className="text-sm text-blue-600 font-medium">Tổng doanh thu</p>
                                    <p className="text-2xl font-bold text-blue-900 mt-2">
                                        {statistics?.totalRevenue ? formatCurrency(Number(statistics.totalRevenue)) : '0 VNĐ'}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                    <p className="text-sm text-green-600 font-medium">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold text-green-900 mt-2">{statistics?.totalOrders || 0}</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                                    <p className="text-sm text-purple-600 font-medium">Tổng khách hàng</p>
                                    <p className="text-2xl font-bold text-purple-900 mt-2">{statistics?.totalUsers || 0}</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                                    <p className="text-sm text-orange-600 font-medium">Tổng sản phẩm</p>
                                    <p className="text-2xl font-bold text-orange-900 mt-2">{statistics?.totalProducts || 0}</p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                                    <p className="text-sm text-yellow-600 font-medium">Đơn chờ xử lý</p>
                                    <p className="text-2xl font-bold text-yellow-900 mt-2">{statistics?.pendingOrders || 0}</p>
                                </div>
                                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                                    <p className="text-sm text-emerald-600 font-medium">Đơn hoàn thành</p>
                                    <p className="text-2xl font-bold text-emerald-900 mt-2">{statistics?.completedOrders || 0}</p>
                                </div>
                                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                                    <p className="text-sm text-red-600 font-medium">Đơn đã hủy</p>
                                    <p className="text-2xl font-bold text-red-900 mt-2">{statistics?.cancelledOrders || 0}</p>
                                </div>
                                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                                    <p className="text-sm text-indigo-600 font-medium">Sản phẩm sắp hết</p>
                                    <p className="text-2xl font-bold text-indigo-900 mt-2">{statistics?.lowStockProducts || 0}</p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'users':
                const filteredUsers = users?.filter(user => 
                    !searchTerm || 
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                ) || [];
                
                // Sort users
                const sortedUsers = [...filteredUsers].sort((a, b) => {
                    let aVal, bVal;
                    if (userSortBy === 'name') {
                        aVal = a.name || '';
                        bVal = b.name || '';
                    } else if (userSortBy === 'role') {
                        aVal = a.role || '';
                        bVal = b.role || '';
                    } else {
                        return 0;
                    }
                    
                    const comparison = aVal.localeCompare(bVal);
                    return userSortOrder === 'asc' ? comparison : -comparison;
                });
                
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Danh sách người dùng ({sortedUsers.length})</h3>
                            <div className="flex gap-2">
                                <select
                                    value={userSortBy}
                                    onChange={(e) => setUserSortBy(e.target.value)}
                                    className="border rounded px-2 py-2 text-sm"
                                >
                                    <option value="name">Sắp xếp theo tên</option>
                                    <option value="role">Sắp xếp theo role</option>
                                </select>
                                <button
                                    onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                                >
                                    {userSortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {isLoadingUsers ? (
                            <div className="text-center py-8">
                                <Loader className="animate-spin h-8 w-8 mx-auto text-red-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {editingUser?.id === user.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingUser.name}
                                                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                                            className="border rounded px-2 py-1 w-full"
                                                        />
                                                    ) : (
                                                        user.name
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                        user.role === 'EMPLOYEE' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingUser?.id === user.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingUser.phone || ''}
                                                            onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                                                            className="border rounded px-2 py-1 w-full"
                                                        />
                                                    ) : (
                                                        user.phone || 'N/A'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingUser?.id === user.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingUser.address || ''}
                                                            onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                                                            className="border rounded px-2 py-1 w-full"
                                                        />
                                                    ) : (
                                                        user.address || 'N/A'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {editingUser?.id === user.id ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await updateUserMutation.mutateAsync({
                                                                            userId: user.id,
                                                                            userData: editingUser
                                                                        });
                                                                        setEditingUser(null);
                                                                        alert('Cập nhật thành công');
                                                                    } catch (error) {
                                                                        alert('Lỗi: ' + (error.response?.data?.message || error.message));
                                                                    }
                                                                }}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingUser(null)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setEditingUser({...user})}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) {
                                                                        try {
                                                                            await deleteUserMutation.mutateAsync(user.id);
                                                                            alert('Đã xóa người dùng thành công');
                                                                        } catch (error) {
                                                                            const errorMessage = error.response?.data?.message || 
                                                                                               error.response?.data?.errorCode || 
                                                                                               error.message || 
                                                                                               'Không thể xóa người dùng. Vui lòng thử lại.';
                                                                            alert('Lỗi: ' + errorMessage);
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'products':
                const filteredProducts = products?.filter(product => 
                    !searchTerm || 
                    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
                ) || [];
                
                // Sort products
                const sortedProducts = [...filteredProducts].sort((a, b) => {
                    let aVal, bVal;
                    if (productSortBy === 'name') {
                        aVal = a.name || '';
                        bVal = b.name || '';
                        const comparison = aVal.localeCompare(bVal);
                        return productSortOrder === 'asc' ? comparison : -comparison;
                    } else if (productSortBy === 'price') {
                        aVal = Number(a.price) || 0;
                        bVal = Number(b.price) || 0;
                        const comparison = aVal - bVal;
                        return productSortOrder === 'asc' ? comparison : -comparison;
                    }
                    return 0;
                });
                
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Danh sách sản phẩm ({sortedProducts.length})</h3>
                            <div className="flex gap-2">
                                <select
                                    value={productSortBy}
                                    onChange={(e) => setProductSortBy(e.target.value)}
                                    className="border rounded px-2 py-2 text-sm"
                                >
                                    <option value="name">Sắp xếp theo tên</option>
                                    <option value="price">Sắp xếp theo giá</option>
                                </select>
                                <button
                                    onClick={() => setProductSortOrder(productSortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                                >
                                    {productSortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                                <button 
                                    onClick={() => setShowProductModal(true)}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Thêm mới
                                </button>
                            </div>
                        </div>
                        {isLoadingProducts ? (
                            <div className="text-center py-8">
                                <Loader className="animate-spin h-8 w-8 mx-auto text-red-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedProducts.map((product) => (
                                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                                        <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                                            {product.imageUrl || product.image_url ? (
                                                <img src={product.imageUrl || product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Package className="h-12 w-12 text-gray-400" />
                                            )}
                                            {editingProduct?.id === product.id && (
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await updateProductMutation.mutateAsync({
                                                                    productId: product.id,
                                                                    productData: editingProduct
                                                                });
                                                                setEditingProduct(null);
                                                                alert('Cập nhật thành công');
                                                            } catch (error) {
                                                                alert('Lỗi: ' + (error.response?.data?.message || error.message));
                                                            }
                                                        }}
                                                        className="bg-green-500 text-white p-1 rounded"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingProduct(null)}
                                                        className="bg-red-500 text-white p-1 rounded"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            {editingProduct?.id === product.id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editingProduct.name}
                                                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                                        className="border rounded px-2 py-1 mb-2 font-semibold"
                                                    />
                                                    <textarea
                                                        value={editingProduct.description || ''}
                                                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                                        className="border rounded px-2 py-1 mb-2 text-sm"
                                                        rows={2}
                                                    />
                                                    <input
                                                        type="number"
                                                        value={editingProduct.price}
                                                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                                        className="border rounded px-2 py-1 mb-2"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Link hình ảnh"
                                                        value={editingProduct.imageUrl || editingProduct.image_url || ''}
                                                        onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value, image_url: e.target.value})}
                                                        className="border rounded px-2 py-1 mb-2"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h4>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description || 'Không có mô tả'}</p>
                                                    <div className="mt-auto flex justify-between items-center">
                                                        <span className="text-red-600 font-bold">
                                                            {formatCurrency(product.price || 0)}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => setEditingProduct({...product})}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                                                                        try {
                                                                            await deleteProductMutation.mutateAsync(product.id);
                                                                            alert('Đã xóa sản phẩm thành công');
                                                                        } catch (error) {
                                                                            const errorMessage = error.response?.data?.message || 
                                                                                               error.response?.data?.errorCode || 
                                                                                               error.message || 
                                                                                               'Không thể xóa sản phẩm. Vui lòng thử lại.';
                                                                            alert('Lỗi: ' + errorMessage);
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Product Modal */}
                        {showProductModal && (
                            <ProductModal
                                onClose={() => setShowProductModal(false)}
                                onSave={async (productData) => {
                                    try {
                                        await createProductMutation.mutateAsync(productData);
                                        setShowProductModal(false);
                                        alert('Thêm sản phẩm thành công');
                                    } catch (error) {
                                        alert('Lỗi: ' + (error.response?.data?.message || error.message));
                                    }
                                }}
                            />
                        )}
                    </div>
                );
            case 'inventory':
                // Filter inventory
                const filteredInventory = inventory?.filter(item => 
                    !searchTerm || 
                    item.productId?.toString().includes(searchTerm) ||
                    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
                ) || [];
                
                // Sort inventory
                const sortedInventory = [...filteredInventory].sort((a, b) => {
                    let aVal, bVal;
                    if (inventorySortBy === 'productId') {
                        aVal = a.productId || 0;
                        bVal = b.productId || 0;
                        const comparison = aVal - bVal;
                        return inventorySortOrder === 'asc' ? comparison : -comparison;
                    } else if (inventorySortBy === 'productName') {
                        aVal = a.productName || '';
                        bVal = b.productName || '';
                        const comparison = aVal.localeCompare(bVal);
                        return inventorySortOrder === 'asc' ? comparison : -comparison;
                    } else if (inventorySortBy === 'quantity') {
                        aVal = a.quantity || 0;
                        bVal = b.quantity || 0;
                        const comparison = aVal - bVal;
                        return inventorySortOrder === 'asc' ? comparison : -comparison;
                    } else if (inventorySortBy === 'availableQuantity') {
                        aVal = a.availableQuantity || 0;
                        bVal = b.availableQuantity || 0;
                        const comparison = aVal - bVal;
                        return inventorySortOrder === 'asc' ? comparison : -comparison;
                    }
                    return 0;
                });
                
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Quản lý tồn kho ({sortedInventory.length})</h3>
                            <div className="flex gap-2">
                                <select
                                    value={inventorySortBy}
                                    onChange={(e) => setInventorySortBy(e.target.value)}
                                    className="border rounded px-2 py-2 text-sm"
                                >
                                    <option value="productId">Sắp xếp theo Product ID</option>
                                    <option value="productName">Sắp xếp theo tên sản phẩm</option>
                                    <option value="quantity">Sắp xếp theo số lượng</option>
                                    <option value="availableQuantity">Sắp xếp theo có sẵn</option>
                                </select>
                                <button
                                    onClick={() => setInventorySortOrder(inventorySortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                                >
                                    {inventorySortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {isLoadingInventory ? (
                            <div className="text-center py-8">
                                <Loader className="animate-spin h-8 w-8 mx-auto text-red-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã đặt</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Có sẵn</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedInventory.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.productName || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {editingInventory?.id === item.id ? (
                                                        <input
                                                            type="number"
                                                            value={editingInventory.quantity}
                                                            onChange={(e) => setEditingInventory({...editingInventory, quantity: parseInt(e.target.value) || 0})}
                                                            className="border rounded px-2 py-1 w-20"
                                                        />
                                                    ) : (
                                                        item.quantity || 0
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reservedQuantity || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.availableQuantity || (item.quantity || 0) - (item.reservedQuantity || 0)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        (item.availableQuantity || (item.quantity || 0) - (item.reservedQuantity || 0)) > 10 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {(item.availableQuantity || (item.quantity || 0) - (item.reservedQuantity || 0)) > 10 ? 'Còn hàng' : 'Sắp hết'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {editingInventory?.id === item.id ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await updateInventoryMutation.mutateAsync({
                                                                            productId: item.productId,
                                                                            quantity: editingInventory.quantity
                                                                        });
                                                                        setEditingInventory(null);
                                                                        alert('Cập nhật thành công');
                                                                    } catch (error) {
                                                                        alert('Lỗi: ' + (error.response?.data?.message || error.message));
                                                                    }
                                                                }}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingInventory(null)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setEditingInventory({...item})}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm(`Bạn có chắc chắn muốn xóa tồn kho cho sản phẩm ID ${item.productId}?`)) {
                                                                        try {
                                                                            await deleteInventoryMutation.mutateAsync(item.productId);
                                                                            alert('Đã xóa tồn kho');
                                                                        } catch (error) {
                                                                            alert('Lỗi: ' + (error.response?.data?.message || error.message));
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'orders':
                const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    try {
                        return new Date(dateString).toLocaleDateString('vi-VN', {
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
                
                const getStatusBadge = (status) => {
                    const statusMap = {
                        'PENDING': { className: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
                        'PROCESSING': { className: 'bg-blue-100 text-blue-800', text: 'Đang xử lý' },
                        'SHIPPED': { className: 'bg-indigo-100 text-indigo-800', text: 'Đang giao hàng' },
                        'DELIVERED': { className: 'bg-green-100 text-green-800', text: 'Đã giao hàng' },
                        'CANCELLED': { className: 'bg-red-100 text-red-800', text: 'Đã hủy' },
                        'RETURNED': { className: 'bg-orange-100 text-orange-800', text: 'Đã trả hàng' }
                    };
                    const statusInfo = statusMap[status?.toUpperCase()] || statusMap['PENDING'];
                    return (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                            {statusInfo.text}
                        </span>
                    );
                };
                
                // Filter orders
                const filteredOrders = orders?.filter(order => 
                    !searchTerm || 
                    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.id?.toString().includes(searchTerm) ||
                    order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase())
                ) || [];
                
                // Sort orders
                const sortedOrders = [...filteredOrders].sort((a, b) => {
                    let aVal, bVal;
                    if (orderSortBy === 'orderNumber') {
                        aVal = a.orderNumber || '';
                        bVal = b.orderNumber || '';
                        const comparison = aVal.localeCompare(bVal);
                        return orderSortOrder === 'asc' ? comparison : -comparison;
                    } else if (orderSortBy === 'createdAt') {
                        aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        const comparison = aVal - bVal;
                        return orderSortOrder === 'asc' ? comparison : -comparison;
                    } else if (orderSortBy === 'totalAmount') {
                        aVal = Number(a.totalAmount) || 0;
                        bVal = Number(b.totalAmount) || 0;
                        const comparison = aVal - bVal;
                        return orderSortOrder === 'asc' ? comparison : -comparison;
                    } else if (orderSortBy === 'status') {
                        aVal = a.status || '';
                        bVal = b.status || '';
                        const comparison = aVal.localeCompare(bVal);
                        return orderSortOrder === 'asc' ? comparison : -comparison;
                    }
                    return 0;
                });
                
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Quản lý đơn hàng ({sortedOrders.length})</h3>
                            <div className="flex gap-2">
                                <select
                                    value={orderSortBy}
                                    onChange={(e) => setOrderSortBy(e.target.value)}
                                    className="border rounded px-2 py-2 text-sm"
                                >
                                    <option value="orderNumber">Sắp xếp theo mã đơn</option>
                                    <option value="createdAt">Sắp xếp theo ngày</option>
                                    <option value="totalAmount">Sắp xếp theo tổng tiền</option>
                                    <option value="status">Sắp xếp theo trạng thái</option>
                                </select>
                                <button
                                    onClick={() => setOrderSortOrder(orderSortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                                >
                                    {orderSortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {isLoadingOrders ? (
                            <div className="text-center py-8">
                                <Loader className="animate-spin h-8 w-8 mx-auto text-red-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ giao</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderNumber || order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount || 0)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.shippingAddress || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <select
                                                        value={order.status || 'PENDING'}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;
                                                            if (window.confirm(`Bạn có chắc chắn muốn đổi trạng thái đơn hàng sang "${newStatus}"?`)) {
                                                                try {
                                                                    await updateOrderStatusMutation.mutateAsync({
                                                                        orderId: order.id,
                                                                        status: newStatus,
                                                                        reason: ''
                                                                    });
                                                                    alert('Cập nhật trạng thái thành công');
                                                                } catch (error) {
                                                                    alert('Lỗi: ' + (error.response?.data?.message || error.message));
                                                                }
                                                            }
                                                        }}
                                                        className="border rounded px-2 py-1 text-xs"
                                                    >
                                                        <option value="PENDING">Chờ xử lý</option>
                                                        <option value="PROCESSING">Đang xử lý</option>
                                                        <option value="SHIPPED">Đang giao hàng</option>
                                                        <option value="DELIVERED">Đã giao hàng</option>
                                                        <option value="CANCELLED">Đã hủy</option>
                                                        <option value="RETURNED">Đã trả hàng</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div
                className={`bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
            >
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-bold text-red-500">Admin Panel</h2>
                    <button
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="space-y-2 px-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 py-3 px-4 rounded transition duration-200 ${activeTab === item.id
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-0 w-full px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 py-3 px-4 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <button
                            className="md:hidden text-gray-500 focus:outline-none"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {menuItems.find(item => item.id === activeTab)?.label}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Xin chào, {auth.user?.name || 'Admin'}</span>
                            <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow p-6 min-h-[500px]">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
