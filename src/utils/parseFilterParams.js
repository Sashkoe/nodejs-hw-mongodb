const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseIsFavourite = (isFavourite, defaultValue = undefined) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return defaultValue;

  const parsedIsFavourite =
    isFavourite === 'true' || isFavourite === 'false'
      ? isFavourite
      : defaultValue;

  return parsedIsFavourite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
