/*const mongoose = require('mongoose');
const { Schema } = mongoose;

const GarantiaSchema = new Schema({
    fechavencimiento: { type: Date, require: true },
    proveedor: { type: String, require: true },
    concepto: {
        ref: 'Concepto',
        type: Schema.Types.ObjectId,
        autopopulate: true,
    }
},  {
    timestamps: true,
    versionKey: false,
});
GarantiaSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Garantia', GarantiaSchema);*/