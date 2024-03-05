const { Contacts } = require("../schemas/contacts");

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
const addContact = async (contactData) => {
  const { name, email, phone, owner } = contactData;

  return Contacts.create({ name, email, phone, owner });
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
