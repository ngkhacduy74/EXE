const Joi = require("joi");

const postSchema = Joi.object({
  id: Joi.string().optional(),
  category: Joi.string().required(),
  image: Joi.array().items(Joi.string()).optional(),
  video: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("New", "SecondHand").required(),
  title: Joi.string().required(),
  user_position: Joi.string().valid("Newbie", "Professional").required(),
  address: Joi.string().required(),
  description: Joi.string().min(6).max(1500).required(),
  // seller: Joi.object().required(),
});

module.exports = postSchema;
