const helpers = {};
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Autentificación
helpers.isAuthenticated = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userRole = data.cargo;
    req.name = data.username;
    return next();
  } catch {
    //return res.sendStatus(403);
    return res.redirect('/users/login')
  }
};

//Jefe de laboratorio
helpers.isJefeLab = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    //const users = await Users.find(req.body);
    //const roles = await Role.find({ _id: { $in: user.roles } });
      if (data.cargo === "jefeLab") {
        next();
        return;
      }else{
        return res.status(403).json({ message: "Se requiere rol de jefe de laboratorio!" });
      }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

//Jefe de departamento
helpers.isJefeDep = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    //const users = await Users.find(req.body);
    //const roles = await Role.find({ _id: { $in: user.roles } });
      if (data.cargo === "jefeDep") {
        next();
        return;
      }else{
        return res.status(403).json({ message: "Se requiere rol de jefe de departamento!" });
      }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

//Auxiliar de laboratorio
helpers.isAuxLab = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    //const users = await Users.find(req.body);
    //const roles = await Role.find({ _id: { $in: user.roles } });
      if (data.cargo === "auxLab") {
        next();
        return;
      }else{
        return res.status(403).json({ message: "Se requiere rol de auxiliar de laboratorio!" });
      }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

//Registro
helpers.register = async (req, res, next) => {
  const { cargo, nombre, email, password } = req.body;
  const errors = [];
  if (password.length > 4) {
    errors.push({ text: "Contraseña mayor a 4 caracteres" });
  }
  if (cargo.length <= 0) {
    errors.push({ text: "Seleccione uno de los cargos" });
  }
  if (nombre.length <= 0) {
    errors.push({ text: "Ingrese el nombre" });
  }
  if (email.length <= 0) {
    errors.push({ text: "Ingrese el correo" });
  }
  if (password.length <= 0) {
    errors.push({ text: "Ingrese una contraseña" });
  }
  if (errors.length > 0) {
    res.render("users/signup", { cargo, nombre, email, password });
  } else {
    const emailUser = await Users.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "El correo ya se encuentra registrado");
      res.redirect("/users/signup");
    }
    const newUsuario = new Users({ cargo, nombre, email, password });
    newUsuario.password = await bcrypt.hash(password, 10);
    await newUsuario.save();

    /*const payload = {
      sub: newUsuario._id,
      exp: Math.round(Date.now() / 1000) + parseInt(process.env.JWT_EXPIRE),
      username: newUsuario.nombre,
      cargo: newUsuario.cargo,
    };
    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, {
      algorithm: process.env.JWT_ALGORITHM,
    });*/

    const payload = {
      sub: Users._id,
      username: Users.nombre,
      cargo: Users.cargo,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { algorithm: process.env.JWT_ALGORITHM, expiresIn: process.env.JWT_EXPIRE }
    );

    if (token) {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: false,
        })
        .status(200)
        .redirect("/users/login");
    }
  }
};

//Login
helpers.login = (req, res, next) => {
  var params = req.body;
  var username = params.email;
  var password = params.password;
  Users.findOne({ email: username })
    .then((Users) => {
      if (Users === null || !bcrypt.compare(password, Users.password))
        next(new error_types.Error404("username or password not correct."));
      else {
        /*const payload = {
          sub: Users._id,
          //exp: Math.round(Date.now() / 1000) + parseInt(process.env.JWT_EXPIRE),
          username: Users.nombre,
          cargo: Users.cargo,
        };
        const token = jwt.sign(
          JSON.stringify(payload),
          process.env.JWT_SECRET,
          { algorithm: process.env.JWT_ALGORITHM }
        );*/

        const payload = {
          sub: Users._id,
          username: Users.nombre,
          cargo: Users.cargo,
        };
        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { algorithm: process.env.JWT_ALGORITHM, expiresIn: process.env.JWT_EXPIRE }
        );

        if (token) {
          res
            .cookie("access_token", token, {
              httpOnly: true,
              secure: false,
            })
            .status(200)
            .redirect("/index");
        }
      }
    })
    .catch((err) => next(err)); // error en DB
};

module.exports = helpers;
