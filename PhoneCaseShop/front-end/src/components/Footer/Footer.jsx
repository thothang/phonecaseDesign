import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-16 pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-gray-700 pb-10 mb-8">
                    
                    {/* Cột 1: Logo và Mô tả */}
                    <div className="col-span-2 lg:col-span-1">
                        <a href="#" className="text-3xl font-extrabold text-indigo-400 tracking-wider font-serif mb-3 block">
                            CaseShop
                        </a>
                        <p className="text-sm text-gray-400 mt-2 pr-4">
                            Ốp lưng chất lượng cao, thiết kế độc đáo và bảo vệ tối đa cho điện thoại của bạn.
                        </p>
                    </div>

                    {/* Cột 2: Danh mục */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Danh Mục Sản Phẩm</h4>
                        <ul className="space-y-2 text-sm">
                            {['Ốp iPhone', 'Ốp Samsung', 'Ốp Custom', 'Bộ Sưu Tập Mới', 'Ốp Chống Sốc'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ Khách hàng */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Hỗ Trợ</h4>
                        <ul className="space-y-2 text-sm">
                            {['Liên Hệ', 'Chính Sách Đổi Trả', 'Câu Hỏi Thường Gặp', 'Hướng Dẫn Mua Hàng', 'Tra Cứu Đơn Hàng'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Cột 4: Thông tin Liên hệ */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-lg font-semibold mb-4 text-white">Liên Hệ Chúng Tôi</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center">
                                <MapPin className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-400">123 Đường Phụ Kiện, Quận Ốp Lưng, TP. HCM</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-400">0987 654 321</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-400">support@caseshop.vn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 5: Đăng ký Nhận Bản Tin (chỉ hiển thị trên desktop) */}
                    <div className="hidden lg:block">
                        <h4 className="text-lg font-semibold mb-4 text-white">Nhận Ưu Đãi</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Đăng ký email để nhận thông tin giảm giá độc quyền.
                        </p>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                className="p-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
                            >
                                Đăng Ký
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} CaseShop. Tất cả bản quyền đã được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer