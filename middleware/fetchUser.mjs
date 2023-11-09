import jwt from "jsonwebtoken";

export default function fetchUser(req, res, next) {
    // Get the user from jwt token and add id to req object 
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send('Please authenticate using a valid token');
    }
    try {
        const VerifyToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = VerifyToken.userId;

        next();

    } catch (error) {
        return res.status(401).send('Please authenticate using a valid token', error);

    }
}
