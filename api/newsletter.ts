import { http } from '../config/http';
import { useMutation } from "@tanstack/react-query";

/**
 * Create newsletter by user
 */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (data) => {

      const response = await http.post("/newsletter/subscribe", data)

      if (!response?.data) {
        throw new Error("Failed to subscribe")
      }
      return response.data
    },
    onError: (error: any) => {
      console.error("Subscribe creation error:", error)
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to subscribe"
      )
    },
  })
}
