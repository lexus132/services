const request = require('request');
const fs = require ('fs-extra');
const mongodbConnectionString = require('./config/config.json').mongodbConnectionString;
const telegram = require('./telegramController');

const logFile = __dirname + `/logs/error.log`;
try{
    fs.createFileSync(logFile);
} catch (error){
    console.log('--- Can`t created log-file : ' + error);
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
    request.get(url + 'ethereum/?convert=USD',
        async (error, response, body) => {
            if(error){
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${error}`);
                return StatsError.error(`parseAndSaveETHUSD Error: ${error}`);
            } else if(response.statusCode === 200){

                if (!body || body.length < 2) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                    return StatsError.error(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body[0].price_usd) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: price_usd empty`);
                    return StatsError.error(`parseAndSaveETHUSD Error: price_usd empty`);
                } else {
                    dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'ETH-USD', 'value': body[0].price_usd })
                        .catch(error=>StatsError.error(`saveHotExchangeToMongoDb ${error}`));
                }
            } else {
                telegram.sendMessage(`parseAndSaveETHUSD Error: statusCode: ${response.statusCode}, msg: ${response.statusMessage}`)
                return StatsError.error(`parseAndSaveETHUSD Error: statusCode: ${response.statusCode}, msg: ${response.statusMessage}`)
            }
        }
    );
}

function parseAndSaveBTCUSD(){
    request.get(url + 'bitcoin/?convert=USD',
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${error}`)
                return StatsError.error(`parseAndSaveETHUSD Error: ${error}`)
            } else if(response.statusCode === 200){
                if (!body || body.length < 2) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                    return StatsError.error(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body[0].price_usd) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: price_usd empty`)
                    return StatsError.error(`parseAndSaveETHUSD Error: price_usd empty`)
                }  else {
                    dbHotExchangeLib.saveHotExchangeToMongoDb({
                        'time': Math.floor(new Date / 1000),
                        'pair': 'BTC-USD',
                        'value': body[0].price_usd
                    }).catch(error => StatsError.error(`saveHotExchangeToMongoDb ${error}`));
                }
            } else {
                telegram.sendMessage(`parseAndSaveETHUSD Error: statusCode: ${response.statusCode}, msg: ${response.statusMessage}`)
                return StatsError.error(`parseAndSaveETHUSD Error: statusCode: ${response.statusCode}, msg: ${response.statusMessage}`)
            }
        }
    );
}

function parseAndSaveLTCUSD(){
    request.get(url + 'litecoin/?convert=USD',
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${error}`)
                return StatsError.error(`parseAndSaveETHUSD Error: ${error}`)
            } else if(response.statusCode === 200){
                if (!body || body.length < 2) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                    return StatsError.error(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body[0].price_usd) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: price_usd empty`)
                    return StatsError.error(`parseAndSaveETHUSD Error: price_usd empty`)
                } else {
                    dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'LTC-USD', 'value': body[0].price_usd })
                        .catch(error=>StatsError.error(`saveHotExchangeToMongoDb ${error}`))
                }
            } else {
                telegram.sendMessage(`parseAndSaveETHUSD Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
                return StatsError.error(`parseAndSaveETHUSD Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
            }
        }
    );
}

function parseAndSaveBTGUSD(){
    request.get(url + 'bitcoin-gold/?convert=USD',
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${error}`)
                return StatsError.error(`parseAndSaveETHUSD Error: ${error}`)
            } else if(response.statusCode === 200){
                if (!body || body.length < 2) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                    return StatsError.error(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body[0].price_usd) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: price_usd empty`)
                    return StatsError.error(`parseAndSaveETHUSD Error: price_usd empty`)
                } else {
                    dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'BTG-USD', 'value': body[0].price_usd })
                        .catch(error=>StatsError.error(`saveHotExchangeToMongoDb ${error}`))
                }
            } else {
                telegram.sendMessage(`parseAndSaveETHUSD Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
                return StatsError.error(`parseAndSaveETHUSD Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
            }
        }
    );
}

function parseAndSaveBCHUSD(){
    request.get(url + 'bitcoin-cash/?convert=USD',
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveETHUSD Error: ${error}`)
                return StatsError.error(`parseAndSaveETHUSD Error: ${error}`)
            } else if(response.statusCode === 200){
                if (!body || body.length < 2) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                    return StatsError.error(`parseAndSaveETHUSD Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body[0].price_usd) {
                    telegram.sendMessage(`parseAndSaveETHUSD Error: price_usd empty`)
                    return StatsError.error(`parseAndSaveETHUSD Error: price_usd empty`)
                } else {
                    dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'BCH-USD', 'value': body[0].price_usd })
                        .catch(error=>StatsError.error(`saveHotExchangeToMongoDb ${error}`))
                }
            } else {
                telegram.sendMessage(`parseAndSaveETHUSD Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
                return StatsError.error(`parseAndSaveETHUSD Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
            }
        }
    );
}

function parseAndSaveUSDT() {
    request.get(url.replace('/v1', '/v2') + '825/?convert=USD',
        async (error, response, body) => {
            if (error) {
                telegram.sendMessage(`parseAndSaveUSDT Error: ${error}`)
                return StatsError.error(`parseAndSaveUSDT Error: ${error}`)
            } else if(response.statusCode === 200){
                if (!body) {
                    telegram.sendMessage(`parseAndSaveUSDT Error: Body empty : ${body}`)
                    return StatsError.error(`parseAndSaveUSDT Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body.data || !body.data.quotes
                    || !body.data.quotes.USD || !body.data.quotes.USD.price) {
                    telegram.sendMessage(`parseAndSaveUSDT Error: price empty`)
                    return StatsError.error(`parseAndSaveUSDT Error: price empty`)
                } else {
                    dbHotExchangeLib.saveHotExchangeToMongoDb({ 'time': Math.floor(new Date / 1000), 'pair': 'USDT-USD', 'value': body.data.quotes.USD.price })
                        .catch(error=>StatsError.error(`saveHotExchangeToMongoDb ${error}`))
                }
            } else {
                telegram.sendMessage(`parseAndSaveUSDT Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
                return StatsError.error(`parseAndSaveUSDT Error: statusCode : ${response.statusCode}, msg: ${response.statusMessage}`)
            }
        }
    );
}