import express from "express";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
  res.send("Hello Docker !");
});

app.get("/restart", (req, res) => {
  

  exec("pm2 restart my-app", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting server: ${error.message}`);
      return res.status(500).send("Error restarting server");
    }
    console.log(`Server restarted: ${stdout}`);
    res.send("Server restarted successfully");
  });
});


app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
});

