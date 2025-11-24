import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, getOrders, getOrderById } from '../api/orderAPI';
import { useAuth } from '../context/AuthContext';

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    return useMutation({
        mutationFn: (orderData) => createOrder(orderData, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            queryClient.invalidateQueries(['cart']); // Assuming cart is cleared after order
        },
    });
};

export const useOrders = () => {
    const { auth } = useAuth();
    const userId = auth?.user?.id;

    const { data, isLoading, error } = useQuery({
        queryKey: ['orders', userId],
        queryFn: () => getOrders(userId, auth?.token),
        enabled: !!userId && !!auth?.token,
    });

    return { orders: data, isLoading, error };
};

export const useOrder = (orderId) => {
    const { auth } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderById(orderId, auth?.token),
        enabled: !!orderId && !!auth?.token,
    });

    return { order: data, isLoading, error };
};
