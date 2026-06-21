const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then( ()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map( (obj)=> ({ 
        ...obj,owner: new mongoose.Types.ObjectId("6a2fcb73d899b5c0381c5088")
    }));
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB();