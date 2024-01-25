import express from 'express';
import jwt from "jsonwebtoken";
import { Users, Profiles } from "../db/db.js";
import { AuthenticateUser } from '../middlewares/jwtcheckmw.js';
const profileRouter= express.Router();


// getting all profiles for guests
profileRouter.get("/all", async(req, res )=>{
   try{
        let profileList =  await Profiles.find();
        res.status(200).json(profileList);
   }
   catch(err){
      console.log(err);
      res.status(500).json({err});
   }
})

// get profile with id ----> returns a single profile object
profileRouter.get("/:id", async(req, res, next)=>{
    const id = req.params.id;
    try{
         let profileFound = await Profiles.findOne({_id: id});
         if(profileFound!=null && profileFound._id==id)
         {
            res.status(200).json(profileFound);  
         }
    }
    catch(e){
       res.status(500).json({e});
    }
})

// updating profile of a single user, in request we get new profile -----> updates profile and returns success message
profileRouter.put("/:id",AuthenticateUser, async(req, res)=>{
    const id = req.params.id;
    try{
         let profileFound = await Profiles.findOne({_id: id});
         if(profileFound!=null && profileFound._id==id)
         {
            let payload = req.body; // assuming req.body contains the data you want to update
            let updatedProfile = await Profiles.findByIdAndUpdate(id, payload, { new: true });
            res.status(200).json({msg: "Profile updated successfully"});  
         }
    }
    catch(e){
       res.status(500).json({err});
    }
})

profileRouter.delete("/:id", AuthenticateUser, async (req, res) => {
    let id = req.params.id;
    let { username } = req.body;

    try {
        // finding user for userid
        let user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        // finding profile of user to delete
        let foundUser = await Users.findByIdAndDelete(user._id);
        if (foundUser) {
            let foundProfile = await Profiles.findByIdAndDelete(id);

            if (foundProfile) {
                console.log("Profile deleted");
                res.status(200).json({ msg: "Profile deleted successfully" });
            } else {
                res.status(404).json({ msg: "Profile not found" });
            }
        } else {
            res.status(404).json({ msg: "User not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Internal server error" });
    }
});

export default profileRouter;