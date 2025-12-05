'use strict';

const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

// Exporter
router.post('/consumer/add', tradeController.AddConsumer);
router.post('/product/add', tradeController.AddProduct);

// Importer
router.post('/custom/create', tradeController.CreateCustom);
router.post('/token/create', tradeController.CreateToken);

// Consumer
router.post('/order/create', tradeController.CreateOrder);
router.post('/order/confirm', tradeController.ConfirmDelivery);

// Read asset(s)
router.post('/asset', tradeController.ReadAsset);
router.post('/assets', tradeController.GetAllAssets);

// Dedicated product endpoint
router.post('/products', tradeController.GetAllProducts);

module.exports = router;
