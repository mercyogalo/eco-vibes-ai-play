const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const chatRoute=require("./routes/chat");

const app=express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api', chatRoute);


const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})