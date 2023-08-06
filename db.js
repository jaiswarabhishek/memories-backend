const mongoose = require('mongoose');  // mongoose will be used to connect to the database


async function connectDB() {
    try {
        // connect to the database
        await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

        console.log('MongoDB connection SUCCESS....');
    } catch (error) {
       console.log(error.message);
         process.exit(1);  // exit with failure
    }
}

module.exports = connectDB;