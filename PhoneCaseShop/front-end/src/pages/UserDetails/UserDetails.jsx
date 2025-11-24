import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetails } from '../../hook/useUser';
import { Loader, User, Mail, Phone, MapPin, Edit, ArrowLeft } from 'lucide-react';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useUserDetails(id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">Lỗi khi tải thông tin người dùng</p>
                    <p className="text-gray-500">{error.message}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Không tìm thấy người dùng</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-indigo-600 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">Thông Tin Người Dùng</h1>
                </div>

                {/* User Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                <p className="text-indigo-100 mt-1">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            {/* User ID */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">ID Người Dùng</p>
                                    <p className="font-semibold text-gray-900">#{user.id}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-semibold text-gray-900">{user.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Số Điện Thoại</p>
                                    <p className="font-semibold text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Địa Chỉ</p>
                                    <p className="font-semibold text-gray-900">{user.address || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            {/* Role */}
                            {user.role && (
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">Vai Trò</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                            user.role === 'EMPLOYEE' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => navigate(`/user/edit/${user.id}`)}
                                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Chỉnh Sửa Thông Tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
