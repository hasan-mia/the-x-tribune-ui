import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

export function useAllSettings(enabled = true) {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await http.get(`/settings`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to Load Service");
      }

      return response.data;
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetSettings(key: string, enabled = true) {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      const response = await http.get(`/settings/${key}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to Load Service");
      }

      return response.data;
    },
    enabled: enabled && !!key,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
