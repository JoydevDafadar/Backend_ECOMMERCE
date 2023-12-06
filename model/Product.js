const mongoose = require('mongoose')
const {Schema} = mongoose;

const ProductSchema = new Schema({
    title : {type : String, required: true, unique:true},
    description : {type : String, required: true},
    price : {type : Number, required: true, min:[1,'Wrong Min discountPercentage'], max:[10000,'Wrong Min discountPercentage']},
    discountPercentage : {type: Number, required:true, min:[0,'Wrong Min discountPercentage'], max:[99,'Wrong Min discountPercentage']},
    rating : {type: Number, required:true, min:[0,'Wrong Min discountPercentage'], max:[5,'Wrong Min discountPercentage'], default:0},
    stock : {type: Number, required:true},
    brand : {type: String, required:true},
    category : {type: String, required:true},
    thumbnail : {type: String, required:true},
    images : {type: [String], required:true},
    deleted : {type: Boolean, default: false}
})

const virtual = ProductSchema.virtual('id');
virtual.get(function () {
    return this._id;
})

ProductSchema.set('toJSON', {
    virtuals: true,
    versionKey : false,
    transform: function(doc, ret){ delete ret._id }
})

exports.Product = mongoose.model('Product', ProductSchema);
