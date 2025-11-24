import { useState } from "react";
import { CartModalContext } from './CartModalContextValue';

const CartModalProvider = ({ children }) => {
    const [modalData, setModalData] = useState({
        open: false,
        product: null,
    });

    const openModal = (product) => {
        setModalData({ open: true, product });
    };

    const closeModal = () => {
        setModalData({ open: false, product: null });
    };

    return (
        <CartModalContext.Provider value={{ modalData, openModal, closeModal }}>
            {children}
        </CartModalContext.Provider>
    );
};

export { CartModalProvider };