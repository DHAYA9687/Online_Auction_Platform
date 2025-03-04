import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    const twoMinutesLater = new Date(Date.now() + 2 * 60 * 1000).toISOString();
    console.log(twoMinutesLater);
    if (!token) {
        console.log("token is missing");
        return res.status(401).json({ message: "Access denied. No token provided." });

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: " Invalid token." })
        }
        req.user_id = decoded.id;
        next();

    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};