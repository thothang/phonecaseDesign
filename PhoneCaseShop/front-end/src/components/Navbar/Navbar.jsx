import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, ShoppingCart, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hook/useCart';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { auth, setAuth } = useAuth();
  const { cartItems, isLoading: isCartLoading } = useCart();

  const totalQuantity = (cartItems && Array.isArray(cartItems)) ? cartItems.length : 0;

  const navItems = [
    { name: 'Trang Chủ', href: '/' },
    { name: 'Sản Phẩm', href: '/product' },
    { name: 'Thiết Kế', href: '/custom' },
    { name: 'Tin Tức', href: '/blog' },
    { name: 'Liên Hệ', href: '/contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo / Tên Cửa Hàng */}
          <div className="flex-shrink-0">
            <a href="/" className="text-3xl font-extrabold text-indigo-700 tracking-wider font-serif">
              CaseShop
            </a>
            <span className="ml-2 text-xs text-gray-500 hidden sm:inline">Phụ kiện & Phong cách</span>
          </div>

          {/* Menu Chính - Desktop */}
          <div className="hidden md:flex space-x-6 lg:space-x-10 items-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-200 uppercase tracking-wide"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Icons Hành Động (Search, Cart, User) */}
          <div className="flex items-center space-x-4">
            {/* Nút Tìm kiếm */}
            <button
              aria-label="Tìm kiếm"
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Admin Button - Only show for ADMIN role */}
            {auth?.user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 flex items-center"
                title="Admin Dashboard"
              >
                <Shield className="h-5 w-5 mr-1" />
                <span className="text-sm font-semibold hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Giỏ Hàng */}
            <a
              href="/cart"
              aria-label="Giỏ hàng"
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* Badge số lượng sản phẩm */}
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </a>

            {/* Tài Khoản / User */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="Tài khoản"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200 flex items-center"
              >
                <User className="h-5 w-5 mr-1" />
                {auth?.user ? (
                  <span className="font-semibold text-sm">Hi, {auth.user.name}</span>
                ) : (
                  <span className="text-sm">Tài khoản</span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-xl z-50 py-1 ring-1 ring-black ring-opacity-5">
                  {auth?.user ? (
                    <>
                      <a
                        href={`/user/${auth.user.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Thông tin người dùng
                      </a>
                      <a
                        href="/order-process"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Theo dõi đơn hàng của bạn
                      </a>
                      <a
                        href="/personal-design"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Thiết kế của bạn
                      </a>
                      <button
                        onClick={() => {
                          localStorage.removeItem('auth');
                          setAuth({ user: null, token: null });
                          setIsUserMenuOpen(false);
                          // Navigate to home after logout
                          window.location.href = '/';
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng Nhập
                      </a>
                      <a
                        href="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng Ký
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Nút Hamburger (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Mở menu chính</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile - Dropdown */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg pb-2 transition-all duration-300`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)} // Đóng menu khi click
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
          {/* Thêm link Tài khoản cho Mobile */}
          <a
            href="#profile"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 sm:hidden transition-colors duration-200"
          >
            Tài Khoản
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar