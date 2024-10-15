import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import uploadImage from '../utils/uploadFile.js';
import removeFile from '../utils/removeFile.js';
import env from '../utils/env.js';

const cloudinaryFolder = env('CLOUDINARY_FOLDER');

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filters = parseFilterParams(req.query);
  const { _id: userId } = req.user;

  const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortOrder,
    sortBy,
    filters: { ...filters, userId },
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContactById({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const removedContact = await deleteContact({ _id: contactId, userId });
  if (!removedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  await removeFile(removedContact, cloudinaryFolder);
  res.sendStatus(204);
};

export const createContactController = async (req, res) => {
  const photo = await uploadImage(req.file, cloudinaryFolder);

  const { _id: userId } = req.user;
  const createdContact = await createContact({ ...req.body, userId, photo });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};

export const patchContactController = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Please check the provided data');
  }

  const { contactId } = req.params;
  const { body } = req;
  const { _id: userId } = req.user;

  const contact = await getContactById({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  const photo = await uploadImage(req.file, cloudinaryFolder, contact.photo);

  const updatedContactRawData = await updateContact(
    { _id: contactId, userId },
    { ...body, photo },
  );

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContactRawData.value,
  });
};
