const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters")
      .notEmpty()
      .withMessage("Classification name is required")
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add New Classification",
      nav,
      message: req.flash('message'),
    })
    return
  }
  next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Vehicle make is required"),
    body("inv_model").trim().notEmpty().withMessage("Vehicle model is required"),
    body("inv_year")
      .notEmpty()
      .withMessage("Vehicle year is required")
      .isInt({ min: 1886 }) // first car invented in 1886
      .withMessage("Enter a valid year"),
    body("classification_id").notEmpty().withMessage("Classification is required"),
    body("inv_description").trim().notEmpty().withMessage("Description is required"),
    body("inv_image").trim().notEmpty().withMessage("Image path is required"),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required"),
    body("inv_price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("inv_miles")
      .notEmpty()
      .withMessage("Miles is required")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer"),
    body("inv_color").trim().notEmpty().withMessage("Color is required"),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add New Vehicle",
      nav,
      message: req.flash('message'),
      classificationList,
      ...req.body // makes inputs sticky
    })
    return
  }
  next()
}




module.exports = validate
