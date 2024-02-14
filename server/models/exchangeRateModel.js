const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const exchangeRateSchema = new Schema({
    currency1: {
        type: String,
        required: true
    },
    currency2: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('ExchangeRates', exchangeRateSchema);