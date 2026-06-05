import React, { useState, useEffect } from "react";
import { useBrand, useBrandMutations } from "../../../hooks/useBrands";
import "./BrandForm.css";

interface BrandFormProps {
  brandId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// 1. Hàm tạo link ảnh
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

// 2. Hàm hỗ trợ tạo Slug tự động ở Frontend
const generateSlug = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const BrandForm: React.FC<BrandFormProps> = ({
  brandId,
  onSuccess,
  onCancel,
}) => {
  const { brand, loading: isFetching } = useBrand(brandId || "");
  const {
    createBrand,
    updateBrand,
    loading: isSubmitting,
    error: submitError,
  } = useBrandMutations();

  // THÊM TRƯỜNG SLUG VÀO STATE
  const [formState, setFormState] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (brand && brandId) {
      setFormState({
        name: brand.name || "",
        slug: brand.slug || "", // Đổ slug cũ vào
        description: brand.description || "",
        isActive: brand.isActive !== undefined ? brand.isActive : true,
      });
    }
  }, [brand, brandId]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Xử lý riêng cho ô Tên để tự động điền Slug (chỉ khi đang thêm mới)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      name: value,
      // Tự động tạo slug nếu là thêm mới. Nếu đang sửa thì không tự đổi slug để tránh hỏng link SEO cũ.
      slug: !brandId ? generateSlug(value) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", formState.name);

    // GÓI SLUG LÊN BACKEND CHỖ NÀY:
    formData.append("slug", formState.slug);

    formData.append("isActive", formState.isActive ? "true" : "false");

    if (formState.description.trim()) {
      formData.append("description", formState.description);
    }

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (brandId) {
        await updateBrand(brandId, formData);
        alert("Cập nhật thương hiệu thành công!");
      } else {
        await createBrand(formData);
        alert("Thêm thương hiệu thành công!");
      }
      onSuccess();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  if (isFetching && brandId) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="brf-wrapper">
      <h2 className="brf-title">
        {brandId ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
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

      <form onSubmit={handleSubmit} className="brf-form">
        <div className="brf-group">
          <label>Tên thương hiệu *</label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="brf-group">
          <label>Đường dẫn tĩnh (Slug) *</label>
          <input
            type="text"
            name="slug"
            value={formState.slug}
            onChange={handleChange}
            required
          />
          <p className="brf-hint">Ví dụ: my-pham-chinh-hang</p>
        </div>

        <div className="brf-group">
          <label>Mô tả (Description)</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="brf-group brf-checkbox-group">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formState.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">Đang hoạt động (Hiển thị)</label>
        </div>

        <div className="brf-group">
          <label>Logo thương hiệu</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="brf-file-input"
          />

          <div className="brf-image-preview-container">
            {previewUrl ? (
              <div className="brf-image-preview-wrapper">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="brf-image-preview"
                />
              </div>
            ) : brandId && brand?.imageUrl ? (
              <div className="brf-image-preview-wrapper">
                <img
                  src={getFullImageUrl(brand.imageUrl)}
                  alt="Current Logo"
                  className="brf-image-preview"
                />
              </div>
            ) : null}
          </div>
          {brandId && !previewUrl && (
            <p className="brf-hint">
              Bỏ trống nếu không muốn thay đổi logo hiện tại.
            </p>
          )}
        </div>

        <div className="brf-actions">
          <button
            type="button"
            className="brf-btn brf-btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="brf-btn brf-btn-submit"
            disabled={isSubmitting}
          >
            Lưu thương hiệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;
