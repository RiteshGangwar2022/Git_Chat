const mongoose = require("mongoose");
const User = require("../Database/Models/Userschema");
const bcrpt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");



//function to login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(req.body);

    if (!email || !password) {
      res.status(422).json({ error: "enter details properly" });
    }
    const user = await User.findOne({ email: email });

    if (user) {
      const ismatch = await bcrpt.compare(password, user.password);

      if (!ismatch) {
        res.status(422).json({ message: "invalid credential" });
      } else {
        //console.log(user);
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          token: generateJWT(user._id),
        });
      }
    } else {
      res.status(422).json({ message: "invalid credential" });
    }
  } catch (err) {
    res.status(422).json(err);
  }
};



//to register user
const Signup = async (req, res) => {
  const { name, email, password, Image } = req.body;
  /*console.log(req.body);
  console.log(name);
  console.log(email);
  console.log(password);*/

  //checking if any of the input is not filled
  if (!name || !email || !password) {
    res.status(422).json({ error: "fill all the data properly" });
  }

  try {
    //checking if user already exists in database or not , else create a new user
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(422).json({ error: "User already exists" });
    } else {
      const newuser = new User({ name, email, password, pic:Image });
      const data = await newuser.save();
      //console.log(data)
      if (newuser) {
        res.status(201).json({
          _id: newuser._id,
          name: newuser.name,
          email: newuser.email,
          isAdmin: newuser.isAdmin,
          pic: newuser.pic,
          token: generateJWT(newuser._id),
        });
      }
    }
  } catch (err) {
   // console.log(err);
    res.status(422).send(err);
  }
};




//to find users except the login one
const AllUsers =async (req, res) => {

  //we are getting search query from frontend's search bar
  //we are using $or operator to find user by email or name
  //$regex =>regular expression for pattern matching4
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search} },
          { email: { $regex: req.query.search } },
        ],
      }
    : {};
 
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });//getting all users other than login user=>{ $ne: req.user._id }
  res.send(users);
};

module.exports = { Login, Signup,AllUsers};
