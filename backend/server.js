const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const chatRoute=require("./routes/chat");
const mongoose=require("mongoose");

const app=express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api', chatRoute);


const PORT=process.env.PORT || 5000;



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})


app.get("/", (req, res) => {
  res.send("Backend is alive!");
});


mongoose.connect(process.env.MONGO_URI,{})
.then(()=>console.log("Mongodb running"))
.catch((err)=>console.log("The error is", err));