const db = require("../models");
const InvoiceItems = db.invoice_item;
const Invoice = db.invoice;
// const Comment = db.comments;

exports.index = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ include: [ "client" ]})
    console.log(invoices);
    res.status(200).send(invoices);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.show = (tutorialId) => {
  return Tutorial.findByPk(tutorialId, { include: ["comments"] })
    .then((tutorial) => {
      return tutorial;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err);
    });
};

exports.create = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      name: req.body.name,
      clientId: req.body.clientId,
      userId: 1,
      invoice_items: req.body.invoiceItems
    },{
      include: ["invoice_items"]
    })
    // const itemsWithInvoiceId = req.body.invoiceItems.map(item => {return {...item, invoiceId: invoice.id}});
    // const AllInvoiceItems = await InvoiceItems.bulkCreate(itemsWithInvoiceId)
    
    // res.status(200).send({invoice: { ...invoice.dataValues, invoiceItems: AllInvoiceItems}});
    res.status(200).send({invoice});

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
