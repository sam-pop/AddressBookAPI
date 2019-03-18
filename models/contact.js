// Contact constructor
// TODO: ADD INPUT VALIDATION
function Contact(contact) {
  if (contact.name) this.name = contact.name;
  else return undefined;

  if (contact.address) this.address = contact.address;
  else this.address = null;
  if (contact.phone) this.phone = contact.phone;
  else this.phone = null;
  if (contact.email) this.email = contact.email;
  else this.email = null;
}

module.exports = Contact;
