import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import Marketplace from '../pages/Marketplace';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// Protected Consumer Pages
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Profile from '../pages/Profile';

// Protected Farmer Pages
import FarmerDashboard from '../pages/FarmerDashboard';
import FarmerProducts from '../pages/FarmerProducts';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import FarmerOrders from '../pages/FarmerOrders';

// Protected Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminProducts from '../pages/AdminProducts';
import AdminOrders from '../pages/AdminOrders';
import DeliveryOrders from '../pages/DeliveryOrders';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import GuestRoute from './GuestRoute';
import { useAuth } from '../hooks/useAuth';

const HomeRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Home />;
  const destination = user?.role === 'farmer' ? '/farmer/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'delivery-agent' ? '/delivery/orders' : '/marketplace';
  return <Navigate to={destination} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/admin" element={<GuestRoute><Login adminOnly /></GuestRoute>} />
      <Route path="/cart" element={<Cart />} />

      {/* Authenticated User / Consumer Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Farmer Role-Guarded Routes */}
      <Route
        path="/farmer/dashboard"
        element={
          <RoleRoute allowedRoles={['farmer', 'admin']}>
            <FarmerDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/farmer/products"
        element={
          <RoleRoute allowedRoles={['farmer', 'admin']}>
            <FarmerProducts />
          </RoleRoute>
        }
      />
      <Route
        path="/farmer/products/add"
        element={
          <RoleRoute allowedRoles={['farmer', 'admin']}>
            <AddProduct />
          </RoleRoute>
        }
      />
      <Route
        path="/farmer/products/:id/edit"
        element={
          <RoleRoute allowedRoles={['farmer', 'admin']}>
            <EditProduct />
          </RoleRoute>
        }
      />
      <Route
        path="/farmer/orders"
        element={
          <RoleRoute allowedRoles={['farmer', 'admin']}>
            <FarmerOrders />
          </RoleRoute>
        }
      />

      {/* Admin Role-Guarded Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminUsers />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminProducts />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminOrders />
          </RoleRoute>
        }
      />

      <Route
        path="/delivery/orders"
        element={<RoleRoute allowedRoles={['delivery-agent']}><DeliveryOrders /></RoleRoute>}
      />

      {/* Fallback & Auth Errors */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
