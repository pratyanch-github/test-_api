import express from "express";
let app= express();


app.get("/",(req,res)=>{
    res.status(200).send("Server working fine");
})
app.get("/all",(req,res)=>{
    res.status(200).send("All users");
})
app.get("/profile/:id",(req,res)=>{
    let id= req.params.id;
    res.status(200).send("id is " + id);
})

app.listen(5000, ()=>{
    console.log("listening on port 5000");
});
