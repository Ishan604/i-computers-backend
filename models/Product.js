import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productID : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    altName : {
        type : [String], //alternative names in array
        default : []
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    labeledPrice : {
        type : Number,
        required : true
    },
    images : {
        type : [String],
        required : true
    },
    category : {
        type : String,
        required : true
    },
    brand : {
        type : String,
        required : true,
        default : 'Not specified'
    },
    stock : {
        type : Number,
        required : true,
        default : 0
    },
    isAvailable : {
        type : Boolean,
        default : true
    }
})

const Product = mongoose.model('Product' , productSchema); //created the table Product by parsing the model using mongoose
export default Product;

