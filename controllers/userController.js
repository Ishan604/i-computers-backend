import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export function createUser(req, res){
    try{
        const userDetails = req.body; // Get user details from request body
        const hashedPassword = bcrypt.hashSync(userDetails.password, 10); // Hash the password 10 times
        const user = new User({
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            password: hashedPassword,
            role: userDetails.role
        });

        user.save()
        res.json({ message: "User created successfully" });
    }
    catch(error){
        console.error("Error creating user:", error);
        res.json({ message: "Internal server error" });
    }
}

export function loginUser(req, res){
    try{
        const email = req.body.email; // Get email from request body
        const password = req.body.password; // Get password from request body

        User.find({email: email}).then((users) => { // Find user by email
            if(users[0] == null){ //users is an list of array , in case of no user it will return json
                res.json({ message: "User not found" });
            }
            else{
                const user = users[0]; // Get the first user from the array
                //console.log(user);
                const passwordMatch = bcrypt.compareSync(password, user.password); // Compare provided password with hashed passwordif

                if(passwordMatch){
                    const payload = { // Create a payload with user details for the encrption
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                        image: user.image
                    }

                    const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : "48h"}); 
                    // Create a JWT token with the payload and secret key
                    res.json({ matching : passwordMatch, message: "Login successful", token: token, role: user.role  }); // Send response with token
                }
                else{
                    res.json({ matching : passwordMatch, message: "Invalid password" });
                }
            }
        }) 
    }
    catch(error){
        console.error("Error logging in user:", error);
        res.json({ message: "Internal server error" });
    }
}


export function isAdmin(req){
    if(req.user == null){
        return false; // if the user is not logged in stop the further execution
    }
    if(req.user.role != 'admin'){
        return false; // if the user is not admin stop the further execution
    }
    return true; // if the user is admin continue the further execution
}

