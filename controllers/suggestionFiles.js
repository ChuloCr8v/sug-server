import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFiles = (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Files uploaded successfully", files: req.files });
  } catch (error) {
    res.status(400).json({
      message: "Failed to upload files",
      error: error.message,
      files: req.files,
    });
  }
};

export const deleteFiles = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../suggestionFiles", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Failed to delete file", error: err.message });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
};
