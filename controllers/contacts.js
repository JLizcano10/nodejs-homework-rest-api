const contacts = require("../models/contacts");
const HttpError = require("../helpers/httpError");

const getContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    return res.json({
      status: "Success",
      code: 200,
      show: result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError.HttpError(404, "Not found");
    }
    return res.json({
      status: "Success",
      code: 200,
      show: result,
    });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const result = await contacts.addContact(req.body);
    return res.json({
      status: "Success",
      code: 201,
      show: result,
    });
  } catch (error) {
    next(error);
  }
};
const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await contacts.removeContact(contactId);

    if (!result) {
      console.log(`Contact with id ${contactId} not found`);
      throw HttpError.HttpError(404, "Not found");
    }

    return res.json({
      status: "Success",
      code: 200,
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await contacts.updateContact(contactId, req.body);

    if (!result) {
      throw HttpError.HttpError(404, "Not found");
    }

    return res.json({
      status: "Success",
      code: 200,
      show: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateFavoriteContact = async (req, res, next) => {
  if (req.body.favorite === undefined) {
    res.status(400).json({
      status: "error",
      code: 404,
      message: "missing field favorite",
    });
    return;
  }
  const { contactId } = req.params;
  try {
    const result = await contacts.updateStatusContact(contactId, req.body);
    if (!result) {
      throw HttpError.HttpError(400, "Bad request");
    }
    return res.json({
      status: "Accepted",
      code: 202,
      show: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateFavoriteContact,
};
