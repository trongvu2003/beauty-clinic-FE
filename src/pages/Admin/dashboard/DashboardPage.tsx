import StatCard from "../../../components/Admin/StatCard/StatCard";
import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <>
      <div className="dashboard-header">
        <h2>Tổng quan</h2>
      </div>

      <div className="stats-grid">
        <StatCard title="Sản phẩm" value="120" />
        <StatCard title="Thương hiệu" value="15" />
        <StatCard title="Danh mục" value="8" />
        <StatCard title="Bài viết" value="25" />
      </div>
    </>
  );
}
