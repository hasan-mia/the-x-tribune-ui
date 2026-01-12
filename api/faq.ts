import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

export function useGetAllFaq(enabled = true) {
  return useQuery({
    queryKey: ["service-faq"],
    queryFn: async () => {
      const response = await http.get(`/faqs`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch heroes");
      }

      return response.data as any;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetServiceFaq(enabled = true) {
  return useQuery({
    queryKey: ["service-faq"],
    queryFn: async () => {
      const response = await http.get(`/faqs?category=services`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch heroes");
      }

      return response.data as any;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetPricingFaq(enabled = true) {
  return useQuery({
    queryKey: ["pricing-faq"],
    queryFn: async () => {
      const response = await http.get(`/faqs?category=pricing`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch heroes");
      }

      console.log(response)

      return response.data as any;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
