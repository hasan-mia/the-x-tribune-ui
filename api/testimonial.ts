import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

export function useGetActiveTestimonials(enabled = true) {
  return useQuery({
    queryKey: ["active_testimonials"],
    queryFn: async () => {
      const response = await http.get(`/testimonials?isActive=true&limit=20`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch testimonials");
      }

      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}