const mongoose = require('mongoose');
//const config = require('config');
const url =('mongodb+srv://sanjaybora:1111@cluster0-e84vq.mongodb.net/test?retryWrites=true&w=majority');

const connectDB = async () => {
    try {
       await mongoose.connect(url, {useNewUrlParser: true});
        console.log("mongodb connected");
        
    } catch(err) {
        console.error(err.message);
        process.exit(1);
        
    }
};
module.exports = connectDB;