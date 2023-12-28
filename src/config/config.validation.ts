import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),

  MAIL_HOST: Joi.string(),
  MAIL_POST: Joi.number(),
  MAIL_USER: Joi.string(),
  MAIL_PASSWORD: Joi.string(),
  MAIL_FROM: Joi.string(),

  BCRYPT_SALT_ROUND: Joi.number().default(10),
  SESSION_KEY_LENGTH_IN_BYTES: Joi.number().required(),
  SESSION_EXPIRE_DURATION_IN_SECOND: Joi.number().required(),
});
