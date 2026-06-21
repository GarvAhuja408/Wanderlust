const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js")
// const listingSchema = require("../schema.js");  //hoppscotch side validation use joi
const {reviewSchema }= require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//joi validation
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body); //joi
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

// console.log("editForm:", typeof reviewController.createReview);
// console.log("destroyListing:", typeof reviewController.destroyReview);
//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;