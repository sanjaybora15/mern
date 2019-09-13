const mongoose = require('mongoose');
//const config = require('config');
const url =('');

const connectDB = async () => {
    try {
       await mongoose.connect(url, 
        {
            useNewUrlParser: true,
            useCreateIndex: true, 
            useFindAndModify: false,
        });
        console.log("Mongodb connected successfully..!!! ");
        
    } catch(err) {
        console.log('something went wrong with database connection')
        console.error(err.message);
        process.exit(1);       
    }
};
module.exports = connectDB;
