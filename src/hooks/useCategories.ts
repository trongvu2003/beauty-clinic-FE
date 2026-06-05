import { useState, useEffect, useCallback } from "react";
import { categoryApi } from "../api/category.api";
import type { Category } from "../types/product.types";

export const useCategories = (query?: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryApi.getCategories(query);
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi tải danh sách danh mục"
      );
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

export const useCategory = (id: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await categoryApi.getCategoryById(id);
        if (result.success) {
          setCategory(result.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Lỗi tải chi tiết danh mục"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
};

export const useCategoryMutations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      return await categoryApi.createCategory(formData);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi khi thêm danh mục";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      return await categoryApi.updateCategory(id, formData);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi cập nhật danh mục";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await categoryApi.deleteCategory(id);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi khi xóa danh mục";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, updateCategory, deleteCategory, loading, error };
};
