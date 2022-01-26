const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/UserController");

module.exports = app => {
  router.get("/", authJwt.verifyToken, controller.index);
  router.get("/:id", authJwt.verifyToken, controller.show);
  router.post("/", authJwt.verifyToken, controller.create);
  router.put("/:id", authJwt.verifyToken, controller.update);
  router.delete("/:id", authJwt.verifyToken, controller.delete);

  app.use('/api/v1/members', router);
};



// const { authJwt } = require("../middleware");
// const controller = require("../controllers/user.controller");

// module.exports = function(app) {
//   app.get("/api/test/all", controller.allAccess);

//   app.get(
//     "/api/test/user",
//     [authJwt.verifyToken],
//     controller.userBoard
//   );

//   app.get(
//     "/api/test/mod",
//     [authJwt.verifyToken, authJwt.isModerator],
//     controller.moderatorBoard
//   );

//   app.get(
//     "/api/test/admin",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.adminBoard
//   );
// };