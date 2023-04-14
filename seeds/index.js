// Create Express Server
const mongoose = require('mongoose');
const Court = require('../models/court')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/pickleball-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Connects to DB - Shows error if can't connect.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
});

// Function to selected random item
const sample = array => array[Math.floor(Math.random() * array.length)]

// Deletes and re-popluates array with seed helper
const seedDB = async () => {
    await Court.deleteMany({});
    for(let i=0; i < 10; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 30) + 10;
        const court = new Court ({
            //YOUR
            author: '63ff9a6a20de2d55ea047f5d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Great place to play',
            price,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/duieugqtf/image/upload/v1677906914/Pickleball%20Finder/zlo6dwicedro2n3vevg4.webp',
                  filename: 'Pickleball Finder/uvoqocxy1ew1ecamuby9',
                }
              ],
        })
        await court.save()
    }
}

// closes DB 
seedDB().then(()=>{
    mongoose.connection.close()
});