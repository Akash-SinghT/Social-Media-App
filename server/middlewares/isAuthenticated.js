import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token; // Correctly access cookies from req.cookies
    // If no token is provided, return an error
    console.log(token);
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        sucess: "true",
      });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }

    // Add user ID to request object
    req.id = decoded.userId; // Assuming userId(will be same as used in token creation) is stored in the token payload  it's like doring id in variable

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    // Handle token errors (expired or invalid token)
    res.status(401).json({
      message: "Internal Server error",
    });
  }
};

export default isAuthenticated;
