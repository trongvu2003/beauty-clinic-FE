import React, { useState } from "react";
import { useBrands, useBrandMutations } from "../../../hooks/useBrands";
import BrandForm from "../../../components/Admin/form/BrandForm";
import type { Brand } from "../../../types/product.types";
import "../blogs/BlogManagement.css";
import { Eye, EyeOff } from "lucide-react";

const defaultImg = "../../../assets/images/default.avif";

const getFullImageUrl = (imgPath?: string | null) => {
  if (!imgPath) return defaultImg;
  if (imgPath.startsWith("http")) return imgPath;
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const formattedPath = imgPath.replace(/\\/g, "/");
  return formattedPath.startsWith("/")
    ? `${backendUrl}${formattedPath}`
    : `${backendUrl}/${formattedPath}`;
};

const BrandManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    brands,
    loading: isFetching,
    error: fetchError,
    refetch,
  } = useBrands();
  const { deleteBrand, updateBrand, loading: isMutating } = useBrandMutations();

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${name}" không?`)
    ) {
      try {
        await deleteBrand(id);
        alert("Xóa thành công!");
        refetch();
      } catch (error: any) {
        alert(error.message || "Xóa thất bại!");
      }
    }
  };

  // Nút Gạt Trạng Thái trực tiếp trên bảng
  const handleToggleActive = async (brand: Brand) => {
    const formData = new FormData();
    formData.append("name", brand.name);
    if (brand.description) formData.append("description", brand.description);

    // Lật ngược trạng thái hiện tại
    formData.append("isActive", (!brand.isActive).toString());

    try {
      await updateBrand(brand.id, formData);
      refetch(); // Cập nhật lại bảng
    } catch (error: any) {
      alert("Lỗi khi đổi trạng thái: " + error.message);
    }
  };

  return (
    <div className="bm-container">
      {currentView === "form" ? (
        <BrandForm
          brandId={editingId}
          onSuccess={() => {
            setCurrentView("list");
            setEditingId(null);
            refetch();
          }}
          onCancel={() => {
            setCurrentView("list");
            setEditingId(null);
          }}
        />
      ) : (
        <>
          <div className="bm-header">
            <h1 className="bm-title">Quản lý thương hiệu</h1>
            <button
              className="bm-btn bm-btn-add"
              onClick={() => {
                setEditingId(null);
                setCurrentView("form");
              }}
            >
              + Thêm thương hiệu
            </button>
          </div>

          {fetchError && <div className="bm-alert-error">⚠️ {fetchError}</div>}

          <div className="bm-table-wrapper">
            <table className="bm-table">
              <thead>
                <tr>
                  <th>Thương hiệu (Logo)</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={4} className="bm-empty-state">
                      Đang tải dữ liệu, vui lòng đợi...
                    </td>
                  </tr>
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="bm-empty-state">
                      Chưa có thương hiệu nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand: Brand) => (
                    <tr key={brand.id}>
                      <td>
                        <div className="bm-blog-info">
                          <img
                            className="bm-blog-img"
                            style={{
                              objectFit: "contain",
                              padding: "2px",
                              backgroundColor: "#fff",
                            }}
                            src={getFullImageUrl(brand.imageUrl)}
                            alt={brand.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultImg;
                            }}
                          />
                          <div>
                            <div className="bm-blog-title">{brand.name}</div>
                            <div className="bm-blog-id">Mã: {brand.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: "250px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          {brand.description || "—"}
                        </div>
                      </td>

                      <td>
                        <button
                          onClick={() => handleToggleActive(brand)}
                          disabled={isMutating || isFetching}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "none",
                            transition: "all 0.2s",
                            backgroundColor: brand.isActive
                              ? "#dcfce7"
                              : "#f3f4f6",
                            color: brand.isActive ? "#166534" : "#374151",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          }}
                        >
                          {brand.isActive ? " Hoạt động" : " Tạm ẩn"}
                        </button>
                      </td>

                      <td>
                        <div className="bm-actions">
                          <button
                            className="bm-action-btn bm-btn-edit"
                            onClick={() => {
                              setEditingId(brand.id);
                              setCurrentView("form");
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="bm-action-btn bm-btn-delete"
                            onClick={() => handleDelete(brand.id, brand.name)}
                            disabled={isMutating}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BrandManagement;
