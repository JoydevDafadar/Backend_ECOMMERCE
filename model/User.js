const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchma = new Schema({
    email : {type : String, required: true, unique:true},
    password : {type : Buffer, required: true},
    role : {type : String, required: true, default: 'user'},
    address : {type : [Schema.Types.Mixed] },
    name : {type : String},
    orders: {type: [Schema.Types.Mixed]},
    salt: Buffer
})

const virtual = userSchma.virtual('id');
virtual.get(function () {
    return this._id;
})

userSchma.set('toJSON', {
    virtuals: true,
    versionKey : false,
    transform: function(doc, ret){ delete ret._id }
})

exports.User = mongoose.model('User', userSchma);
