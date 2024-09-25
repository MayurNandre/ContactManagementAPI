const express = require("express");
const router = express.Router();
const { getContacts, createContact, getContact, updateContact, deleteContact } = require("../controllers/contactControllers");
const validateToken = require("../middleware/validateTokenHandler");



router.use(validateToken);//For validate access to all the routes use this method.
router.route("/").get(getContacts).post(createContact); //They have common route so you can write as this
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact); //They have common route so you can write as this


module.exports = router;