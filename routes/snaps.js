let express    	= require("express"),
	router     	= express.Router(),
 	passport   	= require("passport");
	Snap      	= require("../models/snap")
	              require('dotenv').config()

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'satcasm', 
  api_key: process.env.API_KEY, 
  api_secret:process.env.API_SECRET
});

router.get("/", (req, res)=>{
    res.render("landing");
});

router.get("/index", (req, res)=>{
    res.render("snaps/index");
});

router.get("/new", (req, res)=>{
    res.render("snaps/new");
});

router.post("/", upload.single('image'), async (req, res) =>{
	try {
		let result= await cloudinary.v2.uploader.upload(req.file.path);//async (err, result)=> {
		// add cloudinary url for the image to the campground object under image property
		req.body.snap.image = result.secure_url;
		// add image's public_id to campground object
		req.body.snap.imageId = result.public_id; 
		// This is gonna allow us to identify and delete the existing image whenever we upload a new one in its place in the edit 		  //form.
		// add author to campground
		req.body.snap.author = {
			id: req.user._id,
			username: req.user.username
		}
		let tagArray = await (req.body.snap.tags).split(",");
		req.body.snap.tags = tagArray;
		console.log(req.body.snap.tags);
		console.log(req.body.snap.name);
		console.log(req.body.snap);
		
	    let snap = await Snap.create(req.body.snap);
		// Snap.create() -> Every image -> Every tag -> Array store -> RemoveDuplicates()
		// save that array in database.
		
		//redirect back to campgrounds page
	    res.redirect("landing");
	} 
	catch(err) {
	  console.log(err);
	  req.flash('error', err.message);
	  res.redirect('back');
	}
	//});
});


module.exports = router;