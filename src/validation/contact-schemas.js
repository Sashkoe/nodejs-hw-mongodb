import Joi from 'joi';

export const createContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().truthy('true').falsy('false'),
  contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});

export const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().truthy('true').falsy('false'),
  contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});
