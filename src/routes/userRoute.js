import UserModel from "../models/User.js";
// import UserModel from "../../server/models/User.js";
import express from "express";
import jwt from "jsonwebtoken";

const routes = express.Router();
routes.use(express.json());

//routing
routes.post("/signup", async (req, res) => {
  try {
    // console.log(req.body.email)
    let check = await UserModel.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "existing user found with same email address",
      });
    }
    // console.log("result")
    let cart = {}; // empty cart data
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const user = new UserModel({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    // console.log(user)
    await user.save();
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
export { routes as userRoute };

//explanation
//using this API(/signup) we are creating user and checking
//1st if user has already existing email it will give succcess false and error msj after---> if there is no user we are creating empty cart and using this cart we are creating newuser where we will add name, email, password, cartdata after--> the created user saved in database using user.save method  after--> we are creating the token using this object const data where we have user key and inside that we have id  after--> data object creation we are generating the token using jwt.sign method.

//Login route----------
routes.post("/login", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const passwordCompare = req.body.password === user.password;
      if (passwordCompare) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token });
      } else {
        res.json({ success: false, errors: "Wrong Password" });
      }
    } else {
      res.json({ success: false, errors: "Wrong Email Id" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
