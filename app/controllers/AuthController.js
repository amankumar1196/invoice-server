const db = require("../models");
const config = require("../config/auth.js");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { v4: UUIDV4 } = require('uuid');

exports.signup = async (req, res) => {
  try{
    // Save User to Database
    const { email, phone, firstName, lastName, password, roles } = req.body
    const user = await User.create({
      email,
      phone,
      firstName,
      lastName,
      password: bcrypt.hashSync(password, 8),
      registerKey: UUIDV4()
    })

    await user.setRoles([2]);

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({user: { ...user.dataValues, accessToken: token } })

  } catch(err) {
      res.status(500).send({ message: err.message });
    };
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
      return res.status(404).json({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Credentials!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

exports.currentUser = async (req, res) => {
  try {
    const { userId } = req
    let user = await User.findByPk(userId, { include: ["address", "roles"] })
    console.log(user);
    if(user){
      const roles = await user.getRoles();
      var authorities = [];
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      delete user.dataValues.password;
    }
    res.status(200).send({user, roles: authorities});
  } catch (err) {
    res.status(500).send(err.message);
  };
};