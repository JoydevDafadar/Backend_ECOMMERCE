const { Product } = require("../model/Product")


 exports.createProduct = ( req, res ) => {

    const product = new Product(req.body)

    product.save().then((doc) => {
        res.status(201).json(doc);
    }).catch((err) => {
        res.status(400).json(err);
    })

} 

 exports.fetchProduct = async ( req, res ) => {

    let query = Product.find();
    let totalCount = Product.find();

    if( req.query.category ){
        query = query.find({category : req.query.category});
        totalCount = totalCount.find({category : req.query.category});
    }
    if( req.query.brand ){
        query = query.find({brand : req.query.brand});
        totalCount = totalCount.find({brand : req.query.brand});
    }
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

exports.fetchProductById = async ( req, res ) => {

    const {id} = req.params;

    try {
        const product = await Product.findById(id);
        res.status(200).json(product);
        
    } catch (error) {
        res.status(400).json(error);
    }

} 

exports.updateProduct = async ( req, res ) => {

    const {id} = req.params;

    try {
        const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(product);
        
    } catch (error) {
        res.status(400).json(error);
    }

} 