const express = require("express");
const { createProduct, fetchProduct, fetchProductById, updateProduct } = require("../controller/Product");

const router = express.Router();

router
.post("/", createProduct)
.get("/", fetchProduct)
.get('/:id', fetchProductById)
.patch('/:id', updateProduct)

exports.router = router;
