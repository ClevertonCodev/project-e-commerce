import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import RegisterUserAdmin from './pages/register-user/RegisterUser';
import RegisterProduct from './pages/product/RegisterProduct';
import ProductTable from './pages/product/ProductsTable';
import ProductsCart from './pages/product/ProductsCart';
import Checkout from './pages/cart-chekout/Checkout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsCart />} />
        <Route path="/carrinho" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUserAdmin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produtos" element={<ProductTable />} />
          <Route path="/register-produto" element={<RegisterProduct />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App
