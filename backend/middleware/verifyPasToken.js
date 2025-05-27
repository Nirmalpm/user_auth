import jwt from "jsonwebtoken";

export const verifyToken = (roles = []) => {
  // roles can be a single role string or an array
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    const token = req.cookies.pas_token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized - Invalid token" });
      req.employee = decoded;

      const hasRole =
        roles.length && roles.some((role) => req.employee.roles.includes(role));

      if (roles.length && !hasRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.log("Error in verify token", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
};
