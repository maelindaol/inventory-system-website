
const mongoose = require('mongoose');
//const autoIncrement = require("mongoose-auto-increment");
const { Schema } = mongoose;

const BienSchema = new Schema({
    bien: { type: String, require: true, trim: true}
});

/*autoIncrement.initialize(mongoose.connection);
BienSchema.plugin(autoIncrement.plugin, {
  model: "biens", // collection or table name in which you want to apply auto increment
  field: "_id", // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});*/

module.exports = mongoose.model('Bien', BienSchema)