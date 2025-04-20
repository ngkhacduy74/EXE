const Joi = require("joi");
const ProductSchema = Joi.object({
  id: Joi.string().required(),

  image: Joi.array()
    .items(
      Joi.string()
        .uri()
        .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
        .message("URL hình ảnh không hợp lệ")
    )
    .required(),

  video: Joi.array()
    .items(
      Joi.string()
        .uri()
        .pattern(/\.(mp4|mov|webm)$/i)
        .message("URL video không hợp lệ")
    )
    .optional(),

  name: Joi.string().required(),
  brand: Joi.string().required(),

  // Giá tiền phải là số nguyên, >= 1000
  price: Joi.number().integer().min(1000).required().messages({
    "number.base": "Giá tiền phải là số",
    "number.integer": "Giá tiền phải là số nguyên",
    "number.min": "Giá tiền phải lớn hơn hoặc bằng 1.000 VND",
    "any.required": "Vui lòng nhập giá tiền",
  }),

  description: Joi.string().required(),
  size: Joi.string().required(),

  weight: Joi.number()
    .min(0)
    .required()
    .messages({ "number.min": "Cân nặng không thể nhỏ hơn 0" }),

  warranty_period: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({ "number.min": "Thời gian bảo hành không thể âm" }),

  capacity: Joi.number()
    .min(0)
    .optional()
    .messages({ "number.min": "Dung tích không thể âm" }),

  voltage: Joi.string()
    .pattern(/^\d+(V)?$/)
    .optional()
    .messages({
      "string.pattern.base": "Điện áp không hợp lệ (ví dụ: 220V)",
    }),
});
module.exports = ProductSchema;
