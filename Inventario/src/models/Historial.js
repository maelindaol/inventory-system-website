const mongoose = require('mongoose');
const { Schema } = mongoose;

const HistorialSchema = new Schema({ 
    timestamp: Date,
    level: String,
    message: String,
    meta: String
});

module.exports = mongoose.model('Historial', HistorialSchema, 'historial');