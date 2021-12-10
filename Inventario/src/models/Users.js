const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcryp = require('bcryptjs');

const UserSchema = new Schema({
    cargo: { type: String, require: true },
    nombre: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
},{
    timestamps: true,
    versionKey: false
});

//encriptacion de las contraseñas
/*UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcryp.genSalt(10);
    const hash = bcryp.hash(password,salt);
    return hash;
};
UserSchema.methods.matchPass = async function (password) {
    return await bcryp.compare(password, this.password);
};*/

module.exports = mongoose.model('User', UserSchema)
//considerar combiarlo por Users