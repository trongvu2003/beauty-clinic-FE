import type {
  BlogQuery,
  BlogResponse,
  BlogDetailResponse,
} from "../types/blog.types";
import axiosInstance from "./axios";

export const blogApi = {
  getBlogs: async (query?: BlogQuery): Promise<BlogResponse> => {
    const response = await axiosInstance.get<BlogResponse>("/blogs", {
      params: query,
    });

    return response.data;
  },

  getBlogById: async (id: string): Promise<BlogDetailResponse> => {
    try {
      const response = await axiosInstance.get<BlogDetailResponse>(
        `/blogs/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Bài viết không tồn tại.");
      }
      throw new Error("Không thể tải bài viết.");
    }
  },
  getBlogBySlug: async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/blogs/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Bài viết không tồn tại.");
      }
      throw new Error("Không thể tải bài viết.");
    }
  },

  createBlog: async (formData: FormData) => {
    const response = await axiosInstance.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ghi đè JSON thành Form-Data
      },
    });
    return response.data;
  },

  updateBlog: async (id: string, formData: FormData) => {
    const response = await axiosInstance.put(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ghi đè JSON thành Form-Data
      },
    });
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  },
};
