const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const chatRoute=require("./routes/chat");
const mongoose=require("mongoose");
const scrapeRoutes = require("./routes/scrapeRoutes");
const policyRoutes = require("./routes/policyRoutes");
const cron = require("node-cron");
const runScraper = require("./utils/scrape-auto");


const app=express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api', chatRoute);


app.use("/api/scrape", scrapeRoutes);
app.use("/api/policies", policyRoutes);



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


// Run scraper every 6 hours
cron.schedule("0 */6 * * *", () => runScraper());
