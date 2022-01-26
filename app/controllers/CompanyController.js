const db = require("../models");
const fs = require("fs");
const Company = db.company;
const Address = db.address;
const { getWhereQuery, getInclude } = require("../utils")

exports.index = async (req, res) => {
  try {
    const companies = await Company.findAll({ where: getWhereQuery(req), include: getInclude(req)})
    res.status(200).send(companies);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.show = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, { include: getInclude(req) })
    res.status(200).send(company);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.create = async (req, res) => {
  const { name, email, phone, address, registerKey } = req.body;
  let imgsrc = ""
  
  try {
    if (!req.file) {
      console.log("No file upload");
    } else {
      imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
    }
    const company = await Company.create({
      name,
      email,
      phone,
      registerKey,
      address,
      logo: imgsrc
    },{
      include: [ "address" ]
    })

    res.status(200).send(company);

  } catch (err) {
    res.status(500).send(err.message);
  };
};

exports.update = async (req, res) => {
  const { id, name, email, phone, address, logo, registerKey } = req.body;
  let imgsrc = logo
  let base64Data = ""
  const transaction = await db.sequelize.transaction();
  try {
    if (!logo) {
      console.log("No file upload");
    } else {
      if(logo.indexOf("image/png") > -1) {
        base64Data = req.body.logo.replace(/^data:image\/png;base64,/, "");
        imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + "-" + id + ".png"
        imgName = registerKey + "-" + id + ".png"
        fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
          console.log(err);
        });
      }
      if(logo.indexOf("image/jpeg") > -1) {
        base64Data = req.body.logo.replace(/^data:image\/jpeg;base64,/, "");
        imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + "-" + id + ".jpeg"
        imgName = registerKey + "-" + id + ".jpeg"
        fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
          console.log(err);
        });
      }
      if(logo.indexOf("image/jpg") > -1) {
        base64Data = req.body.logo.replace(/^data:image\/jpg;base64,/, "");
        imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + "-" + id + ".jpg"
        imgName = registerKey + "-" + id + ".jpg"
        fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
          console.log(err);
        });
      }
    }

    await Company.update({ name, email, phone, logo: imgsrc }, { where: { id }, transaction });
    await Address.update(address, { where: { id: address.id }, transaction })
    const company = await Company.findByPk(id, { include: ["address"], transaction });
    await transaction.commit();

    res.status(200).send(company);
    
  } catch (err) {
    await transaction.rollback()
    res.status(500).send(err.message);
  };
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const company = await Company.findByPk(id)
    await Company.destroy({ where: { id } })
    res.status(200).send(company);

  } catch (err) {
    res.status(500).send(err.message);
  };
};
