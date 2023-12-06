const {Cart} = require('../model/Cart')

exports.addToCart = async ( req, res) => {
    const cart = new Cart(req.body);
    try {
        const doc = await cart.save();
        const result = await doc.populate('product');
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

 exports.fetchCartById = async ( req, res ) => {
    const {user} = req.query;
    try {
        const doc = await Cart.find({user : user}).populate('product').populate('user').exec();
        res.status(200).json(doc);
    } catch (error) {
        res.status(400).json(error);
    }

} 

exports.updateCart = async ( req, res ) => {

    const {id} = req.params;

    try {
        const cart = await Cart.findByIdAndUpdate(id, req.body, {new: true}).populate('product').populate('user');
        res.status(200).json(cart);

    } catch (error) {
        res.status(400).json(error);
    }

} 
exports.deleteCart = async ( req, res ) => {

    const {id} = req.params;

    try {
        const cart = await Cart.findByIdAndDelete(id).exec();
        res.status(200).json(cart);

    } catch (error) {
        res.status(400).json(error);
    }

} 