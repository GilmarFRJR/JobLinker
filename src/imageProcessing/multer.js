import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./img");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + Date.now() + ".jpg");
  },
});

// const fileFilter = (req, file, cb) => {};

export const upload = multer({
  storage,
  //   fileFilter,
});
