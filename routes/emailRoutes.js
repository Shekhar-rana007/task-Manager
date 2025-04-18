const express = require("express");
const { sendEmailHandler } = require("../controllers/sendEmailController");
const router = express.Router();

router.post("/send", sendEmailHandler);

module.exports = router;
