const bcrypt = require("bcryptjs");
const db = require("./app/models");
const { v4: UUIDV4 } = require('uuid');

const Role = db.role;
const User = db.user;
const Client = db.client;
const Invoice = db.invoice;
const InvoiceItem = db.invoice_item;
const Address = db.address;

const initial = async () => {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });

  // User.create({
  //   email: "amankumar1196@gmail.com",
  //   password: bcrypt.hashSync("123", 8),
  //   firstName: "Aman",
  //   lastName: "Kumar",
  //   phone: "123456789",
  //   role: [1],
  //   registerKey: UUIDV4()
  // });

  // Client.create({
  //   email: "amankumar1196@gmail.com",
  //   name: "Apple",
  //   phone: "123456789",
  //   userId: 1
  // })

  // Invoice.create({
  //   name: "Apple invoice",
  //   status: "send",
  //   userId: 1,
  //   clientId: 1
  // })
  // Invoice.create({
  //   name: "New Project expense invoice",
  //   status: "pending",
  //   userId: 1,
  //   clientId: 1
  // })
  // Invoice.create({
  //   name: "UI/UX expense invoice",
  //   status: "not_send",
  //   userId: 1,
  //   clientId: 1
  // })
  // Invoice.create({
  //   name: "Project expense invoice",
  //   status: "not_send",
  //   userId: 1,
  //   clientId: 1
  // })
  // Invoice.create({
  //   name: "New Project expense invoice",
  //   status: "not_send",
  //   userId: 1,
  //   clientId: 1
  // })
  // Invoice.create({
  //   name: "System invoice",
  //   status: "not_send",
  //   userId: 1,
  //   clientId: 1
  // })

  // InvoiceItem.create({
  //   description: "Item 1",
  //   quantity: 23,
  //   price: 123.50,
  //   invoiceId: 2
  // })

  // Address.create({
  //   addressId: 1,
  //   country: "IND",
  //   addressType: "user"
  // })

  // Address.create({
  //   addressId: 1,
  //   country: "PAK",
  //   addressType: "client"
  // })
}

module.exports = initial;