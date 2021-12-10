
const mongoose = require('mongoose');
//const autoIncrement = require("mongoose-auto-increment");
//const mongooseDateFormat = require('mongoose-date-format');
const { Schema } = mongoose;

//type, require, default, unique, trim, minlength
const ConceptoSchema = new Schema({
    noresguardo: { type: String, require: true, unique: true},
    nointerno: { type: String, require: true, unique: true},
    nombre: { type: String, require: true, unique: false},
    noserie: { type: String, require: true, unique: true},
    fecha: { type: String, require: true, unique: false}, //podemos poner default: Date.now para poner la fecha del sistema por defecto sin necesidad de solicitarla
    ubicacion: { type: String, default: 'Almacen', unique: false},
    status: { type: String, require: true, unique: false},
    descripcion: { type: String, require: true, unique: false},
    garantia: {
        fechavencimiento: { type: String, require: true, unique: false},
        proveedor: { type: String, require: true, unique: false},
        /*type: Schema.Types.ObjectId,
        ref: 'Garantia',
        autopopulate: true,*/
    }
},  {
    timestamps: true,
    versionKey: false,
});

/*autoIncrement.initialize(mongoose.connection);
ConceptoSchema.plugin(autoIncrement.plugin, {
  model: "conceptos", // collection or table name in which you want to apply auto increment
  field: "_id", // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});*/

/*ConceptoSchema.virtual('fecha_inventario').set(function(fecha2){
    this.fecha = new Date(fecha2);
}).get(function(){
    return this.fecha.toISOString().substring(0,10);
});*/
//ConceptoSchema.plugin(mongooseDateFormat);
//ConceptoSchema.plugin(require('mongoose-plugin-date-format')('YYYY-MM-DDTHH:mm:ss[Z]'));
//ConceptoSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Concepto', ConceptoSchema)