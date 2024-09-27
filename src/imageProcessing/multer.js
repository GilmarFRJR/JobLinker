import multer from "multer";
import path from "path";
import sharp from "sharp";
import { unlink } from "fs/promises";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/imgTmp");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const nameFile = path.basename(file.originalname, fileExtension);

    cb(null, nameFile + Date.now() + ".jpg");
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Multer"), false);
  }
};

export const resize = async (img) => {
  await sharp(img.path)
    .resize(300, 300)
    .toFormat("jpg")
    .toFile(`imgDB/${img.filename}`);

  await unlink(img.path);
};

export const upload = multer({
  storage,
  fileFilter,
});
