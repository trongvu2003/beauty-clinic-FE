import "./FeaturedBlogs.css";
import { useBlogs } from "../../hooks/useBlogs";
import type { Blog } from "../../types/blog.types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import defaultBlogImg from "../../assets/images/default.avif";
import { useBeautyNews } from "../../hooks/useBeautyNews";

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

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SkeletonBlogCard = ({ index }: { index: number }) => (
  <div className="timeline-row">
    <div className="timeline-indicator">
      <div className="timeline-line" />
      <div className="timeline-number-wrapper">
        <span className="timeline-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
    <div className="skeleton-card">
      <div className="skeleton-shimmer" />
    </div>
  </div>
);

const FeaturedBlogs = () => {
  const {
    blogs,
    loading: blogsLoading,
    error: blogsError,
  } = useBlogs({ limit: 5, isPublished: true });

  const {
    news,
    loading: newsLoading,
    error: newsError,
    fetch: fetchNews,
  } = useBeautyNews();

  const [tab, setTab] = useState<"admin" | "news">("admin");

  useEffect(() => {
    if (tab === "news") fetchNews();
  }, [tab, fetchNews]);

  const isLoading = tab === "admin" ? blogsLoading : newsLoading;
  const error = tab === "admin" ? blogsError : newsError;

  return (
    <section className="featured-blogs" id="blog">
      <div className="featured-blogs__inner">
        <div className="featured-blogs__left">
          <span className="featured__tag">Kiến thức làm đẹp</span>
          <h2 className="featured__title">
            Tạp Chí <span className="gold">Sắc Đẹp</span>
          </h2>
          <div className="featured__divider" />
          <p className="featured__subtitle">
            Mỗi hành trình đẹp bắt đầu từ một hoài bão. KT Beauty Medical Centre
            không chỉ là nơi thực hiện các liệu trình thẩm mỹ, mà còn là hành
            trình khám phá bản thân — nơi mỗi khách hàng bước vào với kỳ vọng và
            bước ra với một phiên bản hoàn thiện hơn của chính mình.
          </p>

          {/* Tabs */}
          <div className="blog-tabs">
            <button
              className={`blog-tab ${
                tab === "admin" ? "blog-tab--active" : ""
              }`}
              onClick={() => setTab("admin")}
            >
              Bài viết của chúng tôi
            </button>
            <button
              className={`blog-tab ${tab === "news" ? "blog-tab--active" : ""}`}
              onClick={() => setTab("news")}
            >
              Tin tức làm đẹp
            </button>
          </div>

          {tab === "admin" && (
            <Link to="/blog" className="btn--outline">
              Xem tất cả bài viết <ArrowRight />
            </Link>
          )}
        </div>
        <div className="featured-blogs__right">
          {error && <div className="featured-blogs__error">⚠ {error}</div>}

          <div className="timeline-container">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBlogCard key={i} index={i} />
                ))
              : tab === "admin"
              ? blogs.map((blog: Blog, index: number) => (
                  <div className="timeline-row" key={blog.id}>
                    <div className="timeline-indicator">
                      <div className="timeline-line" />
                      <div className="timeline-number-wrapper">
                        <span className="timeline-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <div className="timeline-card">
                      <div className="timeline-card__meta">
                        {(blog as any).category && (
                          <span className="timeline-card__category">
                            {(blog as any).category}
                          </span>
                        )}
                        {(blog as any).publishedAt && (
                          <span className="timeline-card__date">
                            {formatDate((blog as any).publishedAt)}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="timeline-card__title-link"
                      >
                        <h3 className="timeline-card__title">{blog.title}</h3>
                      </Link>
                      {blog.excerpt && (
                        <p className="timeline-card__desc">{blog.excerpt}</p>
                      )}
                      <Link
                        to={`/blog/${blog.id}`}
                        className="timeline-card__img-wrap"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <img
                          src={getBlogImage(blog)}
                          alt={blog.title}
                          loading="lazy"
                          className="timeline-card__img"
                        />
                      </Link>
                      <div className="timeline-card__footer">
                        <Link
                          to={`/blog/${blog.id}`}
                          className="timeline-card__read-more"
                        >
                          Đọc tiếp <ArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : news.map((item, index) => (
                  <div className="timeline-row" key={item.id || item.url}>
                    <div className="timeline-indicator">
                      <div className="timeline-line" />
                      <div className="timeline-number-wrapper">
                        <span className="timeline-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <div className="timeline-card">
                      <div className="timeline-card__meta">
                        <span className="timeline-card__category">
                          {item.source}
                        </span>
                        {item.publishedAt && (
                          <span className="timeline-card__date">
                            {formatDate(item.publishedAt)}
                          </span>
                        )}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="timeline-card__title-link"
                      >
                        <h3 className="timeline-card__title">{item.title}</h3>
                      </a>
                      <p className="timeline-card__desc">{item.excerpt}</p>
                      {item.imageUrl && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="timeline-card__img-wrap"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            loading="lazy"
                            className="timeline-card__img"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </a>
                      )}
                      <div className="timeline-card__footer">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="timeline-card__read-more"
                        >
                          Đọc tiếp <ArrowRight />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
