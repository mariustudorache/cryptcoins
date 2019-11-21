const express = require('express');
const router = express.Router();
const CryptCurrency = require('../models/CryptCurrency').CryptCurrency;
const redis = require('redis')
const client = redis.createClient(6379);
const logger = require('../logs/logger');




//obtener todos los precios y guardarlos en la cahe de Redis 
async function getCryptoData(req, res, next) {
    try {

        let date = new Date();
        var dLast = new Date();
        dLast.setHours(dLast.getHours() - 5);
        date.setHours(date.getHours())

        const crypto = await CryptCurrency.find().
            //where('last_updated').ls(dLast.toISOString()).gt(date.toISOString()).
            select('id name quote').
            exec()

        client.setex("cryptCacheData", 60, JSON.stringify(crypto));
        res.json(crypto);
    } catch (error) {
        res.json(error)
    }
}


// Routes
/**
 * @swagger
 * /crypto:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: Exito!
 */
router.get('/crypto', cache, getCryptoData)
// Routes
/**
 * @swagger
 * /crypto/:cryptoId:    
 *  get: 
 *    description: Solicitar los datos de un campo
 *    produces:
 *          - application/json
 *    parameters:
 *          - name: id
 *            in: path
 *            
 *    responses: 
 *            '200':
 *             description: Exito!
 */
router.get('/crypto/:cryptoId', async (req, res) => {
    try {
        const crypto = await CryptCurrency.findById(req.params.cryptoId);
        res.status(200).json(crypto);
    } catch (error) {
        res.json(error);

    }
})

// Cache middleware
function cache(req, res, next) {


    client.get("cryptCacheData", (err, data) => {
        if (err) throw err;

        if (data !== null) {
            logger.info('cache data');
            res.send(data);
        } else {
            next();
        }
    });
}




// Routes
/**
 * @swagger 
 * /crypto:
 *  post:
 *    description: Utilizada para actualizar los datos de cryptomeneda
 *    produces:
 *          - application/json
 *    parameters:
 *          - name: id
 *    responses:
 *      '200':
 *        description: Exito
 */
router.post('/crypto', async (req, res) => {

    const crypto = new CryptCurrency({
        _id: req.body.id,
        name: req.body.name,
        symbol: req.body.symbol,
        slug: req.body.slug,
        num_market_pairs: req.body.num_market_pairs,
        date_added: req.body.date_added,
        tags: [],
        max_supply: req.body.max_supply,
        circulating_supply: req.body.circulating_supply,
        total_supply: req.body.total_supply,
        platform: req.body.platform,
        cmc_rank: req.body.cmc_rank,
        last_updated: Date.now.toString(),
        quote: {
            USD: {
                price: req.body.price,
                volume_24h: req.body.volume_24h,
                percent_change_1h: req.body.percent_change_1h,
                percent_change_24h: req.body.percent_change_24h,
                percent_change_7d: req.body.percent_change_7d,
                market_cap: req.body.market_cap,
                last_updated: Date.now.toString()
            }
        }
    });



    try {

        const savedCrypto = await crypto.save();
        res.status(200).json(savedCrypto);

    } catch (err) {
        res.status(500).json({ message: err })
    }
})


// Routes 
/**
 * @swagger
 * /crypto/: 
 *  put: 
 *    description: Actualizar los datos
 *    produces:
 *          - application/json
 *    parameters: 
 *          - name: id 
 *            in: path     
 *              
 *    responses: 
 *            '200':
 *             description: Exito!    
 */
router.put('/crypto/:cryptoId', async (req, res) => {
    try {
        const crypto = await CryptCurrency.update();
        res.status(200).json(crypto);
    } catch (error) {
        res.json(error);

    }
})

module.exports = router;