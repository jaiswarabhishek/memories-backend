const express = require('express');  // express will be used to create the server
const bodyParser = require('body-parser');  // body-parser will be used to parse the request body
const cors = require('cors');  // cors will be used to allow cross-origin requests 
const dotenv = require('dotenv');  // dotenv will be used to load environment variables from the .env file
dotenv.config( { path: './config/.env' });  // load environment variables from the .env file
const connectDB = require('./db');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

// create the express server
const app = express();

// use cors to allow cross-origin requests

app.use( "*" , cors({
    origin: true,
    credentials: true
  }
))


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

// use the routes
app.use('/posts', postsRoutes);
app.use('/user', userRoutes);


const PORT = process.env.PORT || 4000;


// connect to the database
connectDB();


// start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));



