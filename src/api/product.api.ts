import type { ProductQuery, ProductResponse } from "../types/product.types";
import axiosInstance from "./axios";
import type { Product } from "../types/product.types";
interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

export const productApi = {
  getProducts: async (query?: ProductQuery): Promise<ProductResponse> => {
    const response = await axiosInstance.get<ProductResponse>("/products", {
      params: query,
    });

    return response.data;
  },

  getProductById: async (id: string): Promise<ProductDetailResponse> => {
    try {
      const response = await axiosInstance.get<ProductDetailResponse>(
        `/products/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Sản phẩm không tồn tại.");
      }
      throw new Error(
        "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau."
      );
    }
  },

  getProductBySlug: async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/products/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404)
        throw new Error("Sản phẩm không tồn tại.");
      throw new Error("Không thể tải sản phẩm.");
    }
  },
  createProduct: async (productData: FormData) => {
    const response = await axiosInstance.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ghi đè JSON thành Form-Data
      },
    });

    return response.data;
  },

  updateProduct: async (id: string, productData: FormData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ghi đè JSON thành Form-Data
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};
