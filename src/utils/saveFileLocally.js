import { TEMP_UPLOADS_DIR, UPLOADS_DIR } from '../constants/path.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const saveFileLocally = async (file) => {
  const oldPath = path.join(TEMP_UPLOADS_DIR, file.filename);
  const newPath = path.join(UPLOADS_DIR, file.filename);
  await fs.rename(oldPath, newPath);
  return `/uploads/${file.filename}`;
};

export default saveFileLocally;
