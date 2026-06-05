import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog, useBlogs } from "../../hooks/useBlogs";
import type { Blog } from "../../types/blog.types";
import defaultBlogImg from "../../assets/images/default.avif";
import "./BlogDetail.css";

const getBlogImage = (blog: Blog): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  let imgPath = blog.images && blog.images.length > 0 ? blog.images[0] : "";
  if (!imgPath) return defaultBlogImg;
  if (imgPath.startsWith("http")) return imgPath;
  imgPath = imgPath.replace(/\\/g, "/");
  return imgPath.startsWith("/")
    ? `${backendUrl}${imgPath}`
    : `${backendUrl}/${imgPath}`;
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-arrow-left">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const BlogDetailSkeleton = () => (
  <div className="blog-detail__skeleton">
    <div className="skeleton-line skeleton-line--tag" />
    <div className="skeleton-line skeleton-line--title" />
    <div className="skeleton-line skeleton-line--title skeleton-line--short" />
    <div className="skeleton-line skeleton-line--meta" />
    <div className="skeleton-img" />
    <div className="skeleton-line skeleton-line--body" />
    <div className="skeleton-line skeleton-line--body" />
    <div className="skeleton-line skeleton-line--body skeleton-line--short" />y
  </div>
);

const SidebarSkeleton = () => (
  <div className="sidebar__skeleton">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="sidebar-skeleton-item">
        <div className="skeleton-line skeleton-line--body" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    ))}
  </div>
);

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(id ?? "");
  const { blogs: relatedBlogs, loading: sidebarLoading } = useBlogs({
    limit: 6,
    isPublished: true,
  });

  if (blog?.metaTitle) {
    document.title = blog.metaTitle;
  }

  const otherBlogs = relatedBlogs.filter((b) => b.id !== id);

  return (
    <main className="blog-detail-page">
      <div className="blog-detail__layout">
        {/* ── Sidebar trái ── */}
        <aside className="blog-detail__sidebar">
          <div className="sidebar__header">
            <button
              className="blog-detail__back"
              onClick={() => navigate("/")}
              aria-label="Quay lại trang chủ"
            >
              <ArrowLeft />
              Trang chủ
            </button>
            <h2 className="sidebar__title">Bài viết khác</h2>
            <div className="sidebar__divider" />
          </div>

          {sidebarLoading ? (
            <SidebarSkeleton />
          ) : (
            <ul className="sidebar__list">
              {otherBlogs.map((b) => (
                <li
                  key={b.id}
                  className={`sidebar__item${
                    b.id === id ? " sidebar__item--active" : ""
                  }`}
                >
                  <Link to={`/blog/${b.id}`} className="sidebar__link">
                    <div className="sidebar__item-img-wrap">
                      <img
                        src={getBlogImage(b)}
                        alt={b.title}
                        className="sidebar__item-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="sidebar__item-body">
                      <p className="sidebar__item-title">{b.title}</p>
                      <span className="sidebar__item-date">
                        {formatDate(
                          (b as any).publishedAt ?? (b as any).createdAt
                        )}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* ── Nội dung chính ── */}
        <div className="blog-detail__main">
          {loading && <BlogDetailSkeleton />}

          {error && !loading && (
            <div className="blog-detail__error">
              <span>⚠</span>
              <p>{error}</p>
              <Link to="/" className="btn--outline">
                Quay lại trang chủ
              </Link>
            </div>
          )}

          {blog && !loading && (
            <article className="blog-detail__article">
              <div className="blog-detail__meta">
                {(blog as any).category && (
                  <span className="blog-detail__category">
                    {(blog as any).category}
                  </span>
                )}
                <span className="blog-detail__date">
                  {formatDate(
                    (blog as any).publishedAt ?? (blog as any).createdAt
                  )}
                </span>
                {(blog as any).authorName && (
                  <span className="blog-detail__author">
                    bởi <strong>{(blog as any).authorName}</strong>
                  </span>
                )}
              </div>

              <h1 className="blog-detail__title">{blog.title}</h1>

              {blog.excerpt && (
                <p className="blog-detail__excerpt">{blog.excerpt}</p>
              )}

              <div className="blog-detail__img-wrap">
                <img
                  src={getBlogImage(blog)}
                  alt={blog.title}
                  className="blog-detail__img"
                />
              </div>

              <div
                className="blog-detail__content"
                dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
              />
            </article>
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogDetail;
