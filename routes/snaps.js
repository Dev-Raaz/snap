let express    		= require("express"),
	router     		= express.Router(),
 	passport   		= require("passport");

router.get("/", (req, res)=>{
    res.render("landing");
});

router.get("/index", (req, res)=>{
    res.render("snaps/index");
});

router.get("/new", (req, res)=>{
    res.render("snaps/new");
});


module.exports = router;