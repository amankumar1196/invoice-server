const db = require("../models");
const Op = db.Sequelize.Op;
const Client = db.client;
const Address = db.address;
const { getWhereQuery, getInclude, getOrderQuery, getResponseData, getPagination } = require("../utils")

exports.index = async (req, res) => {
  const { page, rpp, searchStr } = req.query;
  const { limit, offset } = getPagination(page, rpp);
  const condition = searchStr ? { [Op.or]: [ {name: { [Op.like]: `%${searchStr}%` }}, {email: { [Op.like]: `%${searchStr}%` }} ] } : null;
  try {
    const data = await Client.findAndCountAll({ 
      where: getWhereQuery(req, condition), 
      order: getOrderQuery(req),
      limit,
      offset,
      include: getInclude(req)
    })

    res.status(200).send(getResponseData(data, page, rpp));

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
