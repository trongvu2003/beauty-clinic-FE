import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useProduct, useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/product.types";
import defaultImg from "../../assets/images/default.avif";
import "./ProductDetail.css";

const getProductImage = (product: Product, index = 0): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  let imgPath =
    product.images && product.images.length > index
      ? product.images[index]
      : product.imageUrl || "";
  if (!imgPath) return defaultImg;
  if (imgPath.startsWith("http")) return imgPath;
  imgPath = imgPath.replace(/\\/g, "/");
  return imgPath.startsWith("/")
    ? `${backendUrl}${imgPath}`
    : `${backendUrl}/${imgPath}`;
};

const formatPrice = (price: number): string =>
  `₫${price.toLocaleString("vi-VN")}`;

const calcDiscount = (price: number, salePrice: number): number =>
  Math.round(((price - salePrice) / price) * 100);

const ProductDetailSkeleton = () => (
  <div className="pd-skeleton">
    <div className="pd-skeleton__img" />
    <div className="pd-skeleton__info">
      <div className="sk-line sk-line--tag" />
      <div className="sk-line sk-line--title" />
      <div className="sk-line sk-line--title sk-line--short" />
      <div className="sk-line sk-line--price" />
      <div className="sk-line sk-line--body" />
      <div className="sk-line sk-line--body" />
      <div className="sk-line sk-line--body sk-line--short" />
      <div className="sk-line sk-line--btn" />
    </div>
  </div>
);

const RelatedCard = ({ product }: { product: Product }) => (
  <Link to={`/products/${product.id}`} className="related-card">
    <div className="related-card__img-wrap">
      <img
        src={getProductImage(product)}
        alt={product.name}
        className="related-card__img"
        loading="lazy"
      />
      {product.salePrice && product.salePrice < product.price && (
        <span className="related-card__badge">
          -{calcDiscount(product.price, product.salePrice)}%
        </span>
      )}
    </div>
    <div className="related-card__body">
      <p className="related-card__name">{product.name}</p>
      <div className="related-card__prices">
        {product.salePrice && product.salePrice < product.price ? (
          <>
            <span className="related-card__sale">
              {formatPrice(product.salePrice)}
            </span>
            <span className="related-card__original">
              {formatPrice(product.price)}
            </span>
          </>
        ) : (
          <span className="related-card__sale">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
    </div>
  </Link>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id ?? "");
  const { products: related } = useProducts({ limit: 8, isFeatured: true });

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "how" | "ingredients">(
    "desc"
  );

  const relatedList = related.filter((p) => p.id !== id).slice(0, 4);

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.imageUrl
      ? [product.imageUrl]
      : [];

  const hasSale = !!product?.salePrice && product.salePrice < product.price;

  if (product?.metaTitle) document.title = product.metaTitle;

  return (
    <main className="pd-page">
      <div className="pd-breadcrumb">
        <button className="pd-back" onClick={() => navigate("/")}>
          <ChevronLeft size={16} />
          Trang chủ
        </button>
        {product && (
          <>
            <span className="pd-breadcrumb__sep">/</span>
            <span className="pd-breadcrumb__current">{product.name}</span>
          </>
        )}
      </div>

      {loading && <ProductDetailSkeleton />}

      {error && !loading && (
        <div className="pd-error">
          <span>⚠</span>
          <p>{error}</p>
          <Link to="/" className="pd-btn pd-btn--outline">
            Quay lại trang chủ
          </Link>
        </div>
      )}

      {product && !loading && (
        <>
          <div className="pd-main">
            <div className="pd-gallery">
              <div className="pd-gallery__main">
                <img
                  src={
                    images.length > 0
                      ? (() => {
                          const backendUrl = import.meta.env.VITE_BACKEND_URL;
                          let p = images[activeImg];
                          if (!p) return defaultImg;
                          if (p.startsWith("http")) return p;
                          p = p.replace(/\\/g, "/");
                          return p.startsWith("/")
                            ? `${backendUrl}${p}`
                            : `${backendUrl}/${p}`;
                        })()
                      : defaultImg
                  }
                  alt={product.name}
                  className="pd-gallery__img"
                />
                {hasSale && (
                  <span className="pd-gallery__discount">
                    -{calcDiscount(product.price, product.salePrice!)}%
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="pd-gallery__thumbs">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`pd-gallery__thumb${
                        i === activeImg ? " active" : ""
                      }`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img
                        src={getProductImage(product, i)}
                        alt={`${product.name} ${i + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pd-info">
              <div className="pd-info__tags">
                {product.brand && (
                  <span className="pd-tag pd-tag--brand">
                    {product.brand.name}
                  </span>
                )}
                {product.category && (
                  <span className="pd-tag pd-tag--cat">
                    {product.category.name}
                  </span>
                )}
              </div>

              <h1 className="pd-info__title">{product.name}</h1>

              {product.sku && (
                <p className="pd-info__sku">SKU: {product.sku}</p>
              )}
              <div className="pd-info__price-block">
                {hasSale ? (
                  <>
                    <span className="pd-price pd-price--sale">
                      {formatPrice(product.salePrice!)}
                    </span>
                    <span className="pd-price pd-price--original">
                      {formatPrice(product.price)}
                    </span>
                    <span className="pd-price__save">
                      Tiết kiệm{" "}
                      {formatPrice(product.price - product.salePrice!)}
                    </span>
                  </>
                ) : (
                  <span className="pd-price pd-price--sale">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <div className="pd-info__stock">
                <span
                  className={`pd-stock ${
                    product.stock > 0 ? "pd-stock--in" : "pd-stock--out"
                  }`}
                >
                  {product.stock > 0
                    ? `● Còn hàng (${product.stock})`
                    : "● Hết hàng"}
                </span>
              </div>

              <div className="pd-info__divider" />
              {product.content && (
                <p className="pd-info__desc">{product.content}</p>
              )}
              <div className="pd-info__actions">
                <div className="pd-qty">
                  <button
                    className="pd-qty__btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="pd-qty__val">{qty}</span>
                  <button
                    className="pd-qty__btn"
                    onClick={() =>
                      setQty((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  className="pd-btn pd-btn--primary"
                  disabled={product.stock === 0}
                >
                  <ShoppingBag size={18} />
                  {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                </button>
              </div>
            </div>
          </div>
          <div className="pd-tabs">
            <div className="pd-tabs__nav">
              {[
                { key: "desc", label: "Mô tả sản phẩm" },
                { key: "how", label: "Hướng dẫn sử dụng" },
                { key: "ingredients", label: "Thành phần" },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`pd-tabs__btn${
                    activeTab === t.key ? " active" : ""
                  }`}
                  onClick={() => setActiveTab(t.key as any)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="pd-tabs__body">
              {activeTab === "desc" && (
                <div
                  className="pd-tabs__content"
                  dangerouslySetInnerHTML={{
                    __html: product.description || "<p>Chưa có mô tả.</p>",
                  }}
                />
              )}
              {activeTab === "how" && (
                <div
                  className="pd-tabs__content"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.howToUse || "<p>Chưa có hướng dẫn sử dụng.</p>",
                  }}
                />
              )}
              {activeTab === "ingredients" && (
                <div
                  className="pd-tabs__content"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.ingredients ||
                      "<p>Chưa có thông tin thành phần.</p>",
                  }}
                />
              )}
            </div>
          </div>
          {relatedList.length > 0 && (
            <div className="pd-related">
              <h2 className="pd-related__title">Sản phẩm liên quan</h2>
              <div className="pd-related__grid">
                {relatedList.map((p) => (
                  <RelatedCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ProductDetail;
