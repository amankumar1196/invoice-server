const db = require("../models");
const InvoiceItems = db.invoice_item;
const Invoice = db.invoice;
// const Comment = db.comments;
const Client = db.client;
const Address = db.address;
const { getWhereQuery, getInclude } = require("../utils")
exports.index = async (req, res) => {
  try {
    const clients = await Client.findAll({ where: getWhereQuery(req), include: getInclude(req)})
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
  const { name, email, phone, address, userId, registerKey } = req.body;
  try {
    const client = await Client.create({
      name,
      email,
      userId,
      phone,
      registerKey,
      address
    },{
      include: [ "address" ]
    })

    res.status(200).send(client);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.update = async (req, res) => {
  const { id, name, email, phone, address } = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    await Client.update({ name, email, phone }, { where: { id }, transaction });
    await Address.update(address, { where: { id: address.id }, transaction })
    const client = await Client.findByPk(id, { include: ["address"], transaction });
    await transaction.commit();

    res.status(200).send(client);
    
  } catch (err) {
    await transaction.rollback()
    res.status(500).send(err.message);
  };
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const client = await Client.findByPk(id)
    await Client.destroy({ where: { id } })
    res.status(200).send(client);

  } catch (err) {
    res.status(500).send(err.message);
  };
};
