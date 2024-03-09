import Product from "../models/Product.js";
import express from "express";

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
  console.log(product);
  await product.save(); // whenever we are saving something in our database we used await method because product may takes some time to save
  res.json({
    success: true,
    name: req.body.name,
  });
});

//API for deleting products--
routes.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//API for Getting all products
routes.get("/allproduct", async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
});

export { routes as productRoute };
