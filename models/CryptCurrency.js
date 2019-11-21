const mongoose = require('mongoose');

const cryptSchema = mongoose.Schema({
    _id: Number,
    name: String,
    symbol: String,
    slug: String,
    num_market_pairs: Number,
    date_added: Date,
    tags: [],
    max_supply: Number,
    circulating_supply: Number,
    total_supply: Number,
    platform: String,
    cmc_rank: Number,
    last_updated: { type: Date, default: Date.now() },
    quote: {
        USD: {
            price: Number,
            volume_24h: Number,
            percent_change_1h: Number,
            percent_change_24h: Number,
            percent_change_7d: Number,
            market_cap: Number,
            last_updated: { type: Date, default: Date.now() }
        }
    }
}, { _id: false })
const CryptCurrency = mongoose.model('CryptCurrency', cryptSchema);
module.exports = { CryptCurrency };












