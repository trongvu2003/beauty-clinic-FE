import React, { useState, useEffect } from "react";
import { useProduct, useProductMutations } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { useBrands } from "../../../hooks/useBrands";
import "./ProductForm.css";

interface ProductFormProps {
  productId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const getFullImageUrl = (imgPath?: string | null) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http")) return imgPath;
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const formattedPath = imgPath.replace(/\\/g, "/");
  return formattedPath.startsWith("/")
    ? `${backendUrl}${formattedPath}`
    : `${backendUrl}/${formattedPath}`;
};

const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const { product, loading: isFetching } = useProduct(productId || "");
  const {
    createProduct,
    updateProduct,
    loading: isSubmitting,
    error: submitError,
  } = useProductMutations();

  const { categories } = useCategories();
  const { brands } = useBrands();

  const [formState, setFormState] = useState({
    name: "",
    sku: "",
    description: "",
    content: "",
    price: "",
    salePrice: "",
    stock: "",
    categoryId: "",
    brandId: "",
    isFeatured: false,
    isActive: true,
    metaTitle: "",
    metaDesc: "",
    metaKeywords: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (product && productId) {
      setFormState({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        content: product.content || "",
        price: product.price?.toString() || "",
        salePrice: product.salePrice?.toString() || "",
        stock: product.stock?.toString() || "0",
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        metaTitle: product.metaTitle || "",
        metaDesc: product.metaDesc || "",
        metaKeywords: product.metaKeywords || "",
      });
    }
  }, [product, productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormState((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Nạp toàn bộ dữ liệu vào FormData
    formData.append("name", formState.name);
    formData.append("sku", formState.sku);
    formData.append("description", formState.description);
    formData.append("content", formState.content);
    formData.append("price", formState.price);

    if (formState.salePrice) formData.append("salePrice", formState.salePrice);

    formData.append("stock", formState.stock);

    // Gửi đi sẽ tự động là ID vì thẻ <select> đã lưu ID vào formState
    formData.append("categoryId", formState.categoryId);
    formData.append("brandId", formState.brandId);

    // Lưu ý: FormData chỉ nhận dạng chuỗi (String) hoặc File
    formData.append("isFeatured", formState.isFeatured.toString());
    formData.append("isActive", formState.isActive.toString());

    formData.append("metaTitle", formState.metaTitle);
    formData.append("metaDesc", formState.metaDesc);
    formData.append("metaKeywords", formState.metaKeywords);

    // Gắn mảng file ảnh
    selectedFiles.forEach((file) => formData.append("images", file));
    console.log("=== KIỂM TRA DỮ LIỆU SẮP GỬI ĐI ===");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      if (productId) {
        await updateProduct(productId, formData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(formData);
        alert("Thêm sản phẩm thành công!");
      }
      onSuccess();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  if (isFetching && productId) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  return (
    <div className="pm-form-wrapper">
      <h2 className="pm-form-title">
        {productId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h2>

      {submitError && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="pm-form">
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          1. Thông tin cơ bản
        </h3>

        <div className="pm-form-row">
          <div className="pm-form-group" style={{ flex: 2 }}>
            <label>Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pm-form-group" style={{ flex: 1 }}>
            <label>Mã SKU *</label>
            <input
              type="text"
              name="sku"
              value={formState.sku}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="pm-form-row">
          <div className="pm-form-group">
            <label>Mô tả ngắn (Description)</label>
            <input
              type="text"
              name="description"
              value={formState.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pm-form-group">
          <label>Nội dung chi tiết (Content)</label>
          <textarea
            name="content"
            value={formState.content}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          2. Giá cả & Tồn kho
        </h3>
        <div className="pm-form-row">
          <div className="pm-form-group">
            <label>Giá bán *</label>
            <input
              type="number"
              name="price"
              value={formState.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="pm-form-group">
            <label>Giá khuyến mãi</label>
            <input
              type="number"
              name="salePrice"
              value={formState.salePrice}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="pm-form-group">
            <label>Tồn kho *</label>
            <input
              type="number"
              name="stock"
              value={formState.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          3. Phân loại
        </h3>
        <div className="pm-form-row">
          <div className="pm-form-group">
            <label>Danh mục (Category) *</label>
            <select
              name="categoryId"
              value={formState.categoryId}
              onChange={handleChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#f9fafb",
              }}
            >
              <option value="" disabled>
                -- Chọn danh mục --
              </option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="pm-form-group">
            <label>Thương hiệu (Brand) *</label>
            <select
              name="brandId"
              value={formState.brandId}
              onChange={handleChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#f9fafb",
              }}
            >
              <option value="" disabled>
                -- Chọn thương hiệu --
              </option>
              {brands?.map((brand: any) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pm-form-row">
          <div className="pm-form-group pm-checkbox-group">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formState.isFeatured}
              onChange={handleChange}
            />
            <label htmlFor="isFeatured">Sản phẩm nổi bật</label>
          </div>
          <div className="pm-form-group pm-checkbox-group">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formState.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive">Đang hoạt động (Hiển thị)</label>
          </div>
        </div>

        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          4. Tối ưu SEO
        </h3>
        <div className="pm-form-group">
          <label>Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formState.metaTitle}
            onChange={handleChange}
          />
        </div>
        <div className="pm-form-row">
          <div className="pm-form-group">
            <label>Meta Description</label>
            <input
              type="text"
              name="metaDesc"
              value={formState.metaDesc}
              onChange={handleChange}
            />
          </div>
          <div className="pm-form-group">
            <label>Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formState.metaKeywords}
              onChange={handleChange}
            />
          </div>
        </div>
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          5. Hình ảnh
        </h3>
        <div className="pm-form-group">
          <label>Tải lên ảnh sản phẩm</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="pm-file-input"
          />

          {/* --- KHU VỰC HIỂN THỊ ẢNH Ở ĐÂY --- */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            {previewUrls.length > 0 ? (
              // 1. Nếu đang chọn ảnh mới -> Hiện ảnh mới
              previewUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    overflow: "hidden",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))
            ) : productId && product?.images && product.images.length > 0 ? (
              // 2. Nếu không chọn ảnh mới, đang ở chế độ Sửa -> Hiện mảng ảnh cũ từ Backend
              product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    overflow: "hidden",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <img
                    src={getFullImageUrl(img)}
                    alt={`current-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))
            ) : productId && product?.imageUrl ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  overflow: "hidden",
                  backgroundColor: "#f9fafb",
                }}
              >
                <img
                  src={getFullImageUrl(product.imageUrl)}
                  alt="current"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : null}
          </div>

          {productId && selectedFiles.length === 0 && (
            <p
              className="pm-form-hint"
              style={{ marginTop: "8px", color: "#6b7280", fontSize: "13px" }}
            >
              Bỏ trống nếu không muốn thay đổi ảnh hiện tại.
            </p>
          )}
        </div>

        <div className="pm-form-actions">
          <button
            type="button"
            className="pm-btn-form pm-btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="pm-btn-form pm-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
