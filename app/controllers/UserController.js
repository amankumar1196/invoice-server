const db = require("../models");
const InvoiceItems = db.invoice_item;
const Invoice = db.invoice;
// const Comment = db.comments;
const Client = db.client;
const Address = db.address;
const Member = db.user
const { getWhereQuery, getInclude } = require("../utils")

exports.index = async (req, res) => {
  try {
    const users = await User.findAll({ where: getWhereQuery(req), include: getInclude(req)})
    res.status(200).send(users);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.show = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: ["address"] })
    res.status(200).send(user);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.create = async (req, res) => {
  const { name, email, phone, address, userId, registerKey } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      userId,
      phone,
      registerKey,
      address
    },{
      include: [ "address" ]
    })

    res.status(200).send(user);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.update = async (req, res) => {
  const { id, name, email, phone, address } = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    await User.update({ name, email, phone }, { where: { id }, transaction });
    await Address.update(address, { where: { id: address.id }, transaction })
    const user = await User.findByPk(id, { include: ["address"], transaction });
    await transaction.commit();

    res.status(200).send(user);
    
  } catch (err) {
    await transaction.rollback()
    res.status(500).send(err.message);
  };
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findByPk(id)
    await user.destroy({ where: { id } })
    res.status(200).send(user);

  } catch (err) {
    res.status(500).send(err.message);
  };
};


// exports.allAccess = (req, res) => {
//   res.status(200).send("Public Content.");
// };

// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };