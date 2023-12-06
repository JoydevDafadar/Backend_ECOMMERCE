const {User} = require('../model/User')


 exports.fetchUserById = async ( req, res ) => {
    const {id} = req.params;
    try {
        const doc = await User.findById(id, 'email name id address role').exec();
        res.status(200).json(doc);
        
    } catch (error) {
        res.status(400).json(error);
    }

} 

exports.updateUser = async ( req, res ) => {

    const {id} = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json(error);
    }

} 