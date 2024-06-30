import express from 'express';
import { ProductModel } from '../models/Productmodel.js';

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

productRouter.post("/create", async (req, res) => {
    const payload = req.body;
    // Assume you have authentication middleware that verifies JWT token and adds userID to req.body
    // const userID = req.body.userID;

    try {
        const newProduct = new ProductModel(payload);
        await newProduct.save();
        res.send({"msg" : "Product created successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

productRouter.patch("/update/:productID", async (req, res) => {
    const payload = req.body;
    const productID = req.params.productID;

    try {
        const product = await ProductModel.findOne({_id: productID});
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
        await ProductModel.findByIdAndUpdate({_id: productID}, payload);
        res.send({"msg": "Product updated successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

productRouter.delete("/delete/:productID", async (req, res) => {
    const productID = req.params.productID;
    try {
        await ProductModel.findByIdAndDelete(productID);
        res.send({"msg" : "Product deleted successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).send({"err" : "Something went wrong"});
    }
});

export { productRouter };
