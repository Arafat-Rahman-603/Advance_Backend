import express from "express";
import "dotenv/config";


const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req,res)=>{
  res.send("Hello Docker!")
})

app.listen(PORT,()=>{
  console.log("Server is running on port",PORT)
})

