import createHttpError from 'http-errors';
import cloudinary from './cloudinaryConfig.js';

const removeFileFromCloudinary = async (imageURL, folder) => {
  const fileName = imageURL.split('/').pop().split('.')[0];
  const publicId = `${folder}/${fileName}`;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw createHttpError(500, 'Failed to remove the photo of the contact');
  }
};

export default removeFileFromCloudinary;
