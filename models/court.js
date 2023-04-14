const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('strictQuery', true)

const opts = { toJSON: {virtuals: true}}

const PickleballSchema = new Schema({
    title: String,
    images: [
        {
            url:String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        } 
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    
},opts)

PickleballSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/courts/${this._id}">${this.title}</a><strong>
    `
});

module.exports = mongoose.model('Court', PickleballSchema)