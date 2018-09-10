const request = require('request');
var token = '';

//Intel logger setup
const intel = require('intel');
const TelegramError = intel.getLogger('TelegramError');
TelegramError.setLevel(TelegramError.ERROR).addHandler(new intel.handlers.File(__dirname + `/logs/error.log`));


function auth()
{
    const config = require('./config/telegram.json');
    const options = {
        method: 'POST',
        url: 'http://telegramservice:8082/auth',
        form: {
            login: config.login,
            psw: config.psw
        },
        headers: [
            {
                'name': 'Content-Type',
                'value' : 'application/x-www-form-urlencoded'
            }
        ]
    };
    return new Promise(function (resolve, reject) {
        request(options, async (error, response, body) => {
            if(error){
                reject(error);
                return TelegramError.error(`telegramControllet.auth Error: ${error}`);
            } else if(response.statusCode === 200){

                if (!body || body.length < 2) {
                    reject(new Error(`Body empty : ${body}`));
                    return TelegramError.error(`telegramControllet.auth Error: Body empty : ${body}`)
                } else {
                    body = JSON.parse(body) || {};
                }

                if (!body.token) {
                    reject(new Error(`Error: token empty`));
                    return TelegramError.error(`telegramControllet.auth Error: token empty`);
                } else {
                    resolve(body.token);
                }
            } else {
                reject(new Error(`statusCode : ${response.statusCode}, message: ${response.statusMessage}`));
                return TelegramError.error(`telegramControllet.auth Error: statusCode : ${response.statusCode}, message: ${response.statusMessage}`);
            }
        });
    });

};

function telegramSend(message)
{
    return new Promise( (resolve, reject) => {
        request.get('http://telegramservice:8082/message?content=' + message,
            {headers: { 'authorization': 'JWT ' + token }},
            (error, response, body) => {
                if(error){
                    return TelegramError.error(`telegramControllet.sendMess Error: ${error}`);
                    reject(new Error(`telegramControllet.sendMess Error: ${error}`));
                } else if(response.statusCode === 200){
                    if (!body || body.length < 2) {
                        reject(new Error(`telegramControllet.sendMess Error: Body empty : ${body}`));
                    } else {
                        resolve('success');
                    }
                } else if(response.statusCode === 401){
                    reject('bad_auth');
                } else {
                    reject(new Error(`telegramControllet.sendMess Error: statusCode: ${response.statusCode}, message: ${response.statusMessage}`));
                    return TelegramError.error(`telegramControllet.sendMess Error: statusCode: ${response.statusCode}, message: ${response.statusMessage}`);
                }
            });
    });
}

exports.sendMessage = function( message ) {

    if(token){
        let messagPromise = telegramSend(message);
        messagPromise
            .catch( bad_auth => {
                token = '';
                this.sendMessage(message);
            });
    } else {
        let tokenPromis = auth();
        tokenPromis
            .then( rezToken => {
                token = rezToken;
            })
            .then( token => {
                this.sendMessage(message);
        }).catch( error => {
            console.log('-- telegram auth error ---', error);
        });
    }

};