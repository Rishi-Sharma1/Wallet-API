import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {initDB} from "./config/db.js"
import ratelimiter from "./middleware/rate.limitter.js";
import transactionsRoute  from "./routes/transactions.route.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();

if(process.env.NODE_ENV === "production"){
    job.start();
}

//middleware
app.use(cors());
app.use(express.json());
app.use(ratelimiter);



const PORT = process.env.PORT || 5001;


app.get("/api/health", (req,res)=>{
    res.status(200).json({status:"ok"})
})
app.use("/api/transactions", transactionsRoute);


initDB().then(() =>{
    app.listen(5000, () =>{
    console.log("Server is running on PORT", PORT);  
})
});



