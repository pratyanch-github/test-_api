import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Profiles, Users } from "../db/db.js";

dotenv.config();

export const AuthenticateUser = async(req, res, next) => {

    const username = req.body.username || req.query.user;
    const authHeader = req.headers.authorization;
    const JWT_SECRET = process.env.JWT_SECRET;

    console.log("in auth middleware")
    console.log(authHeader);
    
    // console.log(username, TOKEN)

    if (username && authHeader) {
        // const TOKEN = authHeader.split(" ")[1]
        const TOKEN = authHeader;

        // console.log(TOKEN)

        if (TOKEN) {
            try {
                // console.log(jwt.verify(TOKEN, JWT_SECRET))

                const decoded = jwt.verify(TOKEN, JWT_SECRET);
                if (decoded.username === username) {

                    // username and profile_id should match
                    let foundProfile = await Profiles.findOne({username})
                    if(foundProfile!=null && foundProfile._id == req.params.id)
                    {
                        next();
                    }
                    else res.status(500).json("Trying to access Another User");
                }
                else {
                    console.log("User authentication failed: " + username + " " + TOKEN)
                    res.status(408).json({
                        msg: "Authentication failed! (Malicious attempt)"
                    })
                }
            }
            catch (err) {
                console.log("User authentication failed: " + username + " " + TOKEN)
                res.status(408).json({
                    msg: "Authentication failed!",
                    err
                })
            }
        }
        else {
            console.log("User authentication failed: " + username + " " + "NO TOKEN")
            res.status(408).json({
                msg: "Authentication failed!"
            })
        }
    }
    else {
        console.log("User authentication failed: " + "username and TOKEN are not provided in Headers")
        res.status(408).json({
            msg: "Authentication failed! (No token found in Headers)",
        })
    }
}

