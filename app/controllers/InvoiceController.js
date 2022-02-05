const moment = require("moment"); 
const db = require("../models");
const Op = db.Sequelize.Op;
const InvoiceItems = db.invoice_item;
const Invoice = db.invoice;
const Client = db.client;
const Company = db.company;
const { getWhereQuery, getInclude, getOrderQuery, getResponseData, getPagination, generatePdfFromUrl } = require("../utils")

getDateFilterCondition = (val) => {
  switch(val){
    case "1": return {
      [Op.lt]: moment(),
      [Op.gt]: moment().format("DD-MM-YYYY")
      }
    case "2": return {
      [Op.gte]: moment().subtract(7, 'days').toDate()
    }
    default: return {
      [Op.lte]: moment()
    }
  }
}

exports.index = async (req, res) => {
  const { page, rpp, searchStr, extraParams } = req.query;
  const { limit, offset } = getPagination(page, rpp);
  let dateCondition = getDateFilterCondition(extraParams.createdAt);
  const condition = searchStr ? { [Op.or]: [ {name: { [Op.like]: `%${searchStr.trim()}%` }}, {'$client.name$': { [Op.like]: `%${searchStr.trim()}%` }} ], status: {[Op.any]:  extraParams.status} }: null;

  try {
    const data = await Invoice.findAndCountAll({
      where: getWhereQuery(req, {...condition, createdAt: dateCondition}), 
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

    await InvoiceItems.destroy({ where: { invoiceId: id }})

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

exports.delete = async (req, res) => {
  const { id, archived } = req.body;
  try {
    await Invoice.update({ archived }, { where: { id } });
    const invoice = await Invoice.findByPk(id);
    res.status(200).send(invoice);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.generatePdf = async (req, res) => {
  try {
    let fileName = `${new Date().getTime()}-${req.body.data.client.registerKey}`
    const url = await generatePdfFromUrl(req.body.data, fileName)
    
    res.set({ 'Content-Type': 'application/pdf' })
    req.body.data.type === "download" ?
      res.download(`public/pdfs/${fileName}.pdf`)
      :
      res.send(url)
    
  } catch (err) {
    console.log(err);
    res.send(err)
  }
};

exports.downloadPDF = async (req, res) => {
  const { id } = req.params
  let pdfData = {}
  try {
    let data = await Invoice.findByPk(id, {
      include: [
        { model: Client, as: 'client', include: ["address"]},
        { model: Company, as: 'company', include: ["address"]},
        { model: InvoiceItems, as: 'invoice_items'}
      ]})

      pdfData = {
      client: data.client,
      company: data.company,
      invoiceItems: { name: data.name, invoiceItems: data.invoice_items },
    }
    
    let fileName = `${new Date().getTime()}-${data.client.registerKey}`
    await generatePdfFromUrl(pdfData, fileName)

    res.set({ 'Content-Type': 'application/pdf' })
    res.download(`public/pdfs/${fileName}.pdf`)

  } catch (err) {
      res.status(500).send(err.message);
  };
}
