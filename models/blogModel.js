const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:  String,
    catagory: String,
    body:   String,
    brief: String,
    date: { type: Date, default: Date.now },
    imagePath: String
});





var blogInformation = mongoose.model('blog',blogSchema,'blogs');

module.exports = {blogInformation};