import express from 'express';
import mongoose from 'mongoose';
import { setDefaultResultOrder } from 'node:dns';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

setDefaultResultOrder('ipv4first');

const connectionString = process.env.MONGO_URL; // Get the MongoDB connection string from environment variables
mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to database"); //check the database is connect or not
    }
)

const app = express(); // Create an Express application //the app means the backend application

app.use(cors()); // Enable CORS for all routes , allowing cross-origin requests

app.use(express.json()); // Middleware to parse JSON bodies

app.use((req, res , next) => {

    const header = req.header('Authorization'); // Get the Authorization header from the request
    if(header != null){
        const token = header.replace('Bearer ' , ''); // Extract the token by removing the 'Bearer ' prefix
        //console.log(token);
        jwt.verify(token , process.env.JWT_SECRET ,  // Verify the token using the secret key from environment variables
            (error , content) => { // Callback function to handle verification result
                if(content != null){
                    //console.log(content);
                    req.user = content; // Attach the decoded content to the request object for further use
                    next(); // Call the next middleware or route handler
                }
                else{
                    //console.error("Error verifying token:", error); // If verification fails, log the error
                    res.json({message : "Invalid token"}); // If verification fails, send an "Invalid token" response
                    return; // if the token is invalid stop the further execution
                }
            }
        ); // Verify the token using the secret key (start the decryption)
    }
    else{
        next(); // If no Authorization header is present, proceed to the next middleware or route handler
    }
    //console.log(header);

})


app.use('/api/users' , userRouter); // Use the userRouter for routes starting with /user

app.use('/api/products' , productRouter); // Use the productRouter for routes starting with /products

app.listen(3000, () =>  // Start the server on port 3000
    { 
        console.log('Server is running on port 3000');
    })


