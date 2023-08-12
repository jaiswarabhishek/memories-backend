const express = require('express');  // express will be used to create the server
const bodyParser = require('body-parser');  // body-parser will be used to parse the request body
const cors = require('cors');  // cors will be used to allow cross-origin requests 
const dotenv = require('dotenv');  // dotenv will be used to load environment variables from the .env file
dotenv.config( { path: './config/.env' });  // load environment variables from the .env file
const connectDB = require('./db');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2


// create the express server
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(fileUpload());
app.use( "*" , cors({

  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    origin: true,
    credentials: true
  }
))


// use the routes
app.use('/posts', postsRoutes);
app.use('/user', userRoutes);


const PORT = process.env.PORT || 5000;


// connect to the database
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


// start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));



