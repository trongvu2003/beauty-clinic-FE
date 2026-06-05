import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import BlogDetail from "../pages/blogsDetail/Blogdetail";
import ProductDetail from "../pages/ProductDetail/Productdetail";
import DashboardPage from "../pages/Admin/dashboard/DashboardPage";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProductManagement from "../pages/Admin/products/ProductManagement";
import BlogManagement from "../pages/Admin/blogs/BlogManagement";
import BrandManagement from "../pages/Admin/brands/BrandManagement";
import CategoryManagement from "../pages/Admin/categories/CategoryManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="brands" element={<BrandManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
