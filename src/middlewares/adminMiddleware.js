const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    if (decoded.userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    req.userName = decoded.userName;
    req.userId = decoded.userId;
   
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminMiddleware;