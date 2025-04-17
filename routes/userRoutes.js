const express = require("express");
const { registerUser, loginUser } = require("../controllers/usercontroller");
const {
  registerValidation,
  loginValidation,
} = require("../validators/userValidator");
const validate = require("../validators/validate");

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);

router.post("/login", loginValidation, validate, loginUser);

module.exports = router;
