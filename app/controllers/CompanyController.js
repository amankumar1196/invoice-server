const db = require("../models");
const fs = require("fs");
const Company = db.company;
const Address = db.address;
const { getWhereQuery, getInclude, getLogoUploadUrl } = require("../utils")

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
  const { name, email, phone, address, registerKey, logo } = req.body;
  // let imgsrc = ""
  // let base64Data = ""
  try {

    // DO NOT DELETE UNTILL VERIFIED FILEUPLOAD

    // if (!logo) {
    //   console.log("No file upload");
    // } else {
    //   if(logo.indexOf("image/png") > -1) {
    //     base64Data = req.body.logo.replace(/^data:image\/png;base64,/, "");
    //     imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + ".png"
    //     imgName = registerKey + ".png"
    //     fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
    //       console.log(err);
    //     });
    //   }
    //   if(logo.indexOf("image/jpeg") > -1) {
    //     base64Data = req.body.logo.replace(/^data:image\/jpeg;base64,/, "");
    //     imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + ".jpeg"
    //     imgName = registerKey + ".jpeg"
    //     fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
    //       console.log(err);
    //     });
    //   }
    //   if(logo.indexOf("image/jpg") > -1) {
    //     base64Data = req.body.logo.replace(/^data:image\/jpg;base64,/, "");
    //     imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + ".jpg"
    //     imgName = registerKey + ".jpg"
    //     fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
    //       console.log(err);
    //     });
    //   }
    // }

    const company = await Company.create({
      name,
      email,
      phone,
      registerKey,
      address,
      logo: getLogoUploadUrl(logo, registerKey)
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
  // let imgsrc = logo
  // let base64Data = ""
  const transaction = await db.sequelize.transaction();
  try {
    // if (!logo) {
    //   console.log("No file upload");
    // } else {
    //   if(logo.indexOf("image/png") > -1) {
    //     base64Data = req.body.logo.replace(/^data:image\/png;base64,/, "");
    //     imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + ".png"
    //     imgName = registerKey + ".png"
    //     fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
    //       console.log(err);
    //     });
    //   }
    //   if(logo.indexOf("image/jpeg") > -1) {
    //     base64Data = req.body.logo.replace(/^data:image\/jpeg;base64,/, "");
    //     imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + ".jpeg"
    //     imgName = registerKey + ".jpeg"
    //     fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
    //       console.log(err);
    //     });
    //   }
    //   if(logo.indexOf("image/jpg") > -1) {
    //     base64Data = req.body.logo.replace(/^data:image\/jpg;base64,/, "");
    //     imgsrc = 'http://127.0.0.1:8080/logos/' + registerKey + ".jpg"
    //     imgName = registerKey + ".jpg"
    //     fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
    //       console.log(err);
    //     });
    //   }
    // }

    await Company.update({ name, email, phone, logo: getLogoUploadUrl(logo, registerKey) }, { where: { id }, transaction });
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
