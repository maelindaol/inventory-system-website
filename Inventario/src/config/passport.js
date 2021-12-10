const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, pass, done) => {
    const usuario = await Usuario.findOne({email: email});
    if(!usuario) {
        return done(null, false, {message: 'Correo no encontrado'});
    } else {
        const match = await usuario.matchPass(pass);
        if(match) {
            return done(null, usuario);
        } else {
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});
passport.deserializeUser((id, done) =>{
    Usuario.findById(id, (err, usuario) => {
        done(err, usuario);
    });
});