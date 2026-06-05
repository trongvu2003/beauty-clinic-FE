import axiosInstance from "./axios";
import type { Category } from "../types/product.types";

export const categoryApi = {
  getCategories: async (
    query?: any
  ): Promise<{ success: boolean; data: Category[] }> => {
    const response = await axiosInstance.get("/categories", { params: query });
    return response.data;
  },

  getCategoryById: async (
    id: string
  ): Promise<{ success: boolean; data: Category }> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (
    formData: FormData
  ): Promise<{ success: boolean; data: Category }> => {
    const response = await axiosInstance.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateCategory: async (
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; data: Category }> => {
    const response = await axiosInstance.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteCategory: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};
