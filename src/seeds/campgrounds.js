const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// require("dotenv").config();
// const mapboxPublicToken = process.env.MAPBOX_PUBLIC_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapboxPublicToken });

mongoose.connect("mongodb://yelpcampUsr:y3lpcampUsr123@localhost/yelpcampDB");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 500) + 1;

const seedDB = async () => {
  await Review.deleteMany({});
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;
    // const geoData = await geocoder
    //   .forwardGeocode({
    //     query: location,
    //     limit: 1,
    //   })
    //   .send();
    // const geometry = geoData.body.features[0].geometry;

    const camp = new Campground({
      author: "635ed1b8eacc8c2aa0e86f3f",
      location,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      price: price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero dicta sint aliquam quasi inventore temporibus facere enim modi, rerum saepe iure voluptatibus velit sapiente sequi ratione numquam possimus dolores?",
      images: [
        {
          url: "https://res.cloudinary.com/dh1ugcab9/image/upload/v1667942814/YelpCamp/bidfb6d1wza1ba9fgwwn.jpg",
          filename: "YelpCamp/bidfb6d1wza1ba9fgwwn.jpg",
        },
        {
          url: "https://res.cloudinary.com/dh1ugcab9/image/upload/v1667921269/YelpCamp/wleq3xd2qmuox5cim7yn.jpg",
          filename: "YelpCamp/wleq3xd2qmuox5cim7yn.jpg",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
