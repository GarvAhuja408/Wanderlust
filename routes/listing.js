const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const { listingSchema } = require("../schema.js");  //hop side validation use joi
// const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings")

//image upload package
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));
    

//aNEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports = router;


// original

//INDEX ROUTE
// router.get("/",wrapAsync(listingController.index));

//aNEW ROUTE
// router.get("/new",isLoggedIn,listingController.renderNewForm)

//SHOW ROUTE
// router.get("/:id",wrapAsync(listingController.showListing));

//CREATE ROUTE
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));


// console.log("editForm:", typeof listingController.editListing);
// console.log("destroyListing:", typeof listingController.destroyListing);
//Edit ROUTE
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//UPDATE ROUTE
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))


//DELETE ROUTE
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// module.exports = router;