import removeFileLocally from './removeFileLocally.js'; // You would implement this function for local file removal
import removeFileFromCloudinary from './removeFileFromCloudinary.js'; // Assuming you have a method for Cloudinary deletion

export const removeFile = async (contact, folder) => {
  if (!contact.photo) return;

  if (contact.photo.includes('cloudinary')) {
    await removeFileFromCloudinary(contact.photo, folder);
  } else {
    await removeFileLocally(contact.photo);
  }
};

export default removeFile;
