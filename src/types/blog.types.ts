export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  images: string[];
  isPublished: boolean;
  publishedAt?: string | null;
  authorName?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeywords?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogQuery {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  search?: string;
}

export interface BlogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogResponse {
  success: boolean;
  data: Blog[];
  meta: BlogMeta;
}

export interface BlogDetailResponse {
  success: boolean;
  data: Blog;
}
