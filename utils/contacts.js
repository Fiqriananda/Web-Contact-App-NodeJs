const fs = require("fs");
const validator = require("validator");

const dirpath = "./data";
if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacs = JSON.parse(fileBuffer);
  return contacs;
};

const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

const saveContact = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContact(contacts);
};

const cekDuplikat = (nama) => {
  const contacs = loadContact();
  return contacs.find((contac) => contac.nama === nama);
};

const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContact = contacts.filter((contact) => contact.nama !== nama);
  saveContact(filteredContact);
};

const updateContact = (contactBaru) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== contactBaru.oldName
  );
  delete contactBaru.oldName
  filteredContacts.push(contactBaru)
  saveContact(filteredContacts)
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContact,
};
