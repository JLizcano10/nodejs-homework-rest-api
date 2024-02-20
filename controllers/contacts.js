const contacts = require("../models/contacts");
const HttpError = require("../helpers/httpError");

const getContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError.HttpError(404, "Not found");
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const result = await contacts.addContact(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await contacts.removeContact();

    if (!result) {
      throw HttpError.HttpError(404, "Not found");
    }

    return res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};
const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);

    if (!result) {
      throw HttpError.HttpError(404, "Not found");
    }

    return res.status(200).json(result);
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
};
