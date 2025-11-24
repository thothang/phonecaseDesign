import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 

// 🛑 2. KHỞI TẠO QUERY CLIENT 🛑
const queryClient = new QueryClient({
    // Bạn có thể thêm cấu hình mặc định ở đây nếu cần
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 phút
        },
    },
});

// Hàm kích hoạt mocking
async function enableMocking() {
  // Chỉ kích hoạt trong môi trường dev
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
        // Tùy chọn: Ghi logs của MSW ra console
        onUnhandledRequest: 'bypass', 
    });
  }
}

// 3. Gọi hàm kích hoạt và Render ứng dụng
enableMocking().then(() => {
 createRoot(document.getElementById('root')).render(
    // Sử dụng <React.StrictMode> là tốt nhất
    // <React.StrictMode> 
        <BrowserRouter>
            {/* 🛑 4. WRAP VỚI QueryClientProvider 🛑 */}
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    // </React.StrictMode>,
 );
})
