import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader= req.header.authorization;
    if(!authHeader){
        return res.status(401).json(
            {error: "Token gereklidir"}
        )
    }
    const token= authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json(
            {error: "Geçersiz token formatı"}
        )
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json(
            {error:"Geçersiz token"}
        );
    }

};

export default verifyToken;