import { BOOLEANS, CONTACTS_FILTER } from '../constants/constants.js';

export const parseFilterParams = (query) => {
  let contactType;
  if (Array.isArray(query.contactType)) {
    contactType = query.contactType.filter((type) =>
      CONTACTS_FILTER.CONTACT_TYPES.includes(type),
    );
  } else if (
    query.contactType &&
    CONTACTS_FILTER.CONTACT_TYPES.includes(query.contactType)
  ) {
    contactType = [query.contactType];
  } else {
    contactType = CONTACTS_FILTER.CONTACT_TYPES;
  }

  let isFavourite;
  if (Array.isArray(query.isFavourite)) {
    isFavourite = query.isFavourite.filter((value) => BOOLEANS.includes(value));
  } else if (query.isFavourite && BOOLEANS.includes(query.isFavourite)) {
    isFavourite = [query.isFavourite];
  } else {
    isFavourite = undefined;
  }

  return { contactType, isFavourite };
};
