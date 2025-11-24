import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, getAdminProducts, getAdminInventory, updateUser, deleteUser } from '../api/userApi';
import { getStatistics } from '../api/statisticsAPI';
import { getAdminOrders, updateOrderStatus } from '../api/orderAPI';
import { createProduct, updateProduct, deleteProduct } from '../api/productApi';
import { updateInventory, deleteInventory } from '../api/inventoryAPI';
import { useAuth } from '../context/AuthContext';

export const useAdminUsers = () => {
    const { auth } = useAuth();
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => getAdminUsers(auth?.token),
        enabled: !!auth?.token,
    });
};

export const useAdminProducts = () => {
    const { auth } = useAuth();
    return useQuery({
        queryKey: ['admin', 'products'],
        queryFn: () => getAdminProducts(auth?.token),
        enabled: !!auth?.token,
    });
};

export const useAdminInventory = () => {
    const { auth } = useAuth();
    return useQuery({
        queryKey: ['admin', 'inventory'],
        queryFn: () => getAdminInventory(auth?.token),
        enabled: !!auth?.token,
    });
};

export const useAdminStatistics = (period = null) => {
    const { auth } = useAuth();
    return useQuery({
        queryKey: ['admin', 'statistics', period],
        queryFn: () => getStatistics(auth?.token, period),
        enabled: !!auth?.token,
    });
};

export const useAdminOrders = () => {
    const { auth } = useAuth();
    return useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: () => getAdminOrders(auth?.token),
        enabled: !!auth?.token,
    });
};

// Mutations
export const useUpdateUser = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, userData }) => updateUser(userId, userData, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

export const useDeleteUser = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => deleteUser(userId, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

export const useCreateProduct = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productData) => createProduct(productData, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, productData }) => updateProduct(productId, productData, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
    });
};

export const useDeleteProduct = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId) => deleteProduct(productId, auth?.token),
        onSuccess: () => {
            // Invalidate and refetch immediately
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.refetchQueries({ queryKey: ['admin', 'products'] });
        },
    });
};

export const useUpdateInventory = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, quantity }) => updateInventory(productId, quantity, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
        },
    });
};

export const useDeleteInventory = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId) => deleteInventory(productId, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
        },
    });
};

export const useUpdateOrderStatus = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status, reason }) => updateOrderStatus(orderId, status, reason, auth?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
        },
    });
};
