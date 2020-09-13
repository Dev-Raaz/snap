const Snap  = require("../models/snap");

let middlewareObj = {};

middlewareObj.checkSnapOwnership = (req, res, next)=> {
 if(req.isAuthenticated()){
	Snap.findById(req.params.id, (err, foundSnap)=>{
	   if(err || !foundSnap){
		   //console.log(err);
		   req.flash("error", "Campground not found");
		   res.redirect("back");
	   } 
	    else{
		   // does user own the campground?
			if(foundSnap.author.id.equals(req.user._id)) {
				next();
			} else {
			 req.flash("error", "You don't have permission to do that");
			 res.redirect("back");
			}
	   }
	});
  } 
  else{
		req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
	  req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;