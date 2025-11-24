import React from 'react';

const samplePosts = [
    {
        id: 1,
        title: '5 Mẹo Chọn Ốp Lưng Hoàn Hảo Cho Điện Thoại Của Bạn',
        excerpt: 'Việc chọn một chiếc ốp lưng không chỉ là về bảo vệ, mà còn là về phong cách. Dưới đây là 5 mẹo giúp bạn đưa ra quyết định đúng đắn...',
        imageUrl: 'https://placehold.co/600x400/A78BFA/ffffff?text=Blog+Post+1',
        author: 'CaseShop Admin',
        date: 'October 15, 2025',
        category: 'Mẹo & Thủ Thuật',
    },
    {
        id: 2,
        title: 'Xu Hướng Ốp Lưng 2025: Những Gì Đang Hot?',
        excerpt: 'Từ vật liệu bền vững đến các thiết kế cá nhân hóa, hãy cùng khám phá những xu hướng ốp lưng nổi bật nhất trong năm nay.',
        imageUrl: 'https://placehold.co/600x400/F97316/ffffff?text=Blog+Post+2',
        author: 'CaseShop Admin',
        date: 'October 10, 2025',
        category: 'Xu Hướng',
    },
    {
        id: 3,
        title: 'Tại Sao Ốp Lưng Custom Lại Là Món Quà Ý Nghĩa?',
        excerpt: 'Một chiếc ốp lưng được thiết kế riêng không chỉ là một phụ kiện, mà còn là một món quà mang đậm dấu ấn cá nhân. Tìm hiểu lý do tại sao...',
        imageUrl: 'https://placehold.co/600x400/5B21B6/ffffff?text=Blog+Post+3',
        author: 'CaseShop Admin',
        date: 'October 5, 2025',
        category: 'Quà Tặng',
    },
];

const BlogPostCard = ({ post }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img className="w-full h-56 object-cover" src={post.imageUrl} alt={post.title} />
        <div className="p-6">
            <p className="text-sm text-indigo-600 font-semibold">{post.category}</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 hover:text-indigo-700 transition-colors">
                <a href="#">{post.title}</a>
            </h3>
            <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    <span>{post.author}</span> &middot; <span>{post.date}</span>
                </div>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Đọc thêm &rarr;</a>
            </div>
        </div>
    </div>
);


const Blog = () => {
  return (
    <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Tin Tức & Bài Viết
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    Khám phá các mẹo, xu hướng và câu chuyện từ thế giới ốp lưng.
                </p>
            </div>
            <div className="grid gap-10 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                {samplePosts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default Blog;