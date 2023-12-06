
const { Order } = require('../model/Order');

exports.createOrder = async ( req, res) => {
    const order = new Order(req.body);
    try {
        const doc = await order.save();
        const result = await doc.populate('user');
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

 exports.fetchOrderByUserId = async ( req, res ) => {
    const {user} = req.query;
    try {
        const doc = await Order.find({user : user}).populate('user').exec();
        res.status(200).json(doc);
    } catch (error) {
        res.status(400).json(error);
    }

} 

exports.updateOrder = async ( req, res ) => {

    const {id} = req.params;

    try {
        const doc = await Order.findByIdAndUpdate(id, req.body, {new: true}).populate('user');
        res.status(200).json(doc);

    } catch (error) {
        res.status(400).json(error);
    }

} 
exports.deleteOrder = async ( req, res ) => {

    const {id} = req.params;

    try {
        const doc = await Order.findByIdAndRemove(id);
        res.status(200).json(doc);

    } catch (error) {
        res.status(400).json(error);
    }

} 


exports.fetchAllOrders = async ( req, res ) => {

    let query = Order.find();
    let totalCount = Order.find();

    if( req.query._sort && req.query._order ){
        query = query.sort({[req.query._sort]: req.query._order });
        totalCount = totalCount.sort({[req.query._sort]: req.query._order });
    }
    if( req.query._page && req.query._limit ){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize* (page-1)).limit(pageSize);
    }

    const totalDocs = await totalCount.count().exec();

    try {
        const doc = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(doc); 
    } catch (error) {
       res.status(400).json(error); 
    }

} 