import React, { useState } from "react";
import { useProducts, useProductMutations } from "../../../hooks/useProducts";
import type { Product, ProductQuery } from "../../../types/product.types";
import ProductForm from "../../../components/Admin/form/ProductForm";
import "./ProductManagement.css";

const defaultImg = "../../../assets/images/default.avif";

const getProductImage = (product: Product): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  let imgPath =
    product.imageUrl ||
    (product.images && product.images.length > 0 ? product.images[0] : "");

  if (!imgPath) return defaultImg;
  if (imgPath.startsWith("http")) return imgPath;

  imgPath = imgPath.replace(/\\/g, "/");
  return imgPath.startsWith("/")
    ? `${backendUrl}${imgPath}`
    : `${backendUrl}/${imgPath}`;
};

const ProductManagement: React.FC = () => {
  const [query, setQuery] = useState<ProductQuery>({
    page: 1,
    limit: 10,
  });

  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    products,
    loading: isFetching,
    error: fetchError,
    refetch,
  } = useProducts(query);

  const { deleteProduct, loading: isDeleting } = useProductMutations();

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${name}" không? Hành động này không thể hoàn tác.`
      )
    ) {
      try {
        await deleteProduct(id);
        alert("Xóa sản phẩm thành công!");
        refetch();
      } catch (error: any) {
        alert(error.message || "Xóa thất bại!");
      }
    }
  };

  return (
    <div className="pm-container">
      {/* Kiểm tra trạng thái currentView: 
        - Nếu là "form" -> Render ProductForm
        - Nếu là "list" -> Render Bảng danh sách
      */}
      {currentView === "form" ? (
        <ProductForm
          productId={editingId}
          onSuccess={() => {
            setCurrentView("list");
            setEditingId(null);
            refetch(); // Load lại data mới nhất sau khi Thêm/Sửa thành công
          }}
          onCancel={() => {
            setCurrentView("list");
            setEditingId(null);
          }}
        />
      ) : (
        <>
          <div className="pm-header">
            <h1 className="pm-title">Quản lý sản phẩm</h1>
            <button
              className="pm-btn pm-btn-add"
              onClick={() => {
                setEditingId(null); // Reset ID về null để hiểu là form Thêm Mới
                setCurrentView("form"); // Chuyển view
              }}
            >
              + Thêm sản phẩm
            </button>
          </div>

          {fetchError && <div className="pm-alert-error">⚠️ {fetchError}</div>}

          <div className="pm-table-wrapper">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá bán</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={4} className="pm-empty-state">
                      Đang tải dữ liệu, vui lòng đợi...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="pm-empty-state">
                      Chưa có sản phẩm nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="pm-product-info">
                          <img
                            className="pm-product-img"
                            src={getProductImage(product)} // Đã dùng hàm chuẩn nên không cần fallback ở đây nữa
                            alt={product.name}
                            onError={(e) => {
                              // Xử lý lỗi load ảnh bị hỏng URL trên trình duyệt
                              (e.target as HTMLImageElement).src = defaultImg;
                            }}
                          />
                          <div>
                            <div className="pm-product-name">
                              {product.name}
                            </div>
                            <div className="pm-product-id">
                              Mã: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {product.salePrice ? (
                          <div>
                            <div className="pm-price-sale">
                              {product.salePrice.toLocaleString("vi-VN")} ₫
                            </div>
                            <div className="pm-price-original">
                              {product.price.toLocaleString("vi-VN")} ₫
                            </div>
                          </div>
                        ) : (
                          <div className="pm-price-regular">
                            {product.price.toLocaleString("vi-VN")} ₫
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`pm-badge ${
                            product.isFeatured
                              ? "pm-badge-featured"
                              : "pm-badge-normal"
                          }`}
                        >
                          {product.isFeatured ? "Nổi bật" : "Mặc định"}
                        </span>
                      </td>
                      <td>
                        <div className="pm-actions">
                          <button
                            className="pm-action-btn pm-btn-edit"
                            onClick={() => {
                              setEditingId(product.id);
                              setCurrentView("form");
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="pm-action-btn pm-btn-delete"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
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

export default ProductManagement;
