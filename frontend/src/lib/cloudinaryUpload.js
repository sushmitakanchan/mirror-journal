import { endpoints } from "@/lib/apiEndpoints";

export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024;

export const validateImageFile = (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded");
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new Error(`File size exceeds maximum allowed (${MAX_IMAGE_UPLOAD_SIZE / (1024 * 1024)}MB)`);
  }

  return file;
};

const requestUploadSignature = async ({ getToken, intent }) => {
  const token = await getToken({ skipCache: true });
  const response = await fetch(endpoints.signImageUpload, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ intent }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Failed to prepare image upload");
  }

  return payload;
};

export const uploadImageToCloudinary = async ({
  abortSignal,
  file,
  getToken,
  intent = "entry-image",
  onProgress,
}) => {
  validateImageFile(file);

  const signedParams = await requestUploadSignature({ getToken, intent });
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || signedParams.cloudName;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name is missing");
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signedParams.apiKey);
    formData.append("timestamp", String(signedParams.timestamp));
    formData.append("signature", signedParams.signature);
    formData.append("folder", signedParams.folder);
    formData.append("public_id", signedParams.publicId);

    const abortUpload = () => {
      xhr.abort();
      reject(new Error("Upload cancelled"));
    };

    if (abortSignal) {
      if (abortSignal.aborted) {
        reject(new Error("Upload cancelled"));
        return;
      }

      abortSignal.addEventListener("abort", abortUpload, { once: true });
    }

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.({ progress: Math.round((event.loaded / event.total) * 100) });
    };

    xhr.onerror = () => {
      reject(new Error("Image upload failed"));
    };

    xhr.onabort = () => {
      reject(new Error("Upload cancelled"));
    };

    xhr.onload = () => {
      if (abortSignal) {
        abortSignal.removeEventListener("abort", abortUpload);
      }

      try {
        const result = JSON.parse(xhr.responseText);

        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(result.error?.message || "Image upload failed"));
          return;
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          url: result.url,
        });
      } catch (error) {
        reject(new Error("Invalid upload response"));
      }
    };

    xhr.send(formData);
  });
};
