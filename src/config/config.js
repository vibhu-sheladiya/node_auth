const joi = require("joi");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(2500),
    MONGODB_URL: joi.string().trim().description("mongodb url"),
    BASE_URL: joi.string().trim().description("base URL"),
    JWT_SECRET_KEY: joi
      .string()
      .description("Jwt sectreat key")
      .default("thisisjwtsecreat_key"),
    SMTP_HOST: joi.string().description("server that will send the emails"),
    SMTP_PORT: joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: joi.string().description("username for email server"),
    SMTP_PASSWORD: joi.string().description("password for email server"),
    EMAIL_FROM: joi
      .string()
      .description("the from field in the emails sent by the app"),
  })
  .unknown();
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);
if (error) {
  console.log(`Config validation failed`, error);
}
module.exports = {
  port: envVars.PORT,
  mongodb: {
    url: envVars.MONGODB_URL,
    // url:'mongodb+srv://vibhasheladiya3936:azHqS6BCvCKsIqMV@cluster0.gxfoxkv.mongodb.net',
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  base_url: envVars.BASE_URL,
  jwt: {
    secret_key: envVars.JWT_SECRET_KEY,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
