const request = require('request');
const fs = require ('fs-extra');
const mongodbConnectionString = require('./config/config.json').mongodbConnectionString;
const telegram = require('./telegramController');

const logFile = __dirname + `/logs/error.log`;
try{
    fs.createFileSync(logFile);
} catch (error){
    console.log('- Can`t created log-file : ' + error);
}

//Intel logger setup
const intel = require('intel');
const StatsError = intel.getLogger('StatsError');
StatsError.setLevel(StatsError.ERROR).addHandler(new intel.handlers.File(logFile));

//Mongoose
global.mongoose = require('mongoose');
mongoose.connect(mongodbConnectionString, { useNewUrlParser: true });
const dbHotExchangeLib = require('./lib/mongodb/hot_exchange.js');

const url = 'https://api.coinmarketcap.com/v1/ticker/';

function parseAndSaveETHUSD() {
    let path = url + 'ethereum/?convert=USD';
    request.get(path,
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${error}`);
                return StatsError.error(`parseAndSaveETHUSD Error: ${error}`);
            }
            if (response.statusCode && response.statusCode !== 200) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
                return StatsError.error(`parseAndSaveETHUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
            }
            if (!body || body.length < 2) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveETHUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            body = JSON.parse(body) || {};

            if (!body[0].price_usd) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: price_usd empty`);
                return StatsError.error(`parseAndSaveETHUSD Error: price_usd empty`);
            }

            dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'ETH-USD', 'value': body[0].price_usd })
                .catch(error=>{
                    telegram.sendMessage(`saveHotExchangeToMongoDb ${error}`);
                    StatsError.error(`saveHotExchangeToMongoDb ${error}`);
                })

        }
    );
}

function parseAndSaveBTCUSD(){
    let path = url + 'bitcoin/?convert=USD';
    request.get(path,
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveBTCUSD Error: ${error}`);
                return StatsError.error(`parseAndSaveBTCUSD Error: ${error}`);
            }
            if (response.statusCode && response.statusCode !== 200) {
                telegram.sendMessage(`parseAndSaveBTCUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
                return StatsError.error(`parseAndSaveBTCUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
            }
            if (!body || body.length < 2) {
                telegram.sendMessage(`parseAndSaveBTCUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveBTCUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            if (!body || body.length < 2) {
                telegram.sendMessage(`parseAndSaveBTCUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveBTCUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            body = JSON.parse(body) || {};

            if (!body[0].price_usd) {
                telegram.sendMessage(`parseAndSaveBTCUSD Error: price_usd empty`);
                return StatsError.error(`parseAndSaveBTCUSD Error: price_usd empty`);
            }
            dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'BTC-USD', 'value': body[0].price_usd })
                .catch(error=>{
                    telegram.sendMessage(`saveHotExchangeToMongoDb ${error}`);
                    StatsError.error(`saveHotExchangeToMongoDb ${error}`);
                })
        }
    );
}

function parseAndSaveLTCUSD(){
    let path = url + 'litecoin/?convert=USD';
    request.get(path,
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveLTCUSD Error: ${error}`);
                return StatsError.error(`parseAndSaveLTCUSD Error: ${error}`);
            }
            if (response.statusCode && response.statusCode !== 200) {
                telegram.sendMessage(`parseAndSaveLTCUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
                return StatsError.error(`parseAndSaveLTCUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
            }
            if (!body || body.length < 2) {
                telegram.sendMessage(`parseAndSaveLTCUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveLTCUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            body = JSON.parse(body) || {};

            if (!body[0].price_usd) {
                telegram.sendMessage(`parseAndSaveLTCUSD Error: price_usd empty`);
                return StatsError.error(`parseAndSaveLTCUSD Error: price_usd empty`);
            }
            dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'LTC-USD', 'value': body[0].price_usd })
                .catch(error=>{
                    telegram.sendMessage(`saveHotExchangeToMongoDb ${error}`);
                    StatsError.error(`saveHotExchangeToMongoDb ${error}`);
                })
        }
    );
}

function parseAndSaveBTGUSD(){
    let path = url + 'bitcoin-gold/?convert=USD';
    request.get(path,
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveBTGUSD Error: ${error}`);
                return StatsError.error(`parseAndSaveBTGUSD Error: ${error}`);
            }
            if (response.statusCode && response.statusCode !== 200) {
                telegram.sendMessage(`parseAndSaveBTGUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
                return StatsError.error(`parseAndSaveBTGUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
            }
            if (!body || body.length < 2) {
                telegram.sendMessage(`parseAndSaveBTGUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveBTGUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            body = JSON.parse(body) || {};

            if (!body[0].price_usd) {
                telegram.sendMessage(`parseAndSaveBTGUSD Error: price_usd empty`);
                return StatsError.error(`parseAndSaveBTGUSD Error: price_usd empty`);
            }
            dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'BTG-USD', 'value': body[0].price_usd })
                .catch(error=>{
                    telegram.sendMessage(`saveHotExchangeToMongoDb ${error}`);
                    StatsError.error(`saveHotExchangeToMongoDb ${error}`);
                });
        }
    );
}

function parseAndSaveBCHUSD(){
    let path = url + 'bitcoin-cash/?convert=USD';
    request.get(path,
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveBCHUSD Error: ${error}`);
                return StatsError.error(`parseAndSaveBCHUSD Error: ${error}`);
            }
            if (response.statusCode && response.statusCode !== 200) {
                telegram.sendMessage(`parseAndSaveBCHUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
                return StatsError.error(`parseAndSaveBCHUSD Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
            }
            if (!body || body.length < 2) {
                telegram.sendMessage(`parseAndSaveBCHUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveBCHUSD Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            body = JSON.parse(body) || {};

            if (!body[0].price_usd) {
                telegram.sendMessage(`parseAndSaveBCHUSD Error: price_usd empty`);
                return StatsError.error(`parseAndSaveBCHUSD Error: price_usd empty`);
            }
            dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'BCH-USD', 'value': body[0].price_usd })
                .catch(error=>{
                    telegram.sendMessage(`saveHotExchangeToMongoDb ${error}`);
                    StatsError.error(`saveHotExchangeToMongoDb ${error}`);
                });
        }
    );
}

function parseAndSaveUSDT() {
    let path = url.replace('/v1', '/v2') + '825/?convert=USD';
    request.get(path,
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveUSDT Error: ${error}`);
                return StatsError.error(`parseAndSaveUSDT Error: ${error}`);
            }

            if (response.statusCode && response.statusCode !== 200) {
                telegram.sendMessage(`parseAndSaveUSDT Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
                return StatsError.error(`parseAndSaveUSDT Error: ${response.statusCode} : ${response.statusMessage}, path : ${path}`);
            }

            if (!body) {
                telegram.sendMessage(`parseAndSaveUSDT Error: Body : ${JSON.stringify(JSON.parse(body))}`);
                return StatsError.error(`parseAndSaveUSDT Error: Body : ${JSON.stringify(JSON.parse(body))}`);
            }
            body = JSON.parse(body) || {};

            if (!body.data || !body.data.quotes
                || !body.data.quotes.USD || !body.data.quotes.USD.price) {
                telegram.sendMessage(`parseAndSaveUSDT Error: price empty`);
                return StatsError.error(`parseAndSaveUSDT Error: price empty`);
            }
            dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'USDT-USD', 'value': body.data.quotes.USD.price })
                .catch(error=>{
                    telegram.sendMessage(`saveHotExchangeToMongoDb ${error}`);
                    StatsError.error(`saveHotExchangeToMongoDb ${error}`);
                });
        }
    );
}


parseAndSaveETHUSD();

/*
setInterval( () => {
    parseAndSaveETHUSD();
    parseAndSaveBTCUSD();
    parseAndSaveLTCUSD();
    parseAndSaveBTGUSD();
    parseAndSaveBCHUSD();
    parseAndSaveUSDT();
}, 5000);
*/
