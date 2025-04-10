const Joi = require("joi");
const userSchema = Joi.object({
  id: Joi.string().optional(),
  fullname: Joi.string()
    .pattern(/^[A-Za-zÀ-Ỹà-ỹ\s]+$/)
    .max(30)
    .min(5)
    .required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  address: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  // role: Joi.string().valid("User", "Admin").required(),
  ava_img_url: Joi.string().optional(),
});

module.exports = userSchema;
