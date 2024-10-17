import { CONTACTS_SORT_BY, SORT_ORDER } from '../constants/constants.js';
import { Contact } from '../db/models/Contact.js';
import { createPaginationData } from '../utils/createPaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = CONTACTS_SORT_BY.NAME,
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = Contact.find();

  if (filters.userId) {
    contactsQuery.where('userId').equals(filters.userId);
  }

  if (filters.contactType) {
    contactsQuery.where('contactType').in(filters.contactType);
  }

  if (filters.isFavourite) {
    contactsQuery.where('isFavourite').in(filters.isFavourite);
  }

  const [totalItems, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      }),
  ]);

  return {
    contacts,
    ...createPaginationData(page, perPage, totalItems),
  };
};

export const getContactById = (filter) => Contact.findOne(filter);

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);

export const createContact = (contactData) => Contact.create(contactData);

export const updateContact = (filter, contactData, options = {}) =>
  Contact.findOneAndUpdate(filter, contactData, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
