import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

export function useGetWhyChoseUs(enabled = true) {
  return useQuery({
    queryKey: ["why-chose-us"],
    queryFn: async () => {
      const response = await http.get(`/why-chose-us`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load data");
      }

      return response.data as any;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
