import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert } from 'lucide-react';
import { useAdminLogin } from '../../hook/useUser';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const adminLoginMutation = useAdminLogin();
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        adminLoginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    setSuccess('Đăng nhập quản trị viên thành công!');
                    setAuth({ user: data.user, token: data.token });
                    // Redirect to admin dashboard or home
                    navigate('/admin/dashboard', { replace: true });
                },
                onError: (err) => {
                    setError(err?.response?.data?.message || 'Đăng nhập thất bại');
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <ShieldAlert className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Quản Trị Viên Đăng Nhập
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Khu vực dành riêng cho quản trị hệ thống
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email Quản Trị
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                    placeholder="admin@gmail.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Mật khẩu
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}
                        {success && <div className="text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">{success}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={adminLoginMutation.isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 transition-colors duration-200"
                            >
                                {adminLoginMutation.isLoading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
