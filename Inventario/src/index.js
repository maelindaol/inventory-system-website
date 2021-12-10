require("dotenv").config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const { extname } = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const winston = require('winston');
const MongoDB =require('winston-mongodb');
const cors = require('cors');
const XLSX = require('xlsx');
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

                const cookieParser = require("cookie-parser");

//Initiliazations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    conceptosDir: path.join(app.get('views'), 'conceptos'),
    garantiasDir: path.join(app.get('views'), 'garantias'),
    refyaccDir: path.join(app.get('views'), 'refyacc'),
    usersDir: path.join(app.get('views'), 'users'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
                    app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors())
app.use(express.static(path.resolve(__dirname,'public')));

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/inventario'));
app.use(require('./routes/inventarioR'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});