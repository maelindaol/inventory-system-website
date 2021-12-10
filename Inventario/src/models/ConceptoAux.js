
const mongoose = require('mongoose');
const { Schema } = mongoose;

//type, require, default, unique, trim, minlength
const ConceptoAuxSchema = new Schema({
    noresguardo: { type: String, require: true, unique: true},
    nointerno: { type: String, require: true, unique: true},
    nombre: { type: String, require: true, unique: false},
    noserie: { type: String, require: true, unique: true},
    fecha: { type: String, require: true, unique: false}, //podemos poner default: Date.now para poner la fecha del sistema por defecto sin necesidad de solicitarla
    ubicacion: { type: String, default: 'Almacen', unique: false},
    status: { type: String, default: 'Activo', unique: false},
    descripcion: { type: String, require: true, unique: false},
    garantia: {
        fechavencimiento: { type: String, require: true, unique: false},
        proveedor: { type: String, require: true, unique: false}
    }
},  {
    timestamps: true,
    versionKey: false,
});
module.exports = mongoose.model('ConceptoAux', ConceptoAuxSchema)