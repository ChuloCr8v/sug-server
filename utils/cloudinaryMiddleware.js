import { v2 as cloudinary } from "cloudinary";

// const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
// const api_key = process.env.CLOUDINARY_API_KEY;
// const api_secret = process.env.CLOUDINARY_API_SECRET;

export const cloudinaryProps = cloudinary.config({
  cloud_name: "dzcave05f",
  api_key: "378393764147723",
  api_secret: "VxPXXTavZ7HXX-mO4F45ttUpL5U",
});

const cloudinaryMiddleware = async (file, fileName, folder) => {
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
    use_filename: true,
    unique_filename: false,
    public_id: fileName,
    folder: folder,
  };

  try {
    const result = await cloudinary.uploader.upload(file, opts);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default cloudinaryMiddleware;
