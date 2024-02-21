const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      "string.pattern.base":
        "Invalid name, the name must be written only in letters and contain from 2 to 30",
    })
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.pattern.base": "Invalid email. the email must be valid",
    })
    .required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({
      "string.pattern.base":
        "Invalid phone number format, the format should be (XXX) XXX-XXXX",
    })
    .required(),
});

module.exports = schema;
