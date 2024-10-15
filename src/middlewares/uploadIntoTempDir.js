import multer from 'multer';
import { TEMP_UPLOADS_DIR } from '../constants/path.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  //   destination: (req, file, callback) => {
  //     callback(null, TEMP_UPLOADS_DIR);
  //   },
  destination: TEMP_UPLOADS_DIR,
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniquePrefix}_${file.originalname}`;
    callback(null, fileName);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const fileExtension = file.originalname.split('.').pop();
  if (fileExtension === 'exe')
    return callback(createHttpError(400, 'This file type is not supported'));
  callback(null, true);
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
