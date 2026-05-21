import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;

    const token =
      cookieToken ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
