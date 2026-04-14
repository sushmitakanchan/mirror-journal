import crypto from "crypto";

const buildCloudinarySignature = (params, apiSecret) => {
  const serializedParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serializedParams}${apiSecret}`)
    .digest("hex");
};

const sanitizeIntent = (value) => {
  if (typeof value !== "string") return "entry-image";
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
  return cleaned || "entry-image";
};

export const signImageUpload = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      CLOUDINARY_UPLOAD_FOLDER = "mirror-journal",
    } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Cloudinary is not configured" });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `${CLOUDINARY_UPLOAD_FOLDER}/${clerkUserId}`;
    const publicId = `${sanitizeIntent(req.body?.intent)}-${crypto.randomUUID()}`;

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };

    const signature = buildCloudinarySignature(paramsToSign, CLOUDINARY_API_SECRET);

    return res.status(200).json({
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder,
      publicId,
      signature,
      timestamp,
    });
  } catch (error) {
    console.error("Error signing Cloudinary upload", error);
    return res.status(500).json({ error: "Failed to sign image upload" });
  }
};
