import jwt from "jsonwebtoken";

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log(token);
  return res.cookie("token", token, {
    httpOnly: true,

    sameSite: "strict", // or "lax" based on your preference
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
