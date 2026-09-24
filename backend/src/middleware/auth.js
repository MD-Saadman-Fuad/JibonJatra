import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];
    if (token) {
      const jwtSecret = process.env.JWT_SECRET || "jibonjatra_secret_key_2026";
      const decoded = jwt.verify(token, jwtSecret);
      req.user = {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email
      };
    }
  } catch (err) {
    req.user = null;
  }
  next();
};

export default (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    try {
      const token = (req.headers.authorization || "").split(" ")[1];
      if (!token) return res.status(401).json({ message: "No Token" });

      const jwtSecret = process.env.JWT_SECRET || "jibonjatra_secret_key_2026";
      const decoded = jwt.verify(token, jwtSecret);
      req.user = {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
};
