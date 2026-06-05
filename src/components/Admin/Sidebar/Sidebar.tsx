import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Award,
  ListTree,
  FileText,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  // Hàm này giúp ép NavLink gắn class "active" chuẩn xác
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      {/* --- HEADER --- */}
      <div className="sidebar-header">
        <div className="logo-icon">B</div>
        <span className="logo-text">BEAUTY ADMIN</span>
      </div>

      {/* --- MENU --- */}
      <nav className="sidebar-nav">
        <p className="nav-title">QUẢN LÝ CHÍNH</p>

        <NavLink to="/admin/dashboard" className={navClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className={navClass}>
          <Package size={20} />
          <span>Sản phẩm</span>
        </NavLink>

        <NavLink to="/admin/brands" className={navClass}>
          <Award size={20} />
          <span>Thương hiệu</span>
        </NavLink>

        <NavLink to="/admin/categories" className={navClass}>
          <ListTree size={20} />
          <span>Danh mục</span>
        </NavLink>

        <NavLink to="/admin/blogs" className={navClass}>
          <FileText size={20} />
          <span>Bài viết</span>
        </NavLink>
      </nav>
    </aside>
  );
}
