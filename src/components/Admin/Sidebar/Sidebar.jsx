import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">BEAUTY ADMIN</div>

      <nav>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>

        <NavLink to="/admin/products">Sản phẩm</NavLink>

        <NavLink to="/admin/brands">Thương hiệu</NavLink>

        <NavLink to="/admin/categories">Danh mục</NavLink>

        <NavLink to="/admin/blogs">Bài viết</NavLink>
      </nav>
    </aside>
  );
}
