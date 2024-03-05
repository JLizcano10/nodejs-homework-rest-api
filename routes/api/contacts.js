const express = require("express");
const ctrl = require("../../controllers/contacts");
// const schema = require("../../schemas/contacts");
const validator = require("../../middlewares/ValidationSchema");
const { schema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", ctrl.getContacts);

router.get("/:contactId", ctrl.getById);

router.post("/", validator(schema), ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validator(schema), ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  validator(schema),
  ctrl.updateFavoriteContact
);

module.exports = router;
