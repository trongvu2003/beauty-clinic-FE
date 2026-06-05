import { useState, useEffect, useCallback } from "react";
import { productApi } from "../api/product.api";
import type { Product, ProductQuery } from "../types/product.types";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export const useProducts = (query?: ProductQuery): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productApi.getProducts(query);
      if (result.success && result.data) {
        const formattedProducts = result.data.map((item: any) => ({
          ...item,
          price: Number(item.price),
          salePrice: item.salePrice ? Number(item.salePrice) : null,
        }));
        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
      );
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useProduct = (id: string): UseProductResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await productApi.getProductById(id);
        if (result.success && result.data) {
          setProduct({
            ...result.data,
            price: Number(result.data.price),
            salePrice: result.data.salePrice
              ? Number(result.data.salePrice)
              : null,
          });
        } else {
          throw new Error("Dữ liệu không hợp lệ.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useProductBySlug = (slug: string): UseProductResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await productApi.getProductBySlug(slug);
        if (result.success && result.data) {
          setProduct({
            ...result.data,
            price: Number(result.data.price),
            salePrice: result.data.salePrice
              ? Number(result.data.salePrice)
              : null,
          });
        } else {
          throw new Error("Dữ liệu không hợp lệ.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};

export const useProductMutations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.createProduct(formData);
      return response;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi khi tạo sản phẩm";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.updateProduct(id, formData);
      return response;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi cập nhật sản phẩm";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.deleteProduct(id);
      return response;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi khi xóa sản phẩm";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
};
