import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Footer from './components/Footer/Footer'
import ProductSearch from './pages/ProductSearch/ProductSearch'
import Blog from './pages/Blog/Blog'
import Contact from './pages/Contact/Contact'
import Login from './pages/Login/Login'
import AdminLogin from './pages/AdminLogin/AdminLogin'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import Register from './pages/Register/Register'
import DesighPhoneCase from './pages/DesighPhoneCase/DesighPhoneCase'
import UserDetails from './pages/UserDetails/UserDetails'
import EditUser from './pages/EditUser/EditUser'
import Order from './pages/Order/Order'
import OrderProcess from './pages/OrderProcess/OrderProcess'
import PersonalDesign from './pages/PersonalDesign/PersonalDesign'

import { CartModalProvider } from './context/CartModalContext'
import CartAddModal from './components/CartAddModal/CartAddModal'
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { addToCart } from './api/cartAPI';
import { useNavigate } from 'react-router-dom';

const CartAddModalWrapper = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleConfirmAdd = async (product, quantity) => {
    if (!auth?.user || !auth?.token) {
      navigate('/login');
      return;
    }

    try {
      const cartItem = {
        userId: auth.user.id,
        productId: product.id,
        quantity: quantity,
        price: product.price || product.case_type_price
      };

      await addToCart(cartItem, auth.token);
      
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ['cart', auth.user.id] });
      
      // Show success message (you can add a toast notification here)
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Lỗi khi thêm sản phẩm vào giỏ hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  return <CartAddModal onConfirmAdd={handleConfirmAdd} />;
};

const App = () => {
  return (
    <AuthProvider>
      <div className='app'>
        <CartModalProvider>
          <CartAddModalWrapper />
          <Navbar></Navbar>
          <Routes>
            <Route path='/' element={<Home></Home>}></Route>
            <Route path='/product' element={<ProductSearch></ProductSearch>}></Route>
            <Route path='/cart' element={<Cart></Cart>}></Route>
            <Route path='/blog' element={<Blog></Blog>}></Route>
            <Route path='/contact' element={<Contact></Contact>}></Route>
            <Route path='/cart' element={<Cart></Cart>}></Route>
            <Route path='/custom' element={<DesighPhoneCase></DesighPhoneCase>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/admin/login' element={<AdminLogin></AdminLogin>}></Route>
            <Route path='/admin/dashboard' element={<AdminDashboard></AdminDashboard>}></Route>
            <Route path='/register' element={<Register></Register>}></Route>
            <Route path='/user/:id' element={<UserDetails></UserDetails>}></Route>
            <Route path='/user/edit/:id' element={<EditUser></EditUser>}></Route>
            <Route path='/personal-design' element={<PersonalDesign></PersonalDesign>}></Route>
            <Route path='/order' element={<Order></Order>}></Route>
            <Route path='/order-process' element={<OrderProcess></OrderProcess>}></Route>
          </Routes>
          <Footer></Footer>
        </CartModalProvider>
      </div>
    </AuthProvider>
  )
}

export default App