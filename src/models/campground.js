const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload/", "/upload/w_200/");
});

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<h5><a href="/campgrounds/${this._id}">${this.title}</a></h5><p>${this.location}</p>`;
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews) {
    await Review.deleteMany({
      _id: {
        $in: campground.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
