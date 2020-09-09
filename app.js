const express  	   = require("express"),
	  app   	   = express(),
	  bodyParser   = require("body-parser"),
	  passport     = require("passport"),
    LocalStrategy  = require("passport-local"),
	  flash        = require("connect-flash"),
    methodOverride = require("method-override"),
	    User       = require("./models/user"),
	mongoose 	   = require("mongoose");

const indexRoutes 	= require("./routes/index"),
	  snapRoutes 	= require("./routes/snaps");



mongoose.connect('mongodb://localhost:27017/ohh_snap', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to pass the data of the current user logged in, it is passed in every route thanks to passport-local-mongoose and also we pass our //flash methods.
app.use(async (req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/snaps", snapRoutes);


app.listen(3000, () =>{
	console.log(`Server started!`);
});