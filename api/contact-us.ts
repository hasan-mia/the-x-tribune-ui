import { http } from '../config/http';
import { useMutation } from "@tanstack/react-query";

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

interface ContactResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * Send contact message
 */
export function useCreateContactUs() {
  return useMutation<ContactResponse, Error, ContactFormData>({
    mutationFn: async (data: ContactFormData) => {
      const response = await http.post("/contact-us", data)

      if (!response?.data) {
        throw new Error("Failed to send message")
      }
      return response.data
    },
    onError: (error: any) => {
      console.error("Contact form error:", error)
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send message"
      )
    },
  })
}