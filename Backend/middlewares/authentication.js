import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, 'hush');
            if (decoded) {
                const userID = decoded.userID;
                req.body.userID = userID;
                next();
            } else {
                res.send("Please login");
            }
        } catch (error) {
            res.status(401).send("Invalid token");
        }
    } else {
        res.status(401).send("Please login");
    }
};

export { authenticate };
