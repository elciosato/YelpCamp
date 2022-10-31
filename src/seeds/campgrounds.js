const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://yelpcampUsr:y3lpcampUsr123@localhost/yelpcampDB');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 500) + 1;

const seedDB = async () => {
    await Review.deleteMany({});
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "635ed1b8eacc8c2aa0e86f3f",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/2552945',
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero dicta sint aliquam quasi inventore temporibus facere enim modi, rerum saepe iure voluptatibus velit sapiente sequi ratione numquam possimus dolores?'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
