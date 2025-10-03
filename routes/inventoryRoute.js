// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidation = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to deliver a specific vehicle detail view
router.get('/detail/:invId', utilities.handleErrors(invController.buildDetailView))
// Route to trigger a test error 
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))
// Route to render the management view
router.get("/", utilities.handleErrors(invController.showManagement));
// Deliver the add-classification form
router.get('/classification/add', utilities.handleErrors(invController.buildAddClassification));

// Handle form submission with server-side validation
router.post(
  '/classification/add',
  invValidation.classificationRules(),
  invValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
router.get("/inventory/add", utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/inventory/add",
  invValidation.inventoryRules(),
  invValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;