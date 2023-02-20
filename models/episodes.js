const mongoose = require("mongoose")

const EpisodeSchema = mongoose.Schema({
    Location: { type: String,  required: false, trim: true },
    Title: { type: String,  required: true, trim: true },
    Language: { type: String,  required: false, trim: true },
    Country: { type: String,  required: false, trim: true },
    Wins: { type: String,  required: false, trim: true },
    CategoryWatch: { type: String,  required: false, trim: true }, 
    Duration: { type: String,  required: false, trim: true },
    Category: { type: String,  required: false, trim: true },
    Quality: { type: String,  required: false, trim: true }, 
    Types: { type: Array,  required: false, trim: true },
    Watches: { type: Array,  required: true, trim: true },
    Downloades: { type: Array,  required: false, trim: true },
    Link: { type: Array,  required: true, trim: true },
    Session: { type: mongoose.Schema.Types.ObjectId,  required: true, trim: true , ref : "session" },
    Tags: { type: Array,  required: false, trim: true },
    createdAt: { type: Date,  default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})


const EpisodesModal = mongoose.model("episode", EpisodeSchema)

module.exports =  EpisodesModal