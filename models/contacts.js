const { Contacts } = require("../schemas/contacts");
// const { nanoid } = require("nanoid");

const listContacts = async () => {
  return Contacts.find();
};

const getContactById = async (contactId) => {
  return Contacts.findOne({ _id: contactId });
};

const removeContact = async (contactId) => {
  return Contacts.findByIdAndDelete({ _id: contactId });
};

// data es req.body
const addContact = async (data) => {
  const { name, email, phone } = data;

  return Contacts.create({ name, email, phone });
};

const updateContact = async (contactId, data) => {
  return Contacts.findByIdAndUpdate({ _id: contactId }, data, { new: true });
};

// Favorite
const updateStatusContact = async (contactId, data) => {
  return Contacts.findByIdAndUpdate({ _id: contactId }, data, {
    new: true,
  });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
