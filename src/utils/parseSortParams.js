import { CONTACTS_SORT_BY, SORT_ORDER } from '../constants/constants.js';

export const parseSortParams = (query) => {
  const sortOrder = Object.values(SORT_ORDER).includes(query.sortOrder)
    ? query.sortOrder
    : SORT_ORDER.ASC;

  const sortBy = Object.values(CONTACTS_SORT_BY).includes(query.sortBy)
    ? query.sortBy
    : CONTACTS_SORT_BY.NAME;

  return {
    sortOrder,
    sortBy,
  };
};
