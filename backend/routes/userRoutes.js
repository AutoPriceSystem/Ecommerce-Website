// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUserById } = require("../controller/userCtrl.js");

router.get("/user/:user_id", getUserById);

module.exports = router;
