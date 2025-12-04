import { Joi, celebrate, Segments } from "celebrate";

// Valid timezone options
const VALID_TIMEZONES = [
  "UTC-5 (Eastern Time)",
  "UTC-6 (Central Time)",
  "UTC-7 (Mountain Time)",
  "UTC-8 (Pacific Time)",
  "UTC-9 (Alaska Time)",
  "UTC-10 (Hawaii-Aleutian Time)",
];

const name = Joi.string().min(1).max(100).trim();
const email = Joi.string().email();
const timezone = Joi.string().valid(...VALID_TIMEZONES);
const avatar = Joi.string().uri().allow(null, ''); // URL or empty string

const putMyProfilePattern = Joi.object({
  name,
  email,
  timezone,
  avatar,
}).min(1); // At least one field must be present

const putMyProfileCelebrate = celebrate({ [Segments.BODY]: putMyProfilePattern });

export {
  putMyProfileCelebrate,
};

