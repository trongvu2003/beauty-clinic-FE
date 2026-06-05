import axiosInstance from "./axios";
import type { Brand } from "../types/product.types";

export const brandApi = {
  getBrands: async (
    query?: any
  ): Promise<{ success: boolean; data: Brand[] }> => {
    const response = await axiosInstance.get("/brands", { params: query });
    return response.data;
  },

  getBrandById: async (
    id: string
  ): Promise<{ success: boolean; data: Brand }> => {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data;
  },

  createBrand: async (
    formData: FormData
  ): Promise<{ success: boolean; data: Brand }> => {
    const response = await axiosInstance.post("/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateBrand: async (
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; data: Brand }> => {
    const response = await axiosInstance.put(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  deleteBrand: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response.data;
  },
};
