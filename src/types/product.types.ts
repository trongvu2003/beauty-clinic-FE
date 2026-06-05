export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  content?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  images: string[];
  ingredients?: string | null;
  howToUse?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeywords?: string | null;
  categoryId: string;
  brandId?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  brand?: Brand;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
  search?: string;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  meta: ProductMeta;
}
