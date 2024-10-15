import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactValidationSchema,
  updateContactValidationSchema,
} from '../validation/contact-schemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/uploadIntoTempDir.js';

const contactsRouter = Router();
contactsRouter.use('/', authenticate);
contactsRouter.use('/:contactId', isValidId('contactId'));
contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactValidationSchema),
  ctrlWrapper(createContactController),
);
contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactValidationSchema),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
