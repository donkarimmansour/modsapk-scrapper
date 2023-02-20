const mongoose = require("mongoose")

const fileSchema = mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const fileModal = mongoose.model("file", fileSchema)

module.exports = fileModal