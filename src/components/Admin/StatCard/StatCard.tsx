import "./StatCard.css";
import { Package, Award, ListTree, FileText } from "lucide-react";

interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  const renderIcon = () => {
    if (title.includes("Sản phẩm")) return <Package size={22} />;
    if (title.includes("Thương hiệu")) return <Award size={22} />;
    if (title.includes("Danh mục")) return <ListTree size={22} />;
    return <FileText size={22} />;
  };

  return (
    <div className="stat-card">
      <div className="stat-card-icon">{renderIcon()}</div>
      <div className="stat-card-info">
        <p className="stat-card-label">{title}</p>
        <h2 className="stat-card-value">{value}</h2>
      </div>
    </div>
  );
}
