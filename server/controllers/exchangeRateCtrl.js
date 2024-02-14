const ExchangeRate = require('../models/exchangeRateModel');

const getExchangeRate = async (req, res) => {
    try {
        const { currency1, currency2 } = req.params;


        let exchangeRate = await ExchangeRate.findOne({
            currency1,
            currency2
        });

        let inverseFound = false;
        if (!exchangeRate) {
            exchangeRate = await ExchangeRate.findOne({
                currency1: currency2,
                currency2: currency1
            });
            inverseFound = true;
        }

        if (!exchangeRate) {
            return res.status(404).json({
                message: 'Exchange rate not found'
            });
        }

        if (inverseFound) {
            exchangeRate.rate = 1 / exchangeRate.rate;
        }


        res.json(exchangeRate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getExchangeRates = async (req, res) => {
    try {

        let { page, limit, search } = req.query;

        let filter = {}

        if (search) {
            filter = {
                $or: [
                    { currency1: { $regex: search, $options: 'i' } },
                    { currency2: { $regex: search, $options: 'i' } }
                ]
            }
        }

        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const exchangeRates = await ExchangeRate.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        
        const totalCount = await ExchangeRate.countDocuments(filter);
        res.json({
            exchangeRates,
            page,
            limit,
            totalCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getCurrencyOptions = async (req, res) => {
    try {
        const exchangeRates = await ExchangeRate.find();

        let currencyOptions = [];

        exchangeRates.forEach(rate => {
            const currencyOneExists = currencyOptions.find(currencyOption => currencyOption.value === rate.currency1);
            const currencyTwoExists = currencyOptions.find(currencyOption => currencyOption.value === rate.currency2);

            if (!currencyOneExists) {
                currencyOptions.push({
                    value: rate.currency1,
                    label: rate.currency1
                });
            }

            if (!currencyTwoExists) {
                currencyOptions.push({
                    value: rate.currency2,
                    label: rate.currency2
                });
            }
        });

        res.json(currencyOptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const createExchangeRate = async (req, res) => {
    try {
        const { currency1, currency2, rate } = req.body;

        const exchangeRate = await ExchangeRate.findOne({
            $or: [
                { currency1, currency2 },
                { currency1: currency2, currency2: currency1 }
            ]
        });

        if (exchangeRate) {
            return res.status(400).json({
                message: 'Exchange rate already exists. Update Existing one if necessary.'
            });
        }

        const newExchangeRate = new ExchangeRate({
            currency1,
            currency2,
            rate
        });

        await newExchangeRate.save();

        res.status(201).json({
            message: 'Exchange rate created successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateExchangeRate = async (req, res) => {
    try {
        const { rate } = req.body;
        const { id } = req.params;

        let exchangeRate = await ExchangeRate.findById(id);

        if (!exchangeRate) {
            exchangeRate = new ExchangeRate({
                currency1,
                currency2,
                rate
            });

            await exchangeRate.save();
        } else {
            exchangeRate = await ExchangeRate.findByIdAndUpdate(exchangeRate._id, {
                rate
            }, { new: true });
        }

        res.status(200).json(exchangeRate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const deleteExchangeRate = async (req, res) => {
    try {
        const { currency1, currency2 } = req.query;
        const { id } = req.params;
        const exchangeRate = await ExchangeRate.findById(id);

        if (!exchangeRate) {
            return res.status(404).json({
                message: 'Exchange rate not found'
            });
        }

        await ExchangeRate.findByIdAndDelete(exchangeRate._id);

        res.status(200).json({
            message: 'Exchange rate deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




module.exports = {
    getExchangeRates,
    getExchangeRate,
    getCurrencyOptions,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate
};