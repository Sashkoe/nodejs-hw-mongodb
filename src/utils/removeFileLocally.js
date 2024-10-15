import createHttpError from 'http-errors';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const removeFileLocally = async (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    throw createHttpError(500, 'Failed to remove the photo of the contact');
  }
};

export default removeFileLocally;
