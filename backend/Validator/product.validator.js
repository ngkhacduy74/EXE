const Joi = require("joi");
const { Bus } = require("lucide-react");

const creator = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID của creator phải là chuỗi",
    "any.required": "Vui lòng nhập ID của creator",
  }),
  fullname: Joi.string().optional().allow(null, "").messages({
    "string.base": "Họ tên phải là chuỗi",
  }),
  phone: Joi.string().optional().allow(null, "").messages({
    "string.base": "Số điện thoại phải là chuỗi",
  }),
  email: Joi.string().email().optional().allow(null, "").messages({
    "string.email": "Email không hợp lệ",
  }),
});

module.exports = creator;

const ProductSchema = Joi.object({
  id: Joi.string().optional(),

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
        .pattern(/^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/)
        .message("URL video YouTube không hợp lệ")
    )
    .optional(),

  name: Joi.string().required(),
  brand: Joi.string().required(),

  price: Joi.number().integer().min(1000).required().messages({
    "number.base": "Giá tiền phải là số",
    "number.integer": "Giá tiền phải là số nguyên",
    "number.min": "Giá tiền phải lớn hơn hoặc bằng 1.000 VND",
    "any.required": "Vui lòng nhập giá tiền",
  }),

  description: Joi.string().required(),
  size: Joi.string().optional().allow(null, "").messages({
    "string.base": "Kích thước phải là chuỗi",
  }),

  weight: Joi.number().min(0).optional().allow(null).messages({
    "number.base": "Cân nặng phải là số",
    "number.min": "Cân nặng không thể nhỏ hơn 0",
  }),

  warranty_period: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      "number.base": "Thời gian bảo hành phải là số",
      "number.min": "Thời gian bảo hành không thể âm",
    }),

  capacity: Joi.number().min(0).optional().allow(null).messages({
    "number.base": "Dung tích phải là số",
    "number.min": "Dung tích không thể âm",
  }),

  voltage: Joi.string()
    .pattern(/^\d+(V)?$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "Điện áp phải là chuỗi",
      "string.pattern.base": "Điện áp không hợp lệ (ví dụ: 220V)",
    }),

  status: Joi.string().valid("New", "SecondHand").required().messages({
    "any.only": "Trạng thái chỉ có thể là 'New' hoặc 'SecondHand'",
    "any.required": "Vui lòng nhập trạng thái sản phẩm",
  }),

  features: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      })
    )
    .optional(),
  creator: creator.optional(),
  quantity: Joi.number().min(0).max(1000).required().messages({
    "number.base": "Số lượng phải là số",
    "number.min": "Số lượng không được nhỏ hơn 0",
    "number.max": "Số lượng không được lớn hơn 1000",
    "any.required": "Vui lòng nhập số lượng sản phẩm",
  }),
  business_phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "Số điện thoại doanh nghiệp phải là chuỗi",
      "string.pattern.base": "Số điện thoại doanh nghiệp không hợp lệ",
    }),
});

module.exports = ProductSchema;
