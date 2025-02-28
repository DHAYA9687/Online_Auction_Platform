import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"Access denied. No token provided."});
    }
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(err){
        res.status(401).json({ message: "Invalid or expired token." });
    }
};