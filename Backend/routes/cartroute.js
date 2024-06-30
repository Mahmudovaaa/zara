import express from 'express';
import { CartModel } from '../models/Cartmodel.js';

const cartRouter = express.Router();

cartRouter.get("/", async (req, res) => {
    try {
        const cartData = await CartModel.find();
        res.send(cartData);
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

cartRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const newProduct = new CartModel(payload);
        await newProduct.save();
        res.send({"msg" : "Added product in cart successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

cartRouter.patch("/update/:productID", async (req, res) => {
    const payload = req.body;
    const productID = req.params.productID;
    try {
        const product = await CartModel.findOne({_id: productID});
        if (!product) {
            return res.status(404).send({"msg": "Product not found"});
        }
        // Assume you have userID available from authentication middleware
        // const userID = req.body.userID;
        // For now, let's assume you have it in req.body.userID
        const userID = req.body.userID;
        if (userID !== product.userID) {
            return res.status(403).send({"msg": "Not authorized"});
        }
        await CartModel.findByIdAndUpdate({_id: productID}, payload);
        res.send({"msg": "Product updated successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

cartRouter.delete("/delete/:productID", async (req, res) => {
    const productID = req.params.productID;
    try {
        await CartModel.findByIdAndDelete(productID);
        res.send({"msg" : "Product deleted successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

export { cartRouter };
