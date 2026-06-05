import React, { useState } from "react";
import { useBlogs, useBlogMutations } from "../../../hooks/useBlogs";
import type { Blog, BlogQuery } from "../../../types/blog.types";
import BlogForm from "../../../components/Admin/form/BlogForm";
import "./BlogManagement.css";

const defaultImg = "../../../assets/images/default.avif";

const getBlogImage = (blog: Blog): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  let imgPath = blog.images && blog.images.length > 0 ? blog.images[0] : "";

  if (!imgPath) return defaultImg;
  if (imgPath.startsWith("http")) return imgPath;

  imgPath = imgPath.replace(/\\/g, "/");
  return imgPath.startsWith("/")
    ? `${backendUrl}${imgPath}`
    : `${backendUrl}/${imgPath}`;
};

const BlogManagement: React.FC = () => {
  const [query, setQuery] = useState<BlogQuery>({ page: 1, limit: 10 });
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    blogs,
    loading: isFetching,
    error: fetchError,
    refetch,
  } = useBlogs(query);
  const { deleteBlog, loading: isDeleting } = useBlogMutations();

  const handleDelete = async (id: string, title: string) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa bài viết "${title}" không? Hành động này không thể hoàn tác.`
      )
    ) {
      try {
        await deleteBlog(id);
        alert("Xóa bài viết thành công!");
        refetch();
      } catch (error: any) {
        alert(error.message || "Xóa thất bại!");
      }
    }
  };

  return (
    <div className="bm-container">
      {currentView === "form" ? (
        <BlogForm
          blogId={editingId}
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
            <h1 className="bm-title">Quản lý bài viết</h1>
            <button
              className="bm-btn bm-btn-add"
              onClick={() => {
                setEditingId(null);
                setCurrentView("form");
              }}
            >
              + Viết bài mới
            </button>
          </div>

          {fetchError && <div className="bm-alert-error">⚠️ {fetchError}</div>}

          <div className="bm-table-wrapper">
            <table className="bm-table">
              <thead>
                <tr>
                  <th>Bài viết</th>
                  <th>Mô tả ngắn</th>
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
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="bm-empty-state">
                      Chưa có bài viết nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div className="bm-blog-info">
                          <img
                            className="bm-blog-img"
                            src={getBlogImage(blog)}
                            alt={blog.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultImg;
                            }}
                          />
                          <div>
                            <div className="bm-blog-title">{blog.title}</div>
                            <div className="bm-blog-id">Mã: {blog.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: "300px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          {blog.excerpt || "Không có mô tả"}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`bm-badge ${
                            blog.isPublished
                              ? "bm-badge-published"
                              : "bm-badge-draft"
                          }`}
                        >
                          {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </td>

                      <td>
                        <div className="bm-actions">
                          <button
                            className="bm-action-btn bm-btn-edit"
                            onClick={() => {
                              setEditingId(blog.id);
                              setCurrentView("form");
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="bm-action-btn bm-btn-delete"
                            onClick={() => handleDelete(blog.id, blog.title)}
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

export default BlogManagement;
