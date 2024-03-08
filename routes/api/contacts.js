const express = require("express");
const ctrl = require("../../controllers/contacts");
const validator = require("../../middlewares/ValidationSchema");
const { schema } = require("../../schemas/contacts");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, ctrl.getContacts);

router.get("/:contactId", auth, ctrl.getById);

router.post("/", validator(schema), auth, ctrl.addContact);

router.delete("/:contactId", auth, ctrl.removeContact);

router.put("/:contactId", validator(schema), auth, ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  validator(schema),
  auth,
  ctrl.updateFavoriteContact
);

module.exports = router;
