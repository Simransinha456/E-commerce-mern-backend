import Product from "../models/Product.js";
import UserModel from '../models/User.js'
import express from "express";
import jwt from 'jsonwebtoken' 

const routes = express.Router();
routes.use(express.json());

//API for adding products
routes.post("/addproduct", async (req, res) => {
  //boundry condition
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    // if in databse there is no product
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  // console.log(product);
  await product.save(); // whenever we are saving something in our database we used await method because product may takes some time to save
  res.json({
    success: true,
    name: req.body.name,
  });
});

//API for deleting products--
routes.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  // console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//API for Getting all products
routes.get("/allproduct", async (req, res) => {
  let products = await Product.find({});
  // console.log("All products fetched");
  res.send(products);
});

// Creating api for newcollection data
routes.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  // console.log("newcollection fetched");
  res.send(newcollection);
});

//creating Api for popular in women data
routes.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});
//creating middleware to fetch user
const verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({
      errors: "Please authenticate using valid token",
    });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      // console.log(data)
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Something error in Validation" });
    }
  }
};

//creating api for adding products in cartdata
routes.post("/addtocart", verifyToken, async (req, res) => {
  console.log("added product", req.body.itemId);

  try {
    let userData = await UserModel.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).send("User not found");
    }
    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).send("Item ID is required");
    }
    if (!userData.cartData) {
      userData.cartData = {}; // Initialize cartData if not already initialized
    }
    userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;

    await UserModel.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

//creating for removeproduct
// routes.post('/removefromcart', verifyToken, async (req,res)=>{
//   console.log("removed product", req.body.itemId);
//   let userData = await UserModel.findOne({ _id: req.user.id });
//   if(userData.cartData[req.body.itemId]>0)
//   userData.cartData[itemId] = (userData.cartData[itemId] || 0) - 1;
//   await UserModel.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//   res.send("Removed");
// })


routes.post('/removefromcart', verifyToken, async (req, res) => {
  try {
    console.log("Removing product", req.body.itemId);
    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({ success: false, error: "Item ID is required" });
    }

    const userData = await UserModel.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const cartItemQuantity = userData.cartData[itemId] || 0;
    if (cartItemQuantity <= 0) {
      return res.status(400).json({ success: false, error: "Item not in cart" });
    }

    // Decrement the quantity
    userData.cartData[itemId] = cartItemQuantity - 1;
    await UserModel.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


//creating api for cartdatad
routes.post('/getcart', verifyToken, async(req, res)=>{
  console.log("Getcart");
  let userData = await UserModel.findOne({_id:req.user.id});
  res.json(userData.cartData);
})
//now link this Api wih frontend in Shopcontext


export { routes as productRoute };
