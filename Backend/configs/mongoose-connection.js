const mongoose = require('mongoose')
require('dotenv').config
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsInsecure: false,
    serverSelectionTimeoutMS: 30000,
  }).then(function(connection) {
    console.log("Connected to MongoDB");
})
.catch(function(error) {
    console.log("Error connecting to MongoDB: ", error);
});

module.exports =mongoose.connection