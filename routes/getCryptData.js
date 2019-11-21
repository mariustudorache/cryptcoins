
const CryptCurrency = require('../models/CryptCurrency').CryptCurrency;
const rp = require('request-promise');
const logger = require('../logs/logger');



module.exports.getCurrencyData = async function () {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '1',
            'limit': '5',
            'convert': 'EUR',
        },
        headers: {
            'X-CMC_PRO_API_KEY': '09261a25-470b-4210-852b-952a568d0995'
        },
        json: true,
        gzip: true
    };


    return await rp(requestOptions)
        .then(response => {

            const cryptData = response.data;
            cryptData.forEach(element => {
                //console.log(element)
                CryptCurrency.collection.insertOne(element)
                    .then(() => {
                        logger.info('precios insertados en db')
                    }).catch((err) => {
                        logger.error(err)
                    })
            });
            return response.data;

        }).catch((err) => {
            logger.error(err.message)
        });

}




