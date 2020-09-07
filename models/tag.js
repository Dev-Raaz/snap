const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	text: String,
	snaps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Snap"
        }
    ]
});

module.exports = mongoose.model("Tag", tagSchema);