import { http } from '../config/http';
import { useMutation } from "@tanstack/react-query";

export function useUploadFiles() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await http.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response?.data) {
        throw new Error("Failed to upload file");
      }

      return response.data;
    },

    onError: (error: any) => {
      console.error("file upload error:", error);
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload"
      );
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await http.post("/file/upload?source=true", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response?.data) {
        throw new Error("Failed to upload file");
      }

      return response.data;
    },

    onError: (error: any) => {
      console.error("file upload error:", error);
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload"
      );
    },
  });
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: async (fileUrl: string) => {
      const response = await http.delete(`/file/delete`, {
        params: {
          url: fileUrl
        }
      });

      if (!response?.data) {
        throw new Error("Failed to delete file");
      }

      return response.data;
    },

    onError: (error: any) => {
      console.error("file delete error:", error);
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete file"
      );
    },
  });
}
