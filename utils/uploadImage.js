import cloudinary from "cloudinary";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: "dzcave05f",
  api_key: "378393764147723",
  api_secret: "VxPXXTavZ7HXX-mO4F45ttUpL5U",
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image, opts);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default uploadImage;
