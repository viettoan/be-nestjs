import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string(),
  PORT: Joi.number(),

  MAIL_HOST: Joi.string(),
  MAIL_POST: Joi.number(),
  MAIL_USER: Joi.string(),
  MAIL_PASSWORD: Joi.string(),
  MAIL_FROM: Joi.string(),
});
