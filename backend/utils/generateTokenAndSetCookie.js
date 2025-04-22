import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user) => {
  console.log("generateTokenAndSetCookie:", user);
  const token = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //only works in https
    samesite: "strict", //prevents csrf attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
