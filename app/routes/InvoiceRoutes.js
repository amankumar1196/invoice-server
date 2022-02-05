const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/InvoiceController");

module.exports = app => {

  router.get("/", authJwt.verifyToken, controller.index);
  router.get("/ids", authJwt.verifyToken, controller.getAllIds);
  router.get("/:id", authJwt.verifyToken, controller.show);
  router.post("/", authJwt.verifyToken, controller.create);
  router.put("/:id", authJwt.verifyToken, controller.update);
  router.delete("/:id", authJwt.verifyToken, controller.delete);
  
  router.get("/:id/download-pdf", authJwt.verifyToken, controller.downloadPDF);
  router.post("/generate-invoice-pdf", authJwt.verifyToken, controller.generatePdf);
  
  app.use('/api/v1/invoices', router);
};
