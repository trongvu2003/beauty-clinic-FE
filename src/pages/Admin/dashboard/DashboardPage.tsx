import React, { useMemo } from "react";
import StatCard from "../../../components/Admin/StatCard/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./DashboardPage.css";

import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { useBrands } from "../../../hooks/useBrands";
import { useBlogs } from "../../../hooks/useBlogs";

const COLORS = [
  "#d4a574",
  "#1e293b",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#f8fafc",
];

export default function DashboardPage() {
  // 1. KẾT NỐI API LẤY DỮ LIỆU THẬT
  const { products, loading: loadingProducts } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { blogs } = useBlogs();
  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const totalBrands = brands?.length || 0;
  const totalBlogs = blogs?.length || 0;
  const categoryChartData = useMemo(() => {
    if (!products || !categories) return [];

    return categories
      .map((cat: any) => {
        const count = products.filter(
          (p: any) => p.categoryId === cat.id
        ).length;
        return { name: cat.name, value: count };
      })
      .filter((item) => item.value > 0);
  }, [products, categories]);

  const lineChartData = useMemo(() => {
    if (!products) return [];
    const data = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `T${targetDate.getMonth() + 1}`;
      const count = products.filter((p: any) => {
        if (!p.createdAt) return false;
        const pDate = new Date(p.createdAt);
        return (
          pDate.getMonth() === targetDate.getMonth() &&
          pDate.getFullYear() === targetDate.getFullYear()
        );
      }).length;

      data.push({ name: monthStr, total: count });
    }
    return data;
  }, [products]);

  if (loadingProducts) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#64748b",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        Đang tải dữ liệu Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Tổng quan hệ thống</h2>
        <p>Theo dõi các chỉ số hoạt động cập nhật theo thời gian thực.</p>
      </div>
      <div className="stats-grid">
        <StatCard title="Tổng Sản phẩm" value={totalProducts.toString()} />
        <StatCard title="Thương hiệu" value={totalBrands.toString()} />
        <StatCard title="Danh mục" value={totalCategories.toString()} />
        <StatCard title="Bài viết" value={totalBlogs.toString()} />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Sản phẩm mới (6 tháng gần nhất)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} sản phẩm`, "Đã thêm"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#d4a574"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#d4a574" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Tỉ lệ theo Danh mục</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} sản phẩm`, "Số lượng"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
