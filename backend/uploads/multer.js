import multer from "multer";
import path from "path"; //

const __dirname = path.resolve();

// Where to store uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./portfolio")); // Make sure this folder exists! same level as myapp
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const { username } = req.query;
    //cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    cb(null, (username || file.fieldname + "-" + uniqueSuffix) + ext);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files allowed!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Where to store uploaded files
const doc_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./doctor")); // Make sure this folder exists! same level as myapp
  },
  filename: function (req, file, cb) {
    console.log("inside fileName");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const { name } = req.query;
    console.log(name);
    //cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    cb(null, (name || file.fieldname + "-" + uniqueSuffix) + ext);
  },
});

export const upload_doc = multer({
  storage: doc_storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files allowed!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
