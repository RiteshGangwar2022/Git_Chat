const jwt = require("jsonwebtoken");
const User = require("../Database/Models/Userschema.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

        //header autherization comes with bearer and token

        //so, we are splitting token from bearer
      token = req.headers.authorization.split(" ")[1];

      //decodes token id by comparing with JWT secret key stored in .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

       //after verification, return user details without its password using select
      req.user = await User.findById(decoded.id).select("-password");


      //as it is middleware , we need to go to next function after authentication
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };