const express = require('express');
const { createOrder, fetchOrderByUserId, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/Order');
const router = express.Router();


router
    .post('/', createOrder)
    .get('/', fetchOrderByUserId)
    .delete('/:id', deleteOrder)
    .patch('/:id', updateOrder)
    .get('/all', fetchAllOrders)


exports.router = router;