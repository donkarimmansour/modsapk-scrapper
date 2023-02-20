const mongoose = require("mongoose")

const SerieSchema = mongoose.Schema({
    Location: { type: String,  required: false , trim: true },
    Title: { type: String,  required: true , trim: true },
    AlsoKnown: { type: String,  required: false , trim: true },
    Description: { type: String,  required: false , trim: true },
    Year: { type: String,  required: false , trim: true },
    Language: { type: String,  required: false , trim: true },
    Country: { type: String,  required: false , trim: true },
    Wins: { type: String,  required: false , trim: true },
    CategoryWatch: { type: String,  required: false , trim: true },
    Duration: { type: String,  required: false , trim: true },
    Rating: { type: String,  required: false , trim: true },
    Category: { type: String,  required: false , trim: true },
    Quality: { type: String,  required: false , trim: true },
    Trailer: { type: String,  required: false , trim: true },
    Link: { type: Array,  required: true, trim: true },
    Poster: { type: mongoose.Schema.Types.ObjectId,  required: true , trim: true , ref : "file" },
    Types: { type: Array,  required: false , trim: true },
    Actors: { type: Array,  required: false , trim: true },
    Tags: { type: Array,  required: false , trim: true },
    createdAt: { type: Date,  default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})


const SeriesModal = mongoose.model("series", SerieSchema)

module.exports =  SeriesModal