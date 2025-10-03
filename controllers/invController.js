const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)
  const html = utilities.buildVehicleDetail(data)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    html,
  })
}

invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing purposes")
}

/* ***************************
 *  Inventory Management View
 * ************************** */
invCont.showManagement = async function (req, res, next) {
  const message = req.flash('message');
  const nav = await utilities.getNav(); 
  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    message,
  });
};


// Deliver the add-classification view
invCont.buildAddClassification = async function(req, res, next) {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
        title: 'Add New Classification',
        nav,
        message: req.flash('message'),
        errors: [],
    });
};

// Process form submission
invCont.addClassification = async function(req, res, next) {
    try {
        const { classification_name } = req.body;
        const result = await invModel.addClassification(classification_name);

        if (result) {
            req.flash('message', `Classification "${classification_name}" added successfully!`);
            const nav = await utilities.getNav();
            res.render('inventory/management', {
                title: 'Inventory Management',
                nav,
                message: req.flash('message'),
            });
        }
    } catch (err) {
        const nav = await utilities.getNav();
        res.render('inventory/add-classification', {
            title: 'Add New Classification',
            nav,
            errors: [{ msg: 'Failed to add classification. Please try again.' }],
        });
    }
};

// Deliver the add-inventory view
invCont.buildAddInventory = async function(req, res, next) {
    try {
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(
            req.body?.classification_id 
        );

        res.render('inventory/add-inventory', {
            title: 'Add New Vehicle',
            nav,
            message: req.flash('message'),
            errors: [],
            classificationList,
            // default or sticky values
            inv_make: req.body?.inv_make || '',
            inv_model: req.body?.inv_model || '',
            inv_year: req.body?.inv_year || '',
            inv_description: req.body?.inv_description || '',
            inv_image: req.body?.inv_image || '/images/no-image.png',
            inv_thumbnail: req.body?.inv_thumbnail || '/images/no-image.png',
            inv_price: req.body?.inv_price || '',
            inv_miles: req.body?.inv_miles || '',
            inv_color: req.body?.inv_color || ''
        });
    } catch (err) {
        next(err);
    }
};


// Process form submission
invCont.addInventory = async function (req, res, next) {
    try {
        const {
            inv_make,
            inv_model,
            inv_year,
            classification_id,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        } = req.body;

        const result = await invModel.addInventory({
            inv_make,
            inv_model,
            inv_year,
            classification_id,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });

        if (result) {
            req.flash('message', `Vehicle "${inv_make} ${inv_model}" added successfully!`);
            const nav = await utilities.getNav();
            res.render('inventory/management', {
                title: 'Inventory Management',
                nav,
                message: req.flash('message'),
            });
        }
    } catch (err) {
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList();
        res.render('inventory/add-inventory', {
            title: 'Add New Vehicle',
            nav,
            errors: [{ msg: 'Failed to add vehicle. Please try again.' }],
            classificationList,
        });
    }
};

module.exports = invCont