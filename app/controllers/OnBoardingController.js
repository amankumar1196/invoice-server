const db = require("../models");
const User = db.user;
const Company = db.company;

const { getInclude } = require("../utils");

exports.create = async (req, res) => {
  try{
    const { email, phone, name, address, accountType, userId, registerKey } = req.body
    const company = await Company.create({
      email,
      phone,
      name,
      registerKey,
      address
    },{
      include: getInclude(req)
    })

    const user = await User.findByPk(userId, { include: getInclude(req) })
    await user.setCompanies([company.id]);

    if(accountType === "2") {
      await user.createAddress(address)
    }
    await user.save()
    res.status(200).send(user)

  } catch(err) {
      res.status(500).send({ message: err.message });
    };
};
