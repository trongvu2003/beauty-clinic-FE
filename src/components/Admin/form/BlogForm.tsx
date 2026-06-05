import React, { useState, useEffect } from "react";
import { useBlog, useBlogMutations } from "../../../hooks/useBlogs";
import "./BlogForm.css";

interface BlogFormProps {
  blogId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const getFullImageUrl = (imgPath: string) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http")) return imgPath;
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const formattedPath = imgPath.replace(/\\/g, "/");
  return formattedPath.startsWith("/")
    ? `${backendUrl}${formattedPath}`
    : `${backendUrl}/${formattedPath}`;
};

const BlogForm: React.FC<BlogFormProps> = ({ blogId, onSuccess, onCancel }) => {
  const { blog, loading: isFetching } = useBlog(blogId || "");
  const {
    createBlog,
    updateBlog,
    loading: isSubmitting,
    error: submitError,
  } = useBlogMutations();

  const [formState, setFormState] = useState({
    title: "",
    excerpt: "",
    content: "",
    authorName: "",
    isPublished: true,
    metaTitle: "",
    metaDesc: "",
    metaKeywords: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (blog && blogId) {
      setFormState({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        authorName: blog.authorName || "",
        isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
        metaTitle: blog.metaTitle || "",
        metaDesc: blog.metaDesc || "",
        metaKeywords: blog.metaKeywords || "",
      });
    }
  }, [blog, blogId]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    //  Những trường bắt buộc (luôn gửi)
    formData.append("title", formState.title);
    formData.append("content", formState.content);
    formData.append("isPublished", formState.isPublished ? "true" : "false");

    // 2Những trường Tùy chọn (CHỈ GỬI NẾU CÓ CHỮ, bỏ qua nếu chuỗi rỗng "")
    if (formState.excerpt.trim()) formData.append("excerpt", formState.excerpt);
    if (formState.authorName.trim())
      formData.append("authorName", formState.authorName);

    if (formState.metaTitle.trim())
      formData.append("metaTitle", formState.metaTitle);
    if (formState.metaDesc.trim())
      formData.append("metaDesc", formState.metaDesc);
    if (formState.metaKeywords.trim())
      formData.append("metaKeywords", formState.metaKeywords);

    // 3Đính kèm danh sách ảnh
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      if (blogId) {
        await updateBlog(blogId, formData);
        alert("Cập nhật bài viết thành công!");
      } else {
        await createBlog(formData);
        alert("Thêm bài viết thành công!");
      }
      onSuccess();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };
  if (isFetching && blogId) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Đang tải dữ liệu bài viết...
      </div>
    );
  }

  return (
    <div className="bf-wrapper">
      <h2 className="bf-title">
        {blogId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
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

      <form onSubmit={handleSubmit} className="bf-form">
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          1. Thông tin chung
        </h3>

        <div className="bf-row">
          <div className="bf-group" style={{ flex: 2 }}>
            <label>Tiêu đề bài viết *</label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="bf-group" style={{ flex: 1 }}>
            <label>Tác giả</label>
            <input
              type="text"
              name="authorName"
              value={formState.authorName}
              onChange={handleChange}
              placeholder="VD: Admin"
            />
          </div>
        </div>

        <div className="bf-group">
          <label>Mô tả ngắn (Excerpt)</label>
          <textarea
            name="excerpt"
            value={formState.excerpt}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="bf-group">
          <label>Nội dung chi tiết (Content) *</label>
          <textarea
            name="content"
            value={formState.content}
            onChange={handleChange}
            rows={10}
            required
          />
        </div>

        <div className="bf-group bf-checkbox-group">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formState.isPublished}
            onChange={handleChange}
          />
          <label htmlFor="isPublished">Xuất bản bài viết (Hiển thị ngay)</label>
        </div>

        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
            marginTop: "10px",
          }}
        >
          2. Tối ưu SEO
        </h3>

        <div className="bf-group">
          <label>Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formState.metaTitle}
            onChange={handleChange}
          />
        </div>

        <div className="bf-row">
          <div className="bf-group">
            <label>Meta Description</label>
            <input
              type="text"
              name="metaDesc"
              value={formState.metaDesc}
              onChange={handleChange}
            />
          </div>
          <div className="bf-group">
            <label>Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formState.metaKeywords}
              onChange={handleChange}
              placeholder="VD: blog, tin tức"
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
          3. Ảnh bìa
        </h3>
        <div className="bf-group">
          <label>Tải lên ảnh bìa mới</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="bf-file-input"
          />
          <div className="bf-image-preview-container">
            {previewUrls.length > 0
              ? previewUrls.map((url, index) => (
                  <div
                    key={`preview-${index}`}
                    className="bf-image-preview-wrapper"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="bf-image-preview"
                    />
                  </div>
                ))
              : blogId &&
                blog?.images &&
                blog.images.length > 0 &&
                blog.images.map((img, index) => (
                  <div
                    key={`old-${index}`}
                    className="bf-image-preview-wrapper"
                  >
                    <img
                      src={getFullImageUrl(img)}
                      alt={`Current ${index}`}
                      className="bf-image-preview"
                    />
                  </div>
                ))}
          </div>

          {blogId && previewUrls.length === 0 && (
            <p className="bf-hint">
              Đây là ảnh hiện tại. Chọn file mới nếu bạn muốn thay thế ảnh này.
            </p>
          )}
        </div>

        <div className="bf-actions">
          <button
            type="button"
            className="bf-btn bf-btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bf-btn bf-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
