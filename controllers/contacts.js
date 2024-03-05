const contacts = require("../models/contacts");
const HttpError = require("../helpers/httpError");
const { Contacts } = require("../schemas/contacts");

const getContacts = async (req, res, next) => {
  const { page, limit, favorite } = req.query;
  const { _id: ownerId } = req.user;
  const limitInt = parseInt(limit);
  const skipInt = (parseInt(page) - 1) * limitInt;
  let searchQuery = { owner: ownerId };
  // let searchQuery = { $or: [{ owner: ownerId }, { owner: null }] }; //Para que nuevo usuario que no ha agreagado sus propios usuarios vea al menos los 10 contactos basicos

  if (favorite === "true") {
    searchQuery.favorite = true;
  }

  try {
    const result = await Contacts.find(searchQuery)
      .skip(skipInt)
      .limit(limitInt);

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
  const { _id: ownerId } = req.user;

  try {
    const result = await contacts.getContactById(contactId);
    // Debo pasar a string result.owner y ownerId porque vienen de objetos que aunque tengan el mismo id son objetos que tienen propiedades diferentes por eso sin pasarlos a string no funciona la comparacion.
    if (!result || result.owner.toString() !== ownerId.toString()) {
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
  const { _id: ownerId } = req.user;
  const contactData = { ...req.body, owner: ownerId };
  try {
    const result = await contacts.addContact(contactData);
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
