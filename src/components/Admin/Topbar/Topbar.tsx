import { Bell, Search } from "lucide-react";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h3>Tổng quan hệ thống</h3>
        <p className="topbar-subtitle">Chào mừng bạn quay lại, Admin! 👋</p>
      </div>
      <div className="topbar-right">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Tìm kiếm nhanh..." />
        </div>

        <button className="noti-btn">
          <Bell size={20} />
          <span className="noti-badge"></span>
        </button>
        <div className="admin-profile">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=d4a574&color=fff&bold=true"
            alt="Admin Avatar"
          />
        </div>
      </div>
    </header>
  );
}
