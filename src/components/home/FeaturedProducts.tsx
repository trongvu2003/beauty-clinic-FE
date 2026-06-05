import "./FeaturedProducts.css";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/product.types";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import defaultImg from "../../assets/images/default.avif";

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

const SkeletonImg = () => (
  <div className="carousel__skeleton">
    <div className="skeleton-shimmer" />
  </div>
);

const SPEED = 0.4;

const FeaturedProducts = () => {
  const { products, loading, error } = useProducts({
    limit: 8,
    isFeatured: true,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const setWidthRef = useRef<number>(0);

  useEffect(() => {
    if (loading || products.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    cancelAnimationFrame(rafRef.current);

    const measure = () => {
      setWidthRef.current = track.scrollWidth / 3;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const tick = () => {
      if (!pausedRef.current && setWidthRef.current > 0) {
        posRef.current += SPEED;
        if (posRef.current >= setWidthRef.current) {
          posRef.current -= setWidthRef.current;
        }
        track.style.transform = `translateX(${-posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [loading, products]);

  return (
    <section className="featured" id="products">
      <div className="featured__header">
        <span className="featured__tag">MỸ PHẨM ĐỘC QUYỀN</span>
        <h2 className="featured__title">
          Dược Mỹ Phẩm <span className="gold">Cao Cấp</span>
        </h2>
        <p className="featured__subtitle">
          Khám phá bộ sưu tập sản phẩm chăm sóc da được các chuyên gia da liễu
          khuyên dùng, mang lại hiệu quả trị liệu và nuôi dưỡng vượt trội.
        </p>
      </div>

      {error && (
        <div className="featured__error">
          <span>⚠ {error}</span>
        </div>
      )}

      <div
        className="carousel__viewport"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div className="carousel__track" ref={trackRef}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonImg key={i} />)
            : [...products, ...products, ...products].map((product, i) => (
                <Link
                  key={`${product.id}-${i}`}
                  to={`/products/${product.id}`}
                  className="carousel__img-link"
                  draggable={false}
                  aria-label={product.name}
                >
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="carousel__img"
                    loading="lazy"
                    draggable={false}
                  />
                </Link>
              ))}
        </div>
      </div>

      <div className="featured__actions">
        <Link to="/products" className="featured__view-all">
          Xem tất cả sản phẩm
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
