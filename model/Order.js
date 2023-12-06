const mongoose = require('mongoose')
const {Schema} = mongoose;

const orderSchema = new Schema({
    item: {type: [Schema.Types.Mixed]},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    totalItem : {type: Number, required: true},
    totalPrice : {type: Number, required: true},
    selectedAddress : {type: Schema.Types.Mixed, required: true},
    paymentMethod : {type: String, required: true},
    status : {type: String, default:"pending"}
})

const virtual = orderSchema.virtual('id');
virtual.get(function () {
    return this._id;
})

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey : false,
    transform: function(doc, ret){ delete ret._id }
})

exports.Order = mongoose.model('Order', orderSchema);
