import { useState, useEffect, useCallback } from "react";
import { brandApi } from "../api/brand.api";
import type { Brand } from "../types/product.types";

export const useBrands = (query?: any) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await brandApi.getBrands(query);
      if (result.success && result.data) {
        setBrands(result.data);
      } else {
        setBrands([]);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi tải danh sách thương hiệu"
      );
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, error, refetch: fetchBrands };
};

export const useBrand = (id: string) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBrand = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await brandApi.getBrandById(id);
        if (result.success) {
          setBrand(result.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Lỗi tải chi tiết thương hiệu"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  return { brand, loading, error };
};

export const useBrandMutations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      return await brandApi.createBrand(formData);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      return await brandApi.updateBrand(id, formData);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await brandApi.deleteBrand(id);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createBrand, updateBrand, deleteBrand, loading, error };
};
