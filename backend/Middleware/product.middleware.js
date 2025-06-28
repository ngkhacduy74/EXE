const productSchema = require("../Validator/product.validator");
const validateProduct = (req, res, next) => {
  console.log("validateProduct");
  const { error } = productSchema.validate(req.body, { abortEarly: false });
  if (error) {
    console.log("error", error);
    return res.status(400).json({ success: false, errors: error.details });
  }
  next();
};
module.exports = validateProduct;
