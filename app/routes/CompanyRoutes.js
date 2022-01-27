const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/CompanyController");

module.exports = app => {
  router.get("/", authJwt.verifyToken, controller.index);
  router.get("/:id", authJwt.verifyToken, controller.show);
  router.post("/", authJwt.verifyToken, controller.create);
  router.put("/:id", authJwt.verifyToken, controller.update);
  router.delete("/:id", authJwt.verifyToken, controller.delete);

  app.use('/api/v1/companies', router);
};