import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    number: Number
});

const UserModel = model("user", userSchema);

export { UserModel };
