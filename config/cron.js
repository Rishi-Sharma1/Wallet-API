import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/4 * * * *", function (){
    https
        .get(process.env.API_URL, (res)=>{
            if(res.statusCode === 200) console.log("GET request sent successfully");
            else console.log("GET request failed with status code: ", res.statusCode);
        })
        .on("error",(e)=>console.error("Error while sending request", e))
});

export default job;