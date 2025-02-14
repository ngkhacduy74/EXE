const Joi = require("joi");

const userValidate = Joi.object({
  id: Joi.string().optional(),
  fullname: Joi.string()
    .pattern(/^[A-Za-zÀ-ỹ\s]+$/)
    .custom((value, helpers) => {
      const words = value.trim().split(/\s+/);
      if (words.length < 3 || words.length > 20) {
        return helpers.error("fullname.words");
      }
      return value;
    })
    .required()
    .messages({
      "string.pattern.base": "Fullname must only contain letters and spaces.",
      "fullname.words": "Fullname must be between 3 and 20 words.",
      "string.empty": "Fullname cannot be empty.",
      "any.required": "Fullname is required.",
    }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    }),
  address: Joi.string().max(100).min(10),
});
