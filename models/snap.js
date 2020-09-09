const mongoose = require("mongoose");
const snapSchema = new mongoose.Schema({
   name: String,
   image: String,
   imageId: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	tags: [{ type: String }]
});

module.exports = mongoose.model("Snap", snapSchema);
