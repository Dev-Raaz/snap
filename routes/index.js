let express    	= require("express"),
	router     	= express.Router(),
 	passport 	= require("passport"),
		Snap      	= require("../models/snap"),
	User 	    = require("../models/user");

require('dotenv').config();

let multer = require('multer');// Give default image then update if the user gives an image. ek soch
let storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter =  (req, file, cb)=> {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter})

let cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'satcasm', 
  api_key: process.env.API_KEY, 
  api_secret:process.env.API_SECRET
});

//root route
router.get("/", async (req, res)=>{
   try{
	    let snaps = await Snap.find();
		var tagsArr = [];
		await snaps.forEach( async (snap)=>{
			if(snap.tags.length>0){
				await snap.tags.forEach(async (tag)=>{
					if(!tagsArr.includes(tag))
						await tagsArr.push(tag);
				});
			}
		});
	    res.render("landing",{ssnaps: snaps,tagsArr});
	}
	 catch(err) {
	  req.flash('error', err.message);
	  res.redirect('back');
	}
});

// show register form
 router.get("/register", (req, res)=>{
   res.render("register", {page: "register"}); 
});

//handle sign up logic
 router.post("/register", upload.single('image'), async (req, res)=>{
	try{
		let result = await cloudinary.v2.uploader.upload(req.file.path); //(err, result)=> {
		// add cloudinary url for the image to the campground object under image property
		req.body.image = result.secure_url;
		// add image's public_id to campground object
		req.body.avatarId = result.public_id; 
		const newUser = new User({
			//username: req.body.username,
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			image: req.body.image,
			avatarId: req.body.avatarId
		});
		let user = await User.register(newUser, req.body.password);//, (err, user)=>{
		passport.authenticate("local")(req, res, ()=>{
		   console.log("user created");                                      
		   req.flash("success", "Welcome to ohhSnap " + user.username);
		   res.redirect("/snaps"); 
		});
	}
	catch(err){
		 req.flash("error", err.message);
     	 return res.redirect("/register");
	}
});

// show login form
 router.get("/login", (req, res)=>{
   res.render("login",{page: "login"}); 
});

// handling login logic
 router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/snaps",
        failureRedirect: "/login",
	    failureFlash: true,
	 	successFlash: "Welcome :)"
    }), (req, res)=>{
	 // req.flash("success", "Welcome to YelpCamp " + user.username);
});

// logic route
 router.get("/logout", async(req,res)=>{
	 try{
		  req.logout();
          req.flash("success", "Logged you out!");
   	 	  res.redirect("/");
	 }
	 catch(err){
		 console.log(err);
	 }
  
});

module.exports = router;