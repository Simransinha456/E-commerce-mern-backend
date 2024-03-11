// User schema
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object}, 
  date: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("UserModel", UserSchema); // usermodels will show in database
export default UserModel;
