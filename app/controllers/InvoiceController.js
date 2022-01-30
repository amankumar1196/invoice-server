const db = require("../models");
const Op = db.Sequelize.Op;
const InvoiceItems = db.invoice_item;
const Invoice = db.invoice;
const { getWhereQuery, getInclude, getOrderQuery, getResponseData, getPagination } = require("../utils")

exports.index = async (req, res) => {
  const { page, rpp, searchStr } = req.query;
  const { limit, offset } = getPagination(page, rpp);
  const condition = searchStr ? { [Op.or]: [ {name: { [Op.like]: `%${searchStr.trim()}%` }}, {'$client.name$': { [Op.like]: `%${searchStr.trim()}%` }} ] } : null;

  try {
    const data = await Invoice.findAndCountAll({
      where: getWhereQuery(req, condition), 
      order: getOrderQuery(req),
      limit,
      offset,
      include: getInclude(req)
    });

    res.status(200).send(getResponseData(data, page, rpp));

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.getAllIds = async (req, res) => {
  const { page, rpp, searchStr } = req.query;
  const { limit, offset } = getPagination(page, rpp);
  const condition = searchStr ? { [Op.or]: [ {name: { [Op.like]: `%${searchStr.trim()}%` }}, {'$client.name$': { [Op.like]: `%${searchStr.trim()}%` }} ] } : null;

  try {
    let data = await Invoice.findAll({
      where: getWhereQuery(req, condition), 
      order: getOrderQuery(req),
      limit,
      offset,
      include: getInclude(req),
      attributes: ['id']
    });
    data = data.map((id) => id.id)

    res.status(200).send(data);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.show = async (req, res) => {
  try {
    let data = await Invoice.findByPk(req.params.id, { include: getInclude(req) })
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.create = async (req, res) => {
  const { name, invoiceItems, clientId, userId, companyId, registerKey } = req.body
  try {
    const invoice = await Invoice.create({
      name,
      clientId,
      companyId,
      userId,
      registerKey,
      invoice_items: invoiceItems
    },{
      include: ["invoice_items"]
    })

    res.status(200).send({invoice});

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.update = async (req, res) => {
  const { id, name, userId, companyId, clientId, invoiceItems } = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    await Invoice.update({ name, clientId, companyId, userId, }, { where: { id }, transaction });
    let mapRecords = invoiceItems.map(item => { return { ...item, invoiceId: id }})
    await InvoiceItems.bulkCreate(
      mapRecords,
      { updateOnDuplicate: ["invoiceId"], transaction }
    )
    const invoice = await Invoice.findByPk(id, { include: ["invoice_items"], transaction });
    await transaction.commit();

    res.status(200).send(invoice);
    
  } catch (err) {
    await transaction.rollback()
    res.status(500).send(err.message);
  };
};

exports.delete = (tutorial) => {
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
