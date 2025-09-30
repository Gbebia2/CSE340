// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to deliver a specific vehicle detail view
router.get('/detail/:invId', utilities.handleErrors(invController.buildDetailView))
// Route to trigger a test error 
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;