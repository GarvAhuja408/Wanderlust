const Listing = require("../models/listing.js");

const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

const renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

const showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate( { path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing does'nt exists");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

const createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing (req.body.listing);
    newListing.image={url,filename}; 
    newListing.owner = req.user._id; 
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}

const editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does'nt exists");
        return res.redirect("/listings");
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace(
  "/upload",
  "/upload/w_250,h_200,c_fill"
);

    res.render("listings/edit.ejs",{listing,originalImageURL});
}

const updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};

        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

const destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}

module.exports = { index,renderNewForm,showListing,createListing,editListing,updateListing,destroyListing};

console.log("Listings controller loaded");