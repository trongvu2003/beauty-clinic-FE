import React, { useState, useEffect } from "react";
import {
  useCategory,
  useCategoryMutations,
} from "../../../hooks/useCategories";
import "./CategoryForm.css";

interface CategoryFormProps {
  categoryId?: string | null;
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

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryId,
  onSuccess,
  onCancel,
}) => {
  const { category, loading: isFetching } = useCategory(categoryId || "");
  const {
    createCategory,
    updateCategory,
    loading: isSubmitting,
    error: submitError,
  } = useCategoryMutations();

  const [formState, setFormState] = useState({
    name: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDesc: "",
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (category && categoryId) {
      setFormState({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        metaTitle: category.metaTitle || "",
        metaDesc: category.metaDesc || "",
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    }
  }, [category, categoryId]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      name: value,
      slug: !categoryId ? generateSlug(value) : prev.slug,
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
    formData.append("slug", formState.slug);

    // Ép kiểu boolean thành chuỗi cho FormData
    formData.append("isActive", formState.isActive ? "true" : "false");

    if (formState.description.trim())
      formData.append("description", formState.description);
    if (formState.metaTitle.trim())
      formData.append("metaTitle", formState.metaTitle);
    if (formState.metaDesc.trim())
      formData.append("metaDesc", formState.metaDesc);

    if (selectedFile) formData.append("image", selectedFile);

    try {
      if (categoryId) {
        await updateCategory(categoryId, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await createCategory(formData);
        alert("Thêm danh mục thành công!");
      }
      onSuccess();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  if (isFetching && categoryId) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="catf-wrapper">
      <h2 className="catf-title">
        {categoryId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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

      <form onSubmit={handleSubmit} className="catf-form">
        <div className="catf-row">
          <div className="catf-group" style={{ flex: 1 }}>
            <label>Tên danh mục *</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="catf-group" style={{ flex: 1 }}>
            <label>Đường dẫn tĩnh (Slug) *</label>
            <input
              type="text"
              name="slug"
              value={formState.slug}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="catf-group">
          <label>Mô tả (Description)</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="catf-group catf-checkbox-group">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formState.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">Đang hoạt động (Hiển thị trên web)</label>
        </div>

        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          Tối ưu SEO (Tùy chọn)
        </h3>
        <div className="catf-row">
          <div className="catf-group" style={{ flex: 1 }}>
            <label>Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formState.metaTitle}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="catf-group">
          <label>Meta Description</label>
          <textarea
            name="metaDesc"
            value={formState.metaDesc}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          Hình ảnh
        </h3>
        <div className="catf-group">
          <label>Ảnh đại diện danh mục</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="catf-file-input"
          />

          <div className="catf-image-preview-container">
            {previewUrl ? (
              <div className="catf-image-preview-wrapper">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="catf-image-preview"
                />
              </div>
            ) : categoryId && category?.imageUrl ? (
              <div className="catf-image-preview-wrapper">
                <img
                  src={getFullImageUrl(category.imageUrl)}
                  alt="Current Image"
                  className="catf-image-preview"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="catf-actions">
          <button
            type="button"
            className="catf-btn catf-btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="catf-btn catf-btn-submit"
            disabled={isSubmitting}
          >
            Lưu danh mục
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
