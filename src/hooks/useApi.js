import { useMemo } from "react";
import api from "../services/api";

export const useApi = () => {
  return useMemo(
    () => ({
      get: api.get,
      post: api.post,
      put: api.put,
      patch: api.patch,
      delete: api.delete,
      upload: (url, formData, onUploadProgress) => {
        return api.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        });
      },
      download: (url) => {
        return api.get(url, {
          responseType: "blob",
        });
      },
    }),
    []
  );
};
