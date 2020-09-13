let express    	= require("express"),
	router     	= express.Router(),
 	passport   	= require("passport");
	Snap      	= require("../models/snap"),
	middleware   = require("../middleware"),

	              require('dotenv').config();

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

router.get("/", async (req, res)=>{
	try{
		// console.log(author.id);
		// console.log(req.user);
	    let snaps = await Snap.find({"author.id" : req.user._id});
		var tagsArr = [];
		await snaps.forEach( async (snap)=>{
			if(snap.tags.length>0){
				await snap.tags.forEach(async (tag)=>{
					if(!tagsArr.includes(tag))
						await tagsArr.push(tag);
				});
			}
		});
	    res.render("snaps/index",{ssnaps: snaps,tagsArr});
	}
	 catch(err) {
	  req.flash('error', err.message);
	  res.redirect('back');
	}
});

router.post("/",middleware.isLoggedIn, upload.single('image'), async (req, res) =>{
	try {
		let result= await cloudinary.v2.uploader.upload(req.file.path);//async (err, result)=> {
		req.body.snap.image = result.secure_url;
		req.body.snap.imageId = result.public_id; 
		req.body.snap.author = {
			id: req.user._id,
			username: req.user.username
		}
		let tagArray = await (req.body.snap.tags).split(",");
		req.body.snap.tags = tagArray;
	    let snap = await Snap.create(req.body.snap);
	    res.redirect("/snaps");
	} 
	catch(err) {
	  req.flash('error', err.message);
	  res.redirect('back');
	}
});

router.get("/new",middleware.isLoggedIn,(req, res)=>{
    res.render("snaps/new");
});

router.delete("/:id",middleware.checkSnapOwnership, async(req, res)=>{
	try{
		let foundSnap = await Snap.findById(req.params.id); 
		await cloudinary.v2.uploader.destroy(foundSnap.imageId);
		await foundSnap.remove(); 
		req.flash('success', 'Snaps deleted successfully!');
		res.redirect("/snaps");
	} 
	catch (err) { 
		req.flash("error", err.message);
        res.redirect("back");
    } 

});

module.exports = router;