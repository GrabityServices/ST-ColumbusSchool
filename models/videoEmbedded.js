const mongoose = require("mongoose");

const videoGallSchema = new mongoose.Schema(
  {
    videoEmbed: {
      type: String,
      unique: true,
      required: true,
      match: /<iframe.*?src="https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*?<\/iframe>/||/<iframe.*?src="https?:\/\/(www\.)?facebook\.com\/.*?<\/iframe>/||/<iframe[^>]+src=["']https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})["'][^>]*><\/iframe>/
,
    },
  },
  { timestamps: true }
);

const videoGall = mongoose.model("videoembed", videoGallSchema);


module.exports = videoGall;
