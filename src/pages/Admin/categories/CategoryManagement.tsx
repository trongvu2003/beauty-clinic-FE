import React, { useState } from "react";
import {
  useCategories,
  useCategoryMutations,
} from "../../../hooks/useCategories";
import CategoryForm from "../../../components/Admin/form/CategoryForm";
import type { Category } from "../../../types/product.types";
import "./CategoryManagement.css";

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

const CategoryManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    categories,
    loading: isFetching,
    error: fetchError,
    refetch,
  } = useCategories();
  const {
    deleteCategory,
    updateCategory,
    loading: isMutating,
  } = useCategoryMutations();

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(`Xóa danh mục "${name}"? Thao tác này không thể hoàn tác.`)
    ) {
      try {
        await deleteCategory(id);
        alert("Xóa thành công!");
        refetch();
      } catch (error: any) {
        alert(error.message || "Xóa thất bại!");
      }
    }
  };

  // Hàm lật trạng thái (Bật/Tắt) nhanh
  const handleToggleActive = async (category: Category) => {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    formData.append("isActive", (!category.isActive).toString());

    if (category.description)
      formData.append("description", category.description);
    if (category.metaTitle) formData.append("metaTitle", category.metaTitle);
    if (category.metaDesc) formData.append("metaDesc", category.metaDesc);

    try {
      await updateCategory(category.id, formData);
      refetch();
    } catch (error: any) {
      alert("Lỗi đổi trạng thái: " + error.message);
    }
  };

  return (
    <div className="catm-container">
      {currentView === "form" ? (
        <CategoryForm
          categoryId={editingId}
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
          <div className="catm-header">
            <h1 className="catm-title">Quản lý danh mục</h1>
            <button
              className="catm-btn catm-btn-add"
              onClick={() => {
                setEditingId(null);
                setCurrentView("form");
              }}
            >
              + Thêm danh mục
            </button>
          </div>

          {fetchError && (
            <div className="catm-alert-error">⚠️ {fetchError}</div>
          )}

          <div className="catm-table-wrapper">
            <table className="catm-table">
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={4} className="catm-empty-state">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="catm-empty-state">
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                ) : (
                  categories.map((category: Category) => (
                    <tr key={category.id}>
                      <td>
                        <div className="catm-info">
                          <img
                            className="catm-img"
                            src={getFullImageUrl(category.imageUrl)}
                            alt={category.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultImg;
                            }}
                          />
                          <div>
                            <div className="catm-name">{category.name}</div>
                            <div className="catm-slug">/{category.slug}</div>
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
                          {category.description || "—"}
                        </div>
                      </td>

                      <td>
                        <button
                          onClick={() => handleToggleActive(category)}
                          disabled={isMutating || isFetching}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "none",
                            transition: "all 0.2s",
                            backgroundColor: category.isActive
                              ? "#dcfce7"
                              : "#f3f4f6",
                            color: category.isActive ? "#166534" : "#374151",
                          }}
                        >
                          {category.isActive ? " Hoạt động" : " Tạm ẩn"}
                        </button>
                      </td>

                      <td>
                        <div className="catm-actions">
                          <button
                            className="catm-action-btn catm-btn-edit"
                            onClick={() => {
                              setEditingId(category.id);
                              setCurrentView("form");
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="catm-action-btn catm-btn-delete"
                            onClick={() =>
                              handleDelete(category.id, category.name)
                            }
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

export default CategoryManagement;
