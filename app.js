
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapasync.js")
const ExpressError = require("./utils/ExpressError.js")
// const listingSchema = require("./schema.js");  //hop side validation use joi
// const reviewSchema = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session"); //using sessions
const flash = require("connect-flash"); //using flash
const MongoStore = require('connect-mongo');

const passport = require("passport"); //passport for authentication
const LocalStrategy = require("passport-local"); //passport for authentication
const User = require("./models/user.js"); //user model  //passport for authentication

const listingRouter= require("./routes/listing.js"); //for using /listings
const reviewsRouter= require("./routes/review.js"); //for using /reviews
const userRouter = require("./routes/user.js"); //for user user.js

const dbUrl = process.env.ATLASDB_URL;

// console.log("DB URL =", process.env.ATLASDB_URL);

if (!dbUrl) {
    console.error("ATLASDB_URL is missing in .env file");
    process.exit(1);
}

const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto :{
        secret:process.env.SECRET
    },
    touchAfter : 24*3600,
});

store.on( "error" ,(err)=>{
    console.log("Error in mongo session store",err)
})

//using sessions
const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 *1000,
        httpOnly:true,
    }
}


//using sessions
app.use(session(sessionOptions));

//using flash
app.use(flash())


//passport for authentication
app.use( passport.initialize() );
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser()); //passport for authentication
passport.deserializeUser(User.deserializeUser()); //passport for authentication

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname,"public"))); //to use public/css/style.css


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;




async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to DB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
main();

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Delhi,India",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessfull testing")
// })

//joi validate listing

app.use("/listings",listingRouter); //for using /listings
app.use("/listings/:id/reviews",reviewsRouter); //for using /listings
app.use("/users",userRouter);

app.get("/", (req, res) => {
    res.render("listings/index.ejs");
});


// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"dstudent"
//     });

//     let registereduser = await User.register(fakeuser,"helloworld")
//     res.send(registereduser);
// })
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found !"));
// })

//localhost:8080/random
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

