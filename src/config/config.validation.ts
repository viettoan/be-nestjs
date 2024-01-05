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

  ROOT_USER_INITIAL_NAME: Joi.string().min(1).max(255).required(),
  ROOT_USER_INITIAL_PASSWORD: Joi.string().min(6).max(25).required(),
  ROOT_USER_INITIAL_EMAIL: Joi.string().email().min(1).max(255).required(),
  ROOT_USER_INITIAL_PHONE: Joi.string()
    .regex(
      /^(0|\+84)((3[2-9])|(4[0-9])|(5[25689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/u,
    )
    .required(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
