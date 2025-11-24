import React, { useState, useRef, useCallback } from 'react';
import { Upload, Minimize2, Maximize2, RotateCcw, RotateCw, Trash2, Move, Check, ShoppingCart } from 'lucide-react';
import { useDesign } from '../../hook/useDesign';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from '../../api/cartAPI';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Mapping styles for camera based on ID (since mock data lacks visual styling details)
const CAMERA_STYLES = {
  pm1: 'absolute top-4 right-4 w-10 h-10 rounded-lg z-30',
  pm2: 'absolute top-5 left-5 w-20 h-20 rounded-2xl z-30 flex flex-col items-center justify-center space-y-2 p-1',
  pm3: 'absolute top-4 left-1/2 -translate-x-1/2 w-8 h-24 rounded-full z-30'
};

// Dữ liệu cho các màu ốp lưng
const caseColors = [
  { name: 'Đen', value: '#374151' }, // gray-700
  { name: 'Trắng', value: '#F3F4F6' }, // gray-100
  { name: 'Xanh Navy', value: '#1E3A8A' }, // blue-800
  { name: 'Hồng Phấn', value: '#FBCFE8' }, // pink-200
  { name: 'Trong Suốt', value: 'transparent' }
];

// Dữ liệu ban đầu cho hình ảnh thiết kế
const initialDesign = {
  url: null,
  filename: null,
  x: 50,
  y: 50,
  scale: 1.0,
  rotation: 0,
};

// Component chính của ứng dụng
const DesighPhoneCase = () => {
  const [design, setDesign] = useState(initialDesign);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showSpecs, setShowSpecs] = useState(false);

  // THÊM MỚI: Trạng thái cho màu và mẫu ốp
  const [caseColor, setCaseColor] = useState(caseColors[0].value); // Mặc định là màu Đen
  const [phoneModels, setPhoneModels] = useState({});
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hook xử lý lưu thiết kế
  const { saveDesign, isLoading: isSaving } = useDesign();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [savedDesignId, setSavedDesignId] = useState(null);

  // Lấy thông tin mẫu ốp hiện tại
  const currentModel = selectedModelId ? phoneModels[selectedModelId] : null;

  // Ref cho vùng ốp lưng để tính toán giới hạn kéo thả
  const caseRef = useRef(null);
  const imageRef = useRef(null);

  React.useEffect(() => {
    const fetchPhoneModels = async () => {
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
          if (data.length > 0) {
            setSelectedModelId(data[0].id);
          }
        } else {
          console.error('Failed to fetch phone models');
        }
      } catch (error) {
        console.error('Error fetching phone models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoneModels();
  }, []);

  // Xử lý tải ảnh lên
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Nếu có ảnh cũ, thu hồi URL
      if (design.url) {
        URL.revokeObjectURL(design.url);
      }

      const url = URL.createObjectURL(file);

      // Đặt lại vị trí, tỉ lệ và xoay khi tải ảnh mới
      setDesign({
        url,
        filename: file.name,
        x: 50,
        y: 50,
        scale: 1.0,
        rotation: 0
      });
    }
  };

  // Bắt đầu kéo
  const handleMouseDown = useCallback((e) => {
    if (!design.url) return;
    e.preventDefault();

    setIsDragging(true);

    const imgBounds = imageRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    setDragOffset({
      x: clientX - imgBounds.left - imgBounds.width / 2,
      y: clientY - imgBounds.top - imgBounds.height / 2,
    });
  }, [design.url]);

  // Đang kéo
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !caseRef.current) return;
    e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const caseBounds = caseRef.current.getBoundingClientRect();
    const newClientX = clientX - dragOffset.x;
    const newClientY = clientY - dragOffset.y;

    let newX = ((newClientX - caseBounds.left) / caseBounds.width) * 100;
    let newY = ((newClientY - caseBounds.top) / caseBounds.height) * 100;

    newX = Math.max(-20, Math.min(120, newX));
    newY = Math.max(-20, Math.min(120, newY));

    setDesign(prev => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  }, [isDragging, dragOffset]);

  // Kết thúc kéo
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Thay đổi tỉ lệ (scale)
  const handleScaleChange = (factor) => {
    setDesign(prev => ({
      ...prev,
      scale: Math.max(0.2, Math.min(5.0, prev.scale + factor)), // Giới hạn từ 0.2x đến 5.0x
    }));
  };

  // Thay đổi góc xoay (rotation)
  const handleRotateChange = (angle) => {
    setDesign(prev => ({
      ...prev,
      rotation: (prev.rotation + angle) % 360, // Giới hạn góc xoay từ 0 đến 359
    }));
  };

  // Xóa ảnh
  const handleDeleteImage = () => {
    if (design.url) {
      URL.revokeObjectURL(design.url); // Giải phóng bộ nhớ của ảnh đã tải lên
    }
    setDesign(initialDesign);
  };

  // Convert blob URL to base64
  const blobToBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Remove data:image/...;base64, prefix if present
            const base64 = reader.result.split(',')[1] || reader.result;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  // Xử lý lưu thiết kế
  const handleSaveDesign = async () => {
    if (!auth?.user || !auth?.token) {
      alert('Vui lòng đăng nhập để lưu thiết kế');
      navigate('/login');
      return;
    }

    if (!design.url) {
      alert('Vui lòng tải ảnh lên trước khi lưu thiết kế');
      return;
    }

    try {
      // Convert blob URL to base64
      const base64Image = await blobToBase64(design.url);
      
      const designData = {
        userId: auth.user.id,
        designName: design.filename || 'Custom Design',
        imageData: base64Image, // Base64 encoded image
        phoneModel: currentModel?.name || 'Unknown',
        caseType: 'Custom',
        designConfig: JSON.stringify({
          position_x: design.x,
          position_y: design.y,
          scale: design.scale,
          rotation: design.rotation,
          color_hex_value: caseColor
        })
      };

      console.log('Sending design data:', { ...designData, imageData: '...base64...' }); // Debug log

      const savedDesign = await saveDesign(designData);
      console.log('Saved design response:', savedDesign); // Debug log
      
      // Handle both response formats: direct object or wrapped in data
      const designId = savedDesign?.id || savedDesign?.data?.id;
      
      if (!designId) {
        console.error('Design ID not found in response:', savedDesign);
        alert('Lưu thiết kế thành công nhưng không nhận được ID. Vui lòng thử lại.');
        return;
      }
      
      setSavedDesignId(designId);
      // Không đóng modal ngay, để user có thể thêm vào giỏ hàng
      // setShowSpecs(false);
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Lỗi khi lưu thiết kế: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  // Thêm design vào giỏ hàng
  const handleAddDesignToCart = async () => {
    if (!auth?.user || !auth?.token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    if (!savedDesignId) {
      alert('Vui lòng lưu thiết kế trước khi thêm vào giỏ hàng');
      return;
    }

    try {
      // Giá mặc định cho custom design (có thể lấy từ backend)
      const customDesignPrice = 399000; // 399,000 VND
      
      const cartItem = {
        userId: auth.user.id,
        designId: savedDesignId,
        productId: null, // Design không có productId
        quantity: 1,
        price: customDesignPrice
      };

      console.log('Adding design to cart:', cartItem); // Debug log
      
      const result = await addToCart(cartItem, auth.token);
      console.log('Add to cart result:', result); // Debug log
      
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ['cart', auth.user.id] });
      
      alert('Đã thêm thiết kế vào giỏ hàng!');
      setSavedDesignId(null); // Reset sau khi thêm vào giỏ
      setShowSpecs(false); // Đóng modal
    } catch (error) {
      console.error('Error adding design to cart:', error);
      alert('Lỗi khi thêm vào giỏ hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  // Đăng ký sự kiện kéo thả toàn cục
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
          Thiết Kế Ốp Lưng Điện Thoại 2D
        </h1>
        <p className="text-gray-600">Tải ảnh lên, kéo thả, xoay và tùy chỉnh kích thước theo ý bạn.</p>
      </header>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">

        {/* KHU VỰC ĐIỀU KHIỂN (CONTROLS) */}
        <div className="md:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Công Cụ
          </h2>

          {/* THÊM MỚI: TÙY CHỈNH ỐP LƯNG */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-medium text-gray-700">1. Chọn Mẫu Ốp Lưng</h3>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Object.values(phoneModels).map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>

            <h3 className="text-lg font-medium text-gray-700 pt-2">2. Chọn Màu Ốp Lưng</h3>
            <div className="flex flex-wrap gap-3">
              {caseColors.map(color => (
                <button
                  key={color.value}
                  title={color.name}
                  onClick={() => setCaseColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-150 ${caseColor === color.value ? 'ring-4 ring-offset-2 ring-indigo-500 transform scale-110' : 'border-gray-300'}`}
                  style={{
                    backgroundColor: color.value === 'transparent' ? '#fff' : color.value,
                    backgroundImage: color.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                    backgroundSize: color.value === 'transparent' ? '12px 12px' : 'auto',
                    backgroundPosition: color.value === 'transparent' ? '0 0, 0 6px, 6px -6px, -6px 0px' : 'auto'
                  }}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="mb-6" />

          {/* NÚT TẢI LÊN */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">3. Tải Ảnh Thiết Kế</h3>
            <label
              htmlFor="imageUpload"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-green-500 hover:bg-green-600 transition duration-150 cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Tải Ảnh Lên
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* CÁC ĐIỀU KHIỂN KHÁC (CHỈ HIỂN THỊ KHI CÓ ẢNH) */}
          {design.url && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700 -mb-2">4. Tùy Chỉnh Ảnh</h3>
              {/* ĐIỀU KHIỂN KÍCH THƯỚC */}
              <div className="p-4 bg-indigo-50 rounded-lg shadow-inner">
                <h3 className="text-lg font-medium text-indigo-700 mb-3 flex items-center">
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Phóng To / Thu Nhỏ
                </h3>
                <div className="flex justify-between items-center space-x-3">
                  <button
                    onClick={() => handleScaleChange(-0.1)}
                    className="p-3 bg-indigo-400 text-white rounded-full hover:bg-indigo-500 transition disabled:opacity-50"
                    title="Thu nhỏ"
                    disabled={design.scale <= 0.2}
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-mono text-indigo-700 w-20 text-center">
                    {(design.scale * 100).toFixed(0)}%
                  </span>
                  <button
                    onClick={() => handleScaleChange(0.1)}
                    className="p-3 bg-indigo-400 text-white rounded-full hover:bg-indigo-500 transition disabled:opacity-50"
                    title="Phóng to"
                    disabled={design.scale >= 5.0}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-xs text-indigo-500 mt-2">
                  Tỉ lệ hiện tại
                </p>
              </div>

              {/* ĐIỀU KHIỂN XOAY ẢNH */}
              <div className="p-4 bg-purple-50 rounded-lg shadow-inner">
                <h3 className="text-lg font-medium text-purple-700 mb-3 flex items-center">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Xoay Ảnh
                </h3>
                <div className="flex justify-between items-center space-x-3">
                  <button
                    onClick={() => handleRotateChange(-15)} // Xoay 15 độ ngược chiều kim đồng hồ
                    className="p-3 bg-purple-400 text-white rounded-full hover:bg-purple-500 transition"
                    title="Xoay trái"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-mono text-purple-700 w-20 text-center">
                    {design.rotation}°
                  </span>
                  <button
                    onClick={() => handleRotateChange(15)} // Xoay 15 độ cùng chiều kim đồng hồ
                    className="p-3 bg-purple-400 text-white rounded-full hover:bg-purple-500 transition"
                    title="Xoay phải"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-xs text-purple-500 mt-2">
                  Góc xoay hiện tại
                </p>
              </div>

              {/* NÚT XÓA ẢNH */}
              <button
                onClick={handleDeleteImage}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-red-500 hover:bg-red-600 transition duration-150"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Xóa Ảnh
              </button>

              {/* NÚT XÁC NHẬN THIẾT KẾ */}
              <button
                onClick={() => setShowSpecs(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150"
              >
                <Check className="w-5 h-5 mr-2" />
                Xác Nhận Thiết Kế
              </button>
            </div>
          )}
        </div>

        {/* KHU VỰC THIẾT KẾ (DESIGN CANVAS) */}
        <div className="md:w-2/3 flex justify-center items-start">
          {currentModel && (
            <div
              ref={caseRef}
              className={`relative w-full max-w-xs shadow-2xl overflow-hidden border-8 
                          ${caseColor === 'transparent' ? 'border-gray-400' : 'border-gray-900'}`}
              style={{
                aspectRatio: currentModel.aspectRatio,
                borderRadius: currentModel.borderRadius,
                backgroundColor: caseColor === 'transparent' ? 'white' : caseColor,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease' // Thêm hiệu ứng chuyển động mượt
              }}
            >
              {/* THAY ĐỔI: Nền caro cho ốp trong suốt */}
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

              {/* THAY ĐỔI: Vùng cắt camera động */}
              <div
                className={`${currentModel.cameraClasses} bg-black/70 border-2 border-black/50`}
              >
                {/* Thêm lens giả cho Mẫu 2 */}
                {currentModel.id === 'pm2' && (
                  <>
                    <div className='w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-500'></div>
                    <div className='w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-500'></div>
                  </>
                )}
              </div>

              {design.url ? (
                <>
                  <div
                    ref={imageRef}
                    className={`absolute cursor-move transition-shadow duration-300 ${isDragging ? 'shadow-2xl shadow-yellow-500/50 border-4 border-yellow-500' : 'shadow-lg'}`}
                    style={{
                      left: `${design.x}%`,
                      top: `${design.y}%`,
                      transform: `translate(-50%, -50%) scale(${design.scale}) rotate(${design.rotation}deg)`,
                      width: '100%',
                      transformOrigin: 'center center',
                      zIndex: 20 // Nằm trên nền (z-0) và placeholder (z-10), dưới camera (z-30)
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                  >
                    <img
                      src={design.url}
                      alt="Ảnh thiết kế"
                      className="w-full h-auto"
                      draggable="false"
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                  {/* Lớp overlay trong suốt để người dùng biết có thể kéo thả */}
                  <div
                    className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none 
                                ${isDragging ? 'bg-indigo-500/10' : 'hover:bg-indigo-500/10'}`}
                  >
                    <Move className={`w-10 h-10 text-white/70 transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 p-6 text-center z-10">
                  <Upload className="w-12 h-12 mb-3" />
                  <p className="font-semibold">Vui lòng tải ảnh lên để bắt đầu thiết kế!</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <footer className="mt-10 pt-4 border-t w-full max-w-4xl text-center text-sm text-gray-500">
        <p>Ghi chú: Ứng dụng này chỉ là mô phỏng 2D. Kéo thả được thực hiện bằng cách click chuột vào ảnh và di chuyển. Phóng to/thu nhỏ và xoay bằng các nút điều khiển.</p>
      </footer>

      {/* MODAL HIỂN THỊ THÔNG SỐ KỸ THUẬT */}
      {showSpecs && currentModel && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Thông Số Kỹ Thuật
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Đây là thông tin (mô phỏng) để nhà sản xuất tái tạo thiết kế của bạn:
            </p>
            <div className="space-y-3 text-gray-700">
              {/* THAY ĐỔI: Thêm thông tin mẫu và màu */}
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Mẫu Ốp Lưng:</span>
                <span className="font-mono text-black">
                  {currentModel.name}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Màu Ốp Lưng:</span>
                <span className="font-mono text-black flex items-center gap-2">
                  {caseColors.find(c => c.value === caseColor)?.name || caseColor}
                  <div
                    className="w-4 h-4 rounded-full border border-gray-400"
                    style={{
                      backgroundColor: caseColor === 'transparent' ? '#fff' : caseColor,
                      backgroundImage: caseColor === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%)' : 'none',
                      backgroundSize: '8px 8px'
                    }}
                  ></div>
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Tên File Ảnh:</span>
                <span className="font-mono text-black max-w-[60%] truncate" title={design.filename || 'N/A'}>
                  {design.filename || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Vị Trí (X, Y):</span>
                <span className="font-mono text-black">
                  ({design.x.toFixed(2)}%, {design.y.toFixed(2)}%)
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Tỉ Lệ Phóng:</span>
                <span className="font-mono text-black">
                  {(design.scale * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Góc Xoay:</span>
                <span className="font-mono text-black">
                  {design.rotation}°
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              {!savedDesignId ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSpecs(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                  >
                    {isSaving ? 'Đang lưu...' : 'Xác Nhận & Lưu'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-800 font-semibold">✓ Thiết kế đã được lưu thành công!</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowSpecs(false);
                        setSavedDesignId(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={handleAddDesignToCart}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesighPhoneCase;