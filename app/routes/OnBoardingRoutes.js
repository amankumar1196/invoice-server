const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/OnBoardingController");

module.exports = app => {
  router.post("/", [authJwt.verifyToken], controller.create);

  app.use('/api/v1/onboarding', router);
};