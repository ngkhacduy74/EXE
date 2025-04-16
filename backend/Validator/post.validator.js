const Joi = require("joi");
const postSchema = Joi.object({
  id: Joi.string.require(),
  category: Joi.string().require(),
  image: Joi.string.optional(),
  video: Joi.string.optional(),
  status: Joi.string.require(),
  title: Joi.string.require(),
  user_position: Joi.string.require(),
  address: Joi.string.require(),
  description: Joi.string().min(6).max(1500).require(),
  seller: Joi.object({
    fullname: Joi.string()
      .pattern(/^[A-Za-zÀ-Ỹà-ỹ\s]+$/)
      .max(30)
      .min(5)
      .required(),
  }).required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  email: Joi.string().email().required(),
});
module.exports = postSchema;
