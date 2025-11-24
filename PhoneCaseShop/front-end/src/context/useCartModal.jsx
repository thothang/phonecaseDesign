import { useContext } from 'react';
import { CartModalContext } from './CartModalContextValue';

export const useCartModal = () => useContext(CartModalContext);
