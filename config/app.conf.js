const joi = require('joi');

const envVarsSchema = joi
  .object()
  .keys({
    PORT: joi.number().default(3001),
    MONGO_URL: joi.string().required(),
    ENCRYPTION_ALGORITHM: joi.string().required(),
    ENCRYPTION_KEY: joi.string().required(),
    ENCRYPTION_IV: joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const PORT = envVars.PORT;
const URL = `http://localhost:${PORT}`;

module.exports = {
  PORT,
  URL,
  MONGO_URL: envVars.MONGO_URL,
  ENCRYPTION_ALGORITHM: envVars.ENCRYPTION_ALGORITHM,
  ENCRYPTION_KEY: envVars.ENCRYPTION_KEY,
  ENCRYPTION_IV: envVars.ENCRYPTION_IV,
};
