const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const passport = require("passport");
const authHelper = require('../helpers/auth')

//Rutas publicas
//Registrar
router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});
router.post("/users/signup", authHelper.register);

//Quitar signin
router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

//Login
router.get("/users/login", (req, res) => {
  res.render("users/login");
});
router.post("/users/login", authHelper.login);

//Salir
router.get('/users/logout', authHelper.isAuthenticated, (req, res) => {
  req.logout(),
  res.redirect('/users/login')
});

module.exports = router;
