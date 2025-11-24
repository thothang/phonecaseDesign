import { useQuery } from '@tanstack/react-query';
import { fetchAllProduct } from '../api/productApi';

// Custom Hook sử dụng TanStack Query
export const useProduct = () => {
  return useQuery({ 
    // Hàm gọi API thực
    queryKey: ['products'],
    queryFn: () => fetchAllProduct(), 
  });
};