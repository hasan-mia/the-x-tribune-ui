import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

// Hook for fetching all active blogs with filters
export function useGeActiveBlogs(
  enabled = true,
  filters?: {
    page?: number;
    limit?: number;
    category_id?: string;
    author_id?: string;
    is_featured?: boolean;
    tag_id?: string;
    search?: string;
  }
) {
  const queryParams = new URLSearchParams();

  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());
  if (filters?.category_id) queryParams.append('category_id', filters.category_id);
  if (filters?.author_id) queryParams.append('author_id', filters.author_id);
  if (filters?.is_featured !== undefined) queryParams.append('is_featured', filters.is_featured.toString());
  if (filters?.tag_id) queryParams.append('tag_id', filters.tag_id);
  if (filters?.search) queryParams.append('search', filters.search);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["public-blogs", filters],
    queryFn: async () => {
      const url = queryString ? `/blogs?${queryString}` : '/blogs';
      const response = await http.get(url);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to Load Data");
      }

      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching a single blog by slug
export function useGetSingleBlog(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["single-blog", slug],
    queryFn: async () => {
      const response = await http.get(`/blogs/slug/${slug}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to Load Blog");
      }

      return response.data;
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching related blog
export function useGetRelateBlogs(blogId: string, enabled = true) {
  return useQuery({
    queryKey: ["related-blogs", blogId],
    queryFn: async () => {
      const response = await http.get(`/blogs/${blogId}/related`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to Load Blog");
      }

      return response.data;
    },
    enabled: enabled && !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching related blog
export function useGetPopularBlogs(enabled = true) {
  return useQuery({
    queryKey: ["popular-blogs"],
    queryFn: async () => {
      const response = await http.get(`/blogs/popular`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to Load Blog");
      }

      return response.data;
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
