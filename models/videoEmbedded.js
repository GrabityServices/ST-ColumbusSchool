const mongoose = require("mongoose");

const videoGallSchema = new mongoose.Schema(
  {
    videoEmbed: {
      type: String,
      unique: true,
      required: true,
      match:/^<iframe\b[^>]*>.*?<\/iframe>$/

,
    },
  },
  { timestamps: true }
);

const VideoGall = mongoose.model("videoembed", videoGallSchema);


module.exports = VideoGall;
