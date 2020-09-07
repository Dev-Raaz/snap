const mongoose = require("mongoose");

const snapSchema = new mongoose.Schema({
   Caption: {
        type: String,
        required: "Caption cannot be blank."
   },
   image: String,
   imageId: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ]
});

module.exports = mongoose.model("Snap", snapSchema);
