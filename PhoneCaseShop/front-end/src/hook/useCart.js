import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart } from '../api/cartAPI';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const useCart = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    const userId = auth?.user?.id;
    const token = auth?.token;

    // Invalidate cart query when user logs out
    useEffect(() => {
        if (!userId || !token) {
            queryClient.setQueryData(['cart', userId], []);
        }
    }, [userId, token, queryClient]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['cart', userId],
        queryFn: () => getCart(userId, token),
        enabled: !!userId && !!token, // Only fetch if userId and token exist
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false, // Don't retry on error to avoid unnecessary API calls
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });

    return { cartItems: data || [], isLoading, error };
};
