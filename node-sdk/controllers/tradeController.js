'use strict';

const { getContract } = require('../fabric/gateway');

module.exports = {
    // -------------------------
    // Exporter: Add Consumer
    // -------------------------
    AddConsumer: async (req, res) => {
        try {
            const { identity, consumerId, name, country } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.submitTransaction('AddConsumer', consumerId, name, country);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Exporter: Add Product
    // -------------------------
    AddProduct: async (req, res) => {
        try {
            const { identity, productId, name, price } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.submitTransaction('AddProduct', productId, name, price);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Importer: Create Customs
    // -------------------------
    CreateCustom: async (req, res) => {
        try {
            const { identity, customId, officerName } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.submitTransaction('CreateCustom', customId, officerName);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Importer: Create Token
    // -------------------------
    CreateToken: async (req, res) => {
        try {
            const { identity, tokenId, owner, amount } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.submitTransaction('CreateToken', tokenId, owner, amount);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Consumer: Create Order
    // -------------------------
    CreateOrder: async (req, res) => {
        try {
            const { identity, orderId, consumerId, productId, quantity, tokenId } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.submitTransaction('CreateOrder', orderId, consumerId, productId, quantity, tokenId);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Consumer: Confirm Delivery
    // -------------------------
    ConfirmDelivery: async (req, res) => {
        try {
            const { identity, orderId, exporterWallet } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.submitTransaction('ConfirmDelivery', orderId, exporterWallet);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Read single asset
    // -------------------------
    ReadAsset: async (req, res) => {
        try {
            const { identity, id } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.evaluateTransaction('ReadAsset', id);
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Get all products
    // -------------------------
    GetAllProducts: async (req, res) => {
        try {
            const { identity } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.evaluateTransaction('GetAllProducts');
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // -------------------------
    // Get all assets (fallback)
    // -------------------------
    GetAllAssets: async (req, res) => {
        try {
            const { identity } = req.body;
            const { contract, gateway } = await getContract(identity);
            const result = await contract.evaluateTransaction('GetAllAssets');
            await gateway.disconnect();
            res.json({ success: true, result: JSON.parse(result.toString()) });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
};
