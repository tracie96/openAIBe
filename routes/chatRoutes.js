const express = require('express');
const { getFashionAdvice } = require('../controllers/productController');

const router = express.Router();

router.post('/chat', getFashionAdvice);

module.exports = router;
