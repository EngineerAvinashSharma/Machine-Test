const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/booking');



//Middlewares
app.use(bodyParser.json());
app.use(cors());

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

//DataBase Connection
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
    .then(() => {
        console.log("DataBase Connected");
    })
    .catch((error) => {
        console.log(error);
    });

//Routes
app.use('/user', userRoutes);
app.use('/station',bookingRoutes)

const port = process.env.port || 8000;


//Listing Port 
app.listen(port, () => {
    console.log('App is Running at Port' + port)
});
