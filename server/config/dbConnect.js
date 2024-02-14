const mongoose = require('mongoose');


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            authSource: "admin"
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Mongodb Connection Failed", error);
    }
}

module.exports = dbConnect;