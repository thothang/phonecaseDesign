import React, { useEffect, useState } from 'react';
import { useDesign } from '../../hook/useDesign';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { deleteDesign } from '../../api/designApi';
import { useQueryClient } from '@tanstack/react-query';

// Mapping styles for camera based on ID (duplicated from DesighPhoneCase.jsx)
const CAMERA_STYLES = {
    pm1: 'absolute top-4 right-4 w-10 h-10 rounded-lg z-30',
    pm2: 'absolute top-5 left-5 w-20 h-20 rounded-2xl z-30 flex flex-col items-center justify-center space-y-2 p-1',
    pm3: 'absolute top-4 left-1/2 -translate-x-1/2 w-8 h-24 rounded-full z-30'
};

const PersonalDesign = () => {
    const { fetchUserDesigns, designs, isLoading, error } = useDesign();
    const [phoneModels, setPhoneModels] = useState({});
    const [deletingIds, setDeletingIds] = useState(new Set());
    const { auth } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userId = auth.user ? auth.user.id : null;

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                await fetchUserDesigns(userId);
            }
            try {
                const response = await fetch('/api/phone-models');
                if (response.ok) {
                    const data = await response.json();
                    const models = {};
                    data.forEach(m => {
                        models[m.id] = {
                            id: m.id,
                            name: m.name,
                            aspectRatio: m.aspect_ratio,
                            borderRadius: m.border_radius,
                            cameraClasses: CAMERA_STYLES[m.id] || 'absolute top-4 right-4 w-10 h-10 rounded-lg z-30'
                        };
                    });
                    setPhoneModels(models);
                }
            } catch (err) {
                console.error("Error fetching phone models", err);
            }
        };
        fetchData();
    }, [fetchUserDesigns, userId]);

    const handleDeleteDesign = async (designId) => {
        if (!auth?.token) {
            alert('Vui lòng đăng nhập');
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn xóa thiết kế này?')) {
            return;
        }

        setDeletingIds(prev => new Set(prev).add(designId));
        try {
            await deleteDesign(designId, auth.token);
            // Refetch designs
            if (userId) {
                await fetchUserDesigns(userId);
            }
            alert('Đã xóa thiết kế thành công');
        } catch (error) {
            console.error('Error deleting design:', error);
            alert('Lỗi khi xóa thiết kế: ' + (error.response?.data?.message || error.message));
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(designId);
                return newSet;
            });
        }
    };

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
                    <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem các thiết kế của mình.</p>
                    <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-red-500 text-lg">Lỗi: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Bộ Sưu Tập Thiết Kế Của Tôi</h1>
                    <Link
                        to="/custom"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Tạo Thiết Kế Mới
                    </Link>
                </div>

                {designs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg mb-4">Bạn chưa có thiết kế nào.</p>
                        <Link to="/custom" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Bắt đầu thiết kế ngay &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {designs.map((design) => {
                            // Parse designConfig if it's a JSON string
                            let designConfig = {};
                            try {
                                designConfig = typeof design.designConfig === 'string' 
                                    ? JSON.parse(design.designConfig) 
                                    : (design.designConfig || {});
                            } catch (e) {
                                console.error('Error parsing designConfig:', e);
                            }

                            // Get phone model from designConfig or design object
                            const phoneModelName = design.phoneModel || design.phone_model || designConfig.phone_model || 'Unknown';
                            const caseColor = designConfig.color_hex_value || design.color_hex_value || '#374151';
                            
                            // Find matching phone model by name
                            const currentModel = Object.values(phoneModels).find(m => m?.name === phoneModelName) || 
                                                phoneModels[design.phone_model_id];
                            
                            // Get image data (base64 or URL)
                            const imageData = design.imageData || design.image_data || design.image_url;
                            const imageUrl = imageData?.startsWith('data:') ? imageData : 
                                           imageData?.startsWith('http') ? imageData :
                                           imageData ? `data:image/png;base64,${imageData}` : null;

                            return (
                                <div key={design.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 flex flex-col">
                                    <div className="relative bg-gray-100 p-4 flex items-center justify-center h-80 overflow-hidden">
                                        {/* PREVIEW LOGIC */}
                                        {currentModel ? (
                                            <div style={{ transform: 'scale(0.45)', transformOrigin: 'center' }}>
                                                <div
                                                    className={`relative w-80 shadow-2xl overflow-hidden border-8 
                                    ${caseColor === 'transparent' ? 'border-gray-400' : 'border-gray-900'}`}
                                                    style={{
                                                        aspectRatio: currentModel.aspectRatio,
                                                        borderRadius: currentModel.borderRadius,
                                                        backgroundColor: caseColor === 'transparent' ? 'white' : caseColor,
                                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                                                    }}
                                                >
                                                    {/* Nền caro cho ốp trong suốt */}
                                                    {caseColor === 'transparent' && (
                                                        <div
                                                            className="absolute inset-0 w-full h-full z-0"
                                                            style={{
                                                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                                                backgroundSize: '20px 20px',
                                                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                                            }}
                                                        ></div>
                                                    )}

                                                    {/* Camera cutout */}
                                                    <div
                                                        className={`${currentModel.cameraClasses} bg-black/70 border-2 border-black/50`}
                                                    >
                                                        {/* Lens giả cho Mẫu 2 */}
                                                        {currentModel.id === 'pm2' && (
                                                            <>
                                                                <div className='w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-500'></div>
                                                                <div className='w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-500'></div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {imageUrl && (
                                                        <div
                                                            className="absolute"
                                                            style={{
                                                                left: `${designConfig.position_x || design.position_x || 50}%`,
                                                                top: `${designConfig.position_y || design.position_y || 50}%`,
                                                                transform: `translate(-50%, -50%) scale(${designConfig.scale || design.scale || 1}) rotate(${designConfig.rotation || design.rotation || 0}deg)`,
                                                                width: '100%',
                                                                transformOrigin: 'center center',
                                                                zIndex: 20
                                                            }}
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt="Design"
                                                                className="w-full h-auto"
                                                                draggable="false"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">Loading model...</div>
                                        )}

                                        <div className="absolute top-2 right-2 flex space-x-2 z-10">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${design.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {design.status === 'draft' ? 'Bản nháp' : 'Đã đặt hàng'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 truncate" title={design.designName || design.design_name || 'Thiết kế không tên'}>
                                                {design.designName || design.design_name || 'Thiết kế không tên'}
                                            </h3>
                                            <div className="mt-2 text-sm text-gray-500 space-y-1">
                                                <p>Mẫu máy: <span className="font-medium text-gray-700">{phoneModelName}</span></p>
                                                <p>Ngày tạo: <span className="font-medium text-gray-700">{design.createdAt || design.created_at ? new Date(design.createdAt || design.created_at).toLocaleDateString('vi-VN') : 'N/A'}</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button 
                                                onClick={() => navigate(`/custom?edit=${design.id}`)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm font-medium"
                                            >
                                                <Edit2 className="w-4 h-4 mr-1" /> Sửa
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteDesign(design.id)}
                                                disabled={deletingIds.has(design.id)}
                                                className="text-red-600 hover:text-red-900 flex items-center text-sm font-medium disabled:opacity-50"
                                            >
                                                {deletingIds.has(design.id) ? (
                                                    <Loader className="w-4 h-4 mr-1 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                )}
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalDesign;
