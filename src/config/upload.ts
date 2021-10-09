import path from 'node:path';
import multer from 'multer';
import * as crypto from 'crypto';

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export const uploadConfig = {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');

      const filename = `${fileHash}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};
