const express = require('express');
const exchangeRateRouter = express.Router();
const exchangeRateCtrl = require('../controllers/exchangeRateCtrl');


exchangeRateRouter.get('/', exchangeRateCtrl.getExchangeRates);
exchangeRateRouter.get('/currency-options', exchangeRateCtrl.getCurrencyOptions);
exchangeRateRouter.get('/:currency1/:currency2', exchangeRateCtrl.getExchangeRate);
exchangeRateRouter.post('/', exchangeRateCtrl.createExchangeRate);
exchangeRateRouter.put('/:id', exchangeRateCtrl.updateExchangeRate);
exchangeRateRouter.delete('/:id', exchangeRateCtrl.deleteExchangeRate);

module.exports = exchangeRateRouter;