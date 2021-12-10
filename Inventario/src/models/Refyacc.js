
const mongoose = require('mongoose');
const { Schema } = mongoose;

//type, require, default, unique, trim, minlength
const RefAccSchema = new Schema({
    noresguardo: { type: String, require: true, unique: true},
    nointerno: { type: String, require: true, unique: true},
    nombre: { type: String, require: true, unique: false},
    fecha: { type: String, require: true, unique: false}, 
    ubicacion: { type: String, default: 'Almacen', unique: false},
    status: { type: String, require: true, unique: false},
    descripcion: { type: String, require: true, unique: false},
    garantia: {
        fechavencimiento: { type: String, require: true, unique: false},
        proveedor: { type: String, require: true, unique: false}
    }
},  {
    timestamps: true,
    versionKey: false,
});
module.exports = mongoose.model('Refyacc', RefAccSchema)