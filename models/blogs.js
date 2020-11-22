const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: String,
    image: String, // image: {type: String, dafult: "placeholder.jpg}
    body: String,
    createdOn: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('Blog', BlogSchema);
