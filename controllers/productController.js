import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req, res){
    if(isAdmin(req) === false){
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    try{
        const product = new Product(req.body); // Create a new Product instance with request body data
        product.save();
        res.status(201).json({ message: "Product created successfully" });
    }
    catch(error){
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export function getAllProducts(req, res){
    if(isAdmin(req)){ //only admin can see all the products
        Product.find().then(
            (products) => { // Fetch all products from the database
                res.json(products);
            }
        ).catch(error => {
                console.error("Error fetching products:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        );
    }
    else{ // normal user can see only available products
        Product.find({isAvailable : true}).then(
            (products) => { // Fetch all products from the database
                res.json(products);
            }
        ).catch(error => {
                console.error("Error fetching products:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        );
    }
}

export function deleteProduct(req , res){
    
    if(!isAdmin(req)){
        res.status(403).json({message : "Only admin can delete products!"})
        return;
    }
    else{
        const productId = req.params.productID; //get the requested parameter id
        Product.deleteOne({productID : productId}).then(
            res.status(200).json({message : "Product deleted successfully!"})
        ).catch(error => {
            console.error("Error while deleting product :" , error);
            res.status(400).json({message : "Error while deleting product"})
        })
    }

}

export function updateProduct(req , res){
    if(!isAdmin(req)){
        res.status(403).json({message : "Only admin can update products!"})
        return;
    }
    else{
        const productId = req.params.productID;
        Product.updateOne({productID : productId} , req.body).then( //add the id and updated body of the respective id
            () =>{
                res.status(200).json({message : "Product updated successfully!"})
            }
        ).catch(error => {
            console.log("Error while deleting! ", error);
            res.status(400).json({message : "Error while deleting!"})
        })
    }
}

export function getProductByID(req , res) {
  const productId = req.params.productID;
  Product.findOne({ productID: productId })
    .then((product) => {
      if (product != null) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "The product details are not found!" });
        return;
      }
    })
    .catch((error) => {
      console.error("Error while getting the details of " + productId, error);
      res.status(500).json({ message: "Error while getting the data" });
    });
}

//if we want to use await, we need pass async before the function or we can directly use await without async in the index.js file