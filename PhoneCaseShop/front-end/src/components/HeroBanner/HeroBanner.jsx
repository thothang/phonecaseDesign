import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeroBanner = () => {
  const slides = [
        { 
            id: 1, 
            title: "ỐP LƯNG CAO CẤP - THIẾT KẾ ĐỘC QUYỀN", 
            subtitle: "Giảm ngay 20% cho bộ sưu tập Mùa Hè 2024",
            imageUrl: "https://placehold.co/1200x500/A78BFA/ffffff?text=Summer+Collection", // Placeholder cho ốp lưng rực rỡ
            cta: "Mua Sắm Ngay",
            ctaLink: "#sale-20",
        },
        { 
            id: 2, 
            title: "TỰ THIẾT KẾ ỐP LƯNG CỦA RIÊNG BẠN", 
            subtitle: "Biến ảnh của bạn thành phong cách không giới hạn!",
            imageUrl: "https://placehold.co/1200x500/5B21B6/ffffff?text=Custom+Case+Design", // Placeholder cho custom case
            cta: "Bắt Đầu Thiết Kế",
            ctaLink: "#custom-tool",
        },
        { 
            id: 3, 
            title: "MUA 1 TẶNG 1 - ƯU ĐÃI KHỦNG CUỐI TUẦN", 
            subtitle: "Áp dụng cho mọi dòng iPhone và Samsung",
            imageUrl: "https://placehold.co/1200x500/C084FC/ffffff?text=BOGO+Weekend+Deal", // Placeholder cho ưu đãi
            cta: "Xem Chi Tiết Ưu Đãi",
            ctaLink: "#bogo-deal",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Tự động chuyển slide sau 5 giây (Auto-play)
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    // eslint-disable-next-line no-unused-vars
    const slide = slides[currentSlide];

    return (
        <section className="relative w-full overflow-hidden shadow-2xl">
            {/* Vùng chứa Slide */}
            <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
                {slides.map((s, index) => (
                    <div 
                        key={s.id}
                        // Hiệu ứng Fade
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        style={{ 
                            // Sử dụng hình nền Placeholder
                            backgroundImage: `url('${s.imageUrl}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Overlay để tăng độ tương phản của chữ */}
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                            <div className="text-center max-w-3xl text-white">
                                <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight shadow-text-sm">
                                    {s.title}
                                </h1>
                                <p className="text-lg sm:text-xl mb-6 font-light shadow-text-sm">
                                    {s.subtitle}
                                </p>
                                <a
                                    href={s.ctaLink}
                                    className="inline-block px-8 py-3 bg-red-500 text-white font-bold uppercase tracking-wider rounded-full shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
                                >
                                    {s.cta}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút điều hướng (Arrows) */}
            <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white/70 text-indigo-700 rounded-full hover:bg-white transition-colors duration-300 z-20 shadow-md"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white/70 text-indigo-700 rounded-full hover:bg-white transition-colors duration-300 z-20 shadow-md"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Chỉ báo Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-indigo-700 w-6' : 'bg-white/50 hover:bg-white'}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default HeroBanner