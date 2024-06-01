import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('staging', 'uat', 'production', 'development'),

  SERVER_PORT: Joi.number().default(10000),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASS: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().required(),
  DATABASE_LOG: Joi.boolean().required(),
  DATABASE_CACHE: Joi.boolean().required(),
  DATABASE_TYPE: Joi.string()
    .valid('postgres', 'mysql', 'sqlite', 'mssql')
    .required(),
});
