'use strict';

const { Contract } = require('fabric-contract-api');

class TradeContract extends Contract {

    // -------------------------
    //  Exporter: Add Consumer
    // -------------------------
    async AddConsumer(ctx, consumerId, name, country) {
        const exists = await ctx.stub.getState(consumerId);
        if (exists && exists.length > 0) throw new Error("Consumer already exists");

        const consumer = {
            consumerId,
            name,
            country,
            type: "Consumer"
        };

        await ctx.stub.putState(consumerId, Buffer.from(JSON.stringify(consumer)));
        return JSON.stringify(consumer);
    }

    // -------------------------
    // Exporter: Add Products
    // -------------------------
    async AddProduct(ctx, productId, name, price) {
        const exists = await ctx.stub.getState(productId);
        if (exists && exists.length > 0) throw new Error("Product already exists");

        const product = {
            productId,
            name,
            price: parseFloat(price),
            type: "Product"
        };

        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));
        return JSON.stringify(product);
    }


    async GetAllProducts(ctx) {
    const iterator = await ctx.stub.getStateByRange("", "");
    const products = [];
    let res = await iterator.next();

    while (!res.done) {
        const asset = JSON.parse(res.value.value.toString("utf8"));
        if (asset.type === "Product") {
            products.push(asset);
        }
        res = await iterator.next();
    }

    return JSON.stringify(products);
}

    // -------------------------
    // Importer: Create Customs
    // -------------------------
    async CreateCustom(ctx, customId, officerName) {
        const exists = await ctx.stub.getState(customId);
        if (exists && exists.length > 0) throw new Error("Custom officer exists");

        const custom = {
            customId,
            officerName,
            type: "Custom"
        };

        await ctx.stub.putState(customId, Buffer.from(JSON.stringify(custom)));
        return JSON.stringify(custom);
    }

    // -------------------------
    // Importer: Create Tokens
    // -------------------------
    async CreateToken(ctx, tokenId, owner, amount) {
        const exists = await ctx.stub.getState(tokenId);
        if (exists && exists.length > 0) throw new Error("Token already exists");

        const token = {
            tokenId,
            owner,
            amount: parseFloat(amount),
            type: "Token"
        };

        await ctx.stub.putState(tokenId, Buffer.from(JSON.stringify(token)));
        return JSON.stringify(token);
    }

    // -------------------------
    // Consumer: Create Order
    // -------------------------
    async CreateOrder(ctx, orderId, consumerId, productId, quantity, tokenId) {
        const consumer = await ctx.stub.getState(consumerId);
        if (!consumer || consumer.length === 0) throw new Error("Consumer not found");

        const product = await ctx.stub.getState(productId);
        if (!product || product.length === 0) throw new Error("Product not found");

        const token = await ctx.stub.getState(tokenId);
        if (!token || token.length === 0) throw new Error("Token not found");

        const prod = JSON.parse(product.toString());
        const tok = JSON.parse(token.toString());

        const total = prod.price * parseFloat(quantity);

        if (tok.amount < total) throw new Error("Insufficient token balance");

        const order = {
            orderId,
            consumerId,
            productId,
            quantity,
            total,
            tokenId,
            deliveryConfirmed: false,
            type: "Order"
        };

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));
        return JSON.stringify(order);
    }

    // -------------------------
    // Consumer: Confirm Delivery
    // Auto token → Exporter
    // -------------------------
    async ConfirmDelivery(ctx, orderId, exporterWallet) {
        const orderData = await ctx.stub.getState(orderId);
        if (!orderData || orderData.length === 0) throw new Error("Order not found");

        const order = JSON.parse(orderData.toString());

        if (order.deliveryConfirmed) throw new Error("Delivery already confirmed");

        // Fetch token info
        const tokenData = await ctx.stub.getState(order.tokenId);
        const token = JSON.parse(tokenData.toString());

        if (token.amount < order.total) throw new Error("Insufficient token balance");

        // Deduct from consumer token and transfer to exporter
        token.amount -= order.total;

        await ctx.stub.putState(order.tokenId, Buffer.from(JSON.stringify(token)));

        // Create Exporter token receipt (optional)
        const receipt = {
            receiptId: `receipt_${orderId}`,
            exporterWallet,
            amountReceived: order.total,
            timestamp: Date.now()
        };

        await ctx.stub.putState(receipt.receiptId, Buffer.from(JSON.stringify(receipt)));

        // Mark order as delivered
        order.deliveryConfirmed = true;

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

        return JSON.stringify({
            message: "Delivery confirmed & payment released",
            receipt
        });
    }

    // -------------------------
    // Get Asset
    // -------------------------
    async ReadAsset(ctx, id) {
        const data = await ctx.stub.getState(id);
        if (!data || data.length === 0) throw new Error("Asset not found");
        return data.toString();
    }

    // -------------------------
    // Get All Assets
    // -------------------------
    async GetAllAssets(ctx) {
        const iterator = await ctx.stub.getStateByRange("", "");
        const results = [];
        let res = await iterator.next();

        while (!res.done) {
            const strValue = res.value.value.toString("utf8");
            results.push(JSON.parse(strValue));
            res = await iterator.next();
        }
        return JSON.stringify(results);
    }
}

module.exports = TradeContract;
