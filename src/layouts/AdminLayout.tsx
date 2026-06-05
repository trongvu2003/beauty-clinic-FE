import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar/Sidebar";
import Topbar from "../components/Admin/Topbar/Topbar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
