const pool = require("../database/")

/* ***************************
 * Get all classification data
 * ***************************/

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
        [classification_id]
        )
        return data.rows
    }   catch (error) {
        console.error("getclassificationsbyid " + error)
    }
}

/* ***************************
 *  Get a vehicle by id
 * ************************** */

async function getVehicleById(invId) {
  try {
    const sql = `
      SELECT * FROM inventory
      WHERE inv_id = $1
    `
    const result = await pool.query(sql, [invId])
    return result.rows[0]
  } catch (error) {
    console.error("getVehicleById error:", error)
    throw error
  }
}

/* ***************************
 * Add a new classification
 * ***************************/
async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]  
  } catch (error) {
    console.error("addClassification error:", error)
    throw error
  }
}

/* ***************************
 * Add a new inventory item
 * ***************************/
async function addInventory({
  inv_make,
  inv_model,
  inv_year,
  classification_id,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color
}) {
  try {
    const sql = `
      INSERT INTO public.inventory
        (inv_make, inv_model, inv_year, classification_id, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
    const values = [inv_make, inv_model, inv_year, classification_id, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color];
    const result = await pool.query(sql, values);
    return result.rows[0]; // returns the newly inserted vehicle
  } catch (error) {
    console.error("addInventory error:", error);
    throw error;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};