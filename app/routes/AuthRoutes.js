const express = require("express");
const router = express.Router();
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/AuthController");

router.post(
  "/auth/signup",
  [
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRolesExisted
  ],
  controller.signup
);

router.post("/auth/signin", controller.signin);

module.exports = router;