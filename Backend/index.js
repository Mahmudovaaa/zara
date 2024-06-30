import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connection } from "./config/db.js"; // Assuming db.js exports connection using ES modules
import { UserModel } from "./models/Usermodel.js";
import { productRouter } from "./routes/productsroute.js";
import { cartRouter } from "./routes/cartroute.js";
import { authenticate } from "./middlewares/authentication.js";
import cors from 'cors'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("Welcome");
});

app.post("/signup", async (req, res) => {
    const { email, password, name, number } = req.body;
    try {
        const userPresent = await UserModel.findOne({ email });
        if (userPresent) {
            return res.send("Try logging in, user already exists");
        }
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                console.log(err);
                return res.status(500).send("Something went wrong, please try again later");
            }
            const user = new UserModel({ email, password: hash, name, number });
            await user.save();
            res.send("Signup successful");
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong, please try again later");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
                    res.send({ msg: "Login successful", token });
                } else {
                    res.status(401).send("Login failed");
                }
            });
        } else {
            res.status(401).send("Login failed");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong, please try again later");
    }
});

app.use("/products", productRouter);
// app.use(authenticate); // Uncomment this line if you want to apply authentication middleware globally
app.use("/cart", cartRouter);

app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB Successfully");
    } catch (err) {
        console.log("Error connecting to DB");
        console.error(err);
    }
    console.log(`Listening on port ${PORT}`);
});
