import express from 'express';
import jwt from "jsonwebtoken";
import { Users, Profiles } from "../db/db.js";
import { AuthenticateUser } from '../middlewares/jwtcheckmw.js';


const router = express.Router();

let checkIfUserExists = async (username)=>{
    let foundName= await Users.findOne({username});
    if(foundName!=null && foundName.username === username)return true;
    else return false; 
}

router.post("/sign-up", async (req,res)=>{
    // check the username present in reqbody , if similar already in db then ask to enter other
    let {username , password} = req.body;
    try{
          
          if(!await checkIfUserExists(username))
          {
              let user = new Users({username , password});
              let profile = new Profiles();
              profile.username = username;
              let id = profile._id;
              try{
                await user.save();
                await profile.save();
                const secret = process.env.JWT_SECRET;
                 const token = jwt.sign({username}, secret, {expiresIn: "2 days"});
                 res.status(200).json({
                    msg: "User Registration successfull!",
                    Token: token,
                    id,
                })
                // res.status(200).json({msg: "User registration successfull!"})
              }
              catch(e){res.status(500).json({msg: "Error saving user"})}
              
          }
          else {
             res.status(500).json({msg: "Username already taken"});
          }
    }
    catch(err){
        console.log(err);
        res.status(404).json(err);
    }

});

router.post("/sign-in", async( req, res)=>{
     let {username,password} = req.body;
     try{
        if(await checkIfUserExists(username))
        {
            let founduser = await Users.findOne({username});
            let profile = await Profiles.findOne({username});
            let id= profile._id;
            if(founduser!=null && founduser.username==username && founduser.password==password)
            {
                 const secret = process.env.JWT_SECRET;
                 const token = jwt.sign({username}, secret, {expiresIn: "2 days"});
                 res.json({
                    msg: "User login successfull!",
                    Token: token,
                    id,
                })
                console.log("Logged in successfully!") 
            }
            else {
                console.log("login failed!");
                res.status(403).json({msg: "Incorrect Password"});
            }
        }
        else {
            console.log("login failed!");
            res.status(403).json({msg: "User doesn't exist"});
        }
     }
     catch (e) {
         console.log(e);
         res.status(403).json({msg:"Error loggin in !"});
     }
});

router.put("/sign-out" , async (req, res) => {

})

router.get("/verify",AuthenticateUser, async (req,res)=>{
     console.log("verification successful!");
     res.status(200).json({msg: "verification successful"});
});



export default  router;