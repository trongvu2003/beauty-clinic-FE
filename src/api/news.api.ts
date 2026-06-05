import type { NewsResponse } from "../types/news.types";

export const getBeautyNewsApi = async (): Promise<NewsResponse> => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const res = await window.fetch(`${backendUrl}/api/news`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Không thể kết nối tới máy chủ.");
  }

  return await res.json();
};
