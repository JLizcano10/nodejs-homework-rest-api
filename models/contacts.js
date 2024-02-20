const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const path = require("path");

const contactPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactFound = contacts.find(
    (contact) => contact.id === contactId.toString()
  );
  return contactFound || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );

  await fs.writeFile(contactPath, JSON.stringify(filteredContacts));

  return filteredContacts;
};

// data es req.body
const addContact = async (data) => {
  const { name, email, phone } = data;
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactPath, JSON.stringify(contacts));

  return newContact;
};

const updateContact = async (contactId, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const updatedContact = Object.assign({}, contacts[index], data);
  contacts[index] = updatedContact;
  await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
