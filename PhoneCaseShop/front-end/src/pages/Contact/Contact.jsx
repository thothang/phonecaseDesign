import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Chúng tôi luôn sẵn lòng lắng nghe! Gửi câu hỏi hoặc phản hồi cho chúng tôi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-gray-50 p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi Tin Nhắn</h2>
                        <form action="#" method="POST" className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                                    <input type="text" name="first-name" id="first-name" autoComplete="name" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input id="email" name="email" type="email" autoComplete="email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Chủ Đề</label>
                                <input type="text" name="subject" id="subject" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nội Dung Tin Nhắn</label>
                                <textarea id="message" name="message" rows={4} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <Send className="w-5 h-5 mr-2 -ml-1" />
                                    Gửi Đi
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-indigo-700 text-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Thông Tin Liên Hệ</h2>
                        <ul className="space-y-6">
                            <li className="flex items-start">
                                <MapPin className="w-6 h-6 text-indigo-300 mr-4 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Địa Chỉ</h3>
                                    <p className="text-indigo-200">123 Đường Phụ Kiện, Quận Ốp Lưng, TP. HCM</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Phone className="w-6 h-6 text-indigo-300 mr-4 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Điện Thoại</h3>
                                    <p className="text-indigo-200">0987 654 321</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Mail className="w-6 h-6 text-indigo-300 mr-4 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-indigo-200">support@caseshop.vn</p>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8 border-t border-indigo-600 pt-6">
                            <h3 className="font-semibold mb-2">Giờ Làm Việc</h3>
                            <p className="text-indigo-200">Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                            <p className="text-indigo-200">Thứ 7: 10:00 - 16:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;