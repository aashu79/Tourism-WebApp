import { v2 as cloudinary } from "cloudinary";
const imageUpload = async (imageFile: Express.Multer.File) => {
  try {
    if (imageFile) {
      const b64 = Buffer.from(imageFile.buffer).toString("base64");
      const dataUri = `data:${imageFile.mimetype};base64,${b64}`;
      const res = await cloudinary.uploader.upload(dataUri);
      return res.url;
    }
  } catch (error) {
    throw error;
  }
};

export default imageUpload;
