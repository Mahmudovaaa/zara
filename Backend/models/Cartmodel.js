import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    name: String,
    price: String,
    image: String,
    image1: String,
    image2: String,
    quantity: Number,
    size: String,
    materialdesc: String,
    materialtype: String,
    care: String,
    origin: String,
    color: String,
});

const CartModel = model("cart", cartSchema);

export { cartSchema, CartModel };
