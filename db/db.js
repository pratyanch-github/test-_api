import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGO_URL)


console.log("connection established");


const userSchema = mongoose.Schema({
    username: String,
    password: String,
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile',
    }
})

const profileSchema = mongoose.Schema({
    username: String,
    name : String,
    gravatar : String,
    techStack : {
        type: [String],

    },
    bio: String,
    location: String,
    fieldOfInterest: {
        type: [String],
    },
    seeking: {
        type: [String],
    },
    github_url: String,
    twitter_url: String,
    linkedin_url: String,
    website_url: String,
   
})


export const Users = mongoose.model('users', userSchema)
export const Profiles = mongoose.model('profiles', profileSchema)




