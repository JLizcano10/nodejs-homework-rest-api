const Joi = require("joi");
const { Schema, model } = require("mongoose");

const namePattern = /^[A-Za-z\s]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

// Validacion con joi
const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(70)
    .pattern(namePattern)
    .messages({
      "string.pattern.base":
        "Invalid name, the name must be written only in letters and contain from 2 to 30",
    })
    .required(),
  email: Joi.string()
    .pattern(emailPattern)
    .messages({
      "string.pattern.base": "Invalid email. the email must be valid",
    })
    .required(),
  phone: Joi.string()
    .pattern(phonePattern)
    .messages({
      "string.pattern.base":
        "Invalid phone number format, the format should be (XXX) XXX-XXXX",
    })
    .required(),
  favorite: Joi.bool(),
});

// Validacion con Schema de mongoose. PEndiente seguir leyendo y mejorar?
const contacts = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 70,
      required: [true, "Set name for contact"],
      validate: {
        validator: function (v) {
          return namePattern.test(v);
        },
        message: (props) => `${props.value} is not a valid name`,
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return emailPattern.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return phonePattern.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contacts = model("contacts", contacts);

module.exports = {
  schema,
  Contacts,
};
