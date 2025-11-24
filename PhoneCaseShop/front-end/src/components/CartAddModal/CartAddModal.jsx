"use client";

import React, { useEffect, useState } from "react";
import { useCartModal } from "../../context/useCartModal";

export default function CartAddModal({ onConfirmAdd }) {
    const { modalData, closeModal } = useCartModal();
    const product = modalData?.product;

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // reset quantity when modal opens
        if (modalData?.open) setQuantity(1);
    }, [modalData?.open]);

    if (!product) return null;

    return (
        modalData.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">Thêm vào giỏ hàng</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <img
                            src={product.imageUrl || product.case_type_image_url || 'https://placehold.co/400x400/cccccc/000000?text=No+Image'}
                            alt={product.name || product.case_type_name || 'Product'}
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <p className="font-bold">{product.name || product.case_type_name || 'Product Name'}</p>
                            <p className="text-sm text-gray-500">{product.model || product.phone_model_name || product.brand || ''}</p>
                            <p className="text-red-500 font-bold mt-2">
                                {Number(product.price || product.case_type_price || 0).toLocaleString()} đ
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm">Số lượng</label>
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                            className="border rounded px-3 py-2 w-full mt-1"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={closeModal} className="px-4 py-2 border rounded">Hủy</button>
                        <button
                            onClick={() => {
                                onConfirmAdd && onConfirmAdd(product, quantity);
                                closeModal();
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>  
            </div>
        )
    );
}
