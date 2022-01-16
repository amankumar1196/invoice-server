const express = require("express");
const router = express.Router();
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/AuthController");

module.exports = app => {
  router.post(
    "/signup",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  router.post("/signin", controller.signin);

  app.use('/api/v1/auth', router);
};