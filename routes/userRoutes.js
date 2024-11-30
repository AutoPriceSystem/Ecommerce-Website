// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUserById } = require("../controller/userCtrl.js");
const {getUserCount}= require("../controller/userCtrl.js");
router.post("/user/getUserDetails", getUserById);
router.get("/user/getUserCount", getUserCount);
module.exports = router;
