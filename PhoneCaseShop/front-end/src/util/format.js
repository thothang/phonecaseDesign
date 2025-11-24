export const formatCurrency = (amount) => {
    if (amount == null || amount === undefined) return '0 VNĐ';
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numAmount).replace('₫', ' VNĐ');
};