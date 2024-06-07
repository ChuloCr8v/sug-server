import multer from "multer";
import cloudiaryMiddeware from "./cloudinaryMiddleware.js";

// Set up storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("files");

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handler = async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const fileName = req.file.originalname;
    const cldRes = await cloudiaryMiddeware(
      dataURI,
      fileName,
      "suggestion_attachments"
    );
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
export default handler;
