const Joi = require("joi");
const sellerSchema = Joi.object({
  id: Joi.string().required(),
  fullname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  gender: Joi.string().required(),
});

const postSchema = Joi.object({
  id: Joi.string().optional(),
  category: Joi.string().required(),
  image: Joi.array().items(Joi.string()).max(3).optional(),
  video: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("New", "SecondHand").required(),
  title: Joi.string().required(),
  user_position: Joi.string().valid("Newbie", "Professional").required(),
  address: Joi.string().required(),
  condition: Joi.string().valid("Pending", "Active", "Reject").optional(),
  description: Joi.string().min(6).max(1500).required(),
  seller: sellerSchema.optional(),
});

module.exports = postSchema;
