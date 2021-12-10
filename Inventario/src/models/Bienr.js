
const mongoose = require('mongoose');
//const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;

const BienrSchema = new Schema({
    bienr: { type: String, require: true, trim: true}
});

/*autoIncrement.initialize(mongoose.connection);
BienrSchema.plugin(autoIncrement.plugin, {
  model: "bienrs", // collection or table name in which you want to apply auto increment
  field: "_id", // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});*/

module.exports = mongoose.model('Bienr', BienrSchema)