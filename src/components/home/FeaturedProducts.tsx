import "./FeaturedProducts.css";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/product.types";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
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

const formatPrice = (price: number): string =>
  `₫${price.toLocaleString("vi-VN")}`;

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" />
  </div>
);

const FeaturedProducts = () => {
  const { products, loading, error } = useProducts({
    limit: 4,
    isFeatured: true,
  });

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

      <div className="featured__grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product) => (
              <Link
                to={`/products/${product.id}`}
                className="product-card-link"
                key={product.id}
              >
                <div className="product-card">
                  <div className="product-card__img-wrap">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="product-card__img"
                      loading="lazy"
                    />
                    {product.salePrice && product.salePrice < product.price ? (
                      <span className="product-card__badge product-card__badge--sale">
                        Sale
                      </span>
                    ) : product.isFeatured ? (
                      <span className="product-card__badge">Nổi bật</span>
                    ) : null}
                  </div>

                  <div className="product-card__body">
                    <h3 className="product-card__name">{product.name}</h3>
                    <span
                      className={`product-card__stock ${
                        product.stock > 0 ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>

                    <div className="product-card__divider" />

                    <div className="product-card__footer">
                      <div className="product-card__price-block">
                        {product.salePrice &&
                        product.salePrice < product.price ? (
                          <>
                            <span className="product-card__price">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span
                              className="product-card__price-old"
                              style={{
                                textDecoration: "line-through",
                                fontSize: "0.85em",
                                color: "#888",
                                marginLeft: "8px",
                              }}
                            >
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="product-card__price">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <span className="product-card__reserve">
                        <ShoppingBag size={18} /> Mua ngay
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
