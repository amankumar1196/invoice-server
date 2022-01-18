const db = require("../models");
const InvoiceItems = db.invoice_item;
const Invoice = db.invoice;
// const Comment = db.comments;
const Client = db.client;
const Address = db.address;

exports.index = async (req, res) => {
  try {
    const clients = await Client.findAll({ where: { userId: req.query.userId }, include: ["address"]})
    res.status(200).send(clients);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.show = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, { include: ["address"] })
    res.status(200).send(client);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.create = async (req, res) => {
  const { name, email, phone, country, state, address_line_1, address_line_2, userId} = req.body;
  try {
    const client = await Client.create({
      name,
      email,
      userId,
      phone,
      registerClientId,
      address: {
        address_line_1,
        address_line_2,
        country,
        state
      }
    },{
      include: [ "address" ]
    })

    res.status(200).send(client);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.update = (tutorial) => {
  return Tutorial.create({
    title: tutorial.title,
    description: tutorial.description,
  })
    .then((tutorial) => {
      console.log(">> Created tutorial: " + JSON.stringify(tutorial, null, 4));
      return tutorial;
    })
    .catch((err) => {
      console.log(">> Error while creating tutorial: ", err);
    });
};

exports.delete = async (req, res) => {
  try {
    const client = await Client.destroy({ where: { id: req.params.id } },{returning: true})
    res.status(200).send({id: client});

  } catch (err) {
    res.status(500).send(err.message);
  };
};
