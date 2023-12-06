const express = require('express');
const { addToCart, fetchCartById, deleteCart, updateCart } = require('../controller/Cart');
const router = express.Router();


router
    .post('/', addToCart)
    .get('/', fetchCartById)
    .delete('/:id', deleteCart)
    .patch('/:id', updateCart);


exports.router = router;