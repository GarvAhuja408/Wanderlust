const User = require("../models/user.js")


const renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};


const signUp = async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newuser = new User({email,username});
        const registeredUser = await User.register(newuser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

const renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};


const login = async(req,res)=>{
    req.flash("success","Welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "listings";
    res.redirect(redirectUrl);
}

const logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}

module.exports = {signUp,renderSignUpForm,renderLoginForm,login,logout}