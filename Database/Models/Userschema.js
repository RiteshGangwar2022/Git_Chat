const mongoose = require("mongoose");
const bcrypt=require("bcrypt");

const Userschema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    tokens://saves array of objects(for JWT authentication)
    [
        {
          token:{
            type:String,
            required:true
          }
        }
    ],
  },
  { timestaps: true }
);

//to hash password before saving, w need to put a middleware 
//pre function takes two argumnets ("fn before which we need to call",next())
Userschema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



const User = mongoose.model("User", Userschema);
module.exports = User;