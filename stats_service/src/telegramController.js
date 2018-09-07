const request = require('request');

//Intel logger setup
const intel = require('intel');
const TelegramError = intel.getLogger('TelegramError');
TelegramError.setLevel(TelegramError.ERROR).addHandler(new intel.handlers.File(__dirname + `/logs/error.log`));

exports.comunicate = async function(message = '')
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
    request(options, async (error, response, body) => {
        if(error){
            return TelegramError.error(`telegramControllet.auth Error: ${error}`);
        } else if(response.statusCode === 200){

            if (!body || body.length < 2) {
                return TelegramError.error(`telegramControllet.auth Error: Body empty : ${body}`)
            } else {
                body = JSON.parse(body) || {};
            }

            if (!body.token) {
                return TelegramError.error(`telegramControllet.auth Error: token empty`)
            } else {
                if(message){
                    sendMess(message, body.token);
                }
            }
        } else {
            return TelegramError.error(`telegramControllet.auth Error: statusCode : ${response.statusCode}, message: ${response.statusMessage}`);
        }
    });
};

function sendMess(message, token){

    request.get('http://telegramservice:8082/message?content=' + message,
        {headers: { 'authorization': 'JWT ' + token }},
        (error, response, body) => {
        if(error){
            return TelegramError.error(`telegramControllet.sendMess Error: ${error}`)
        } else if(response.statusCode === 200){

            if (!body || body.length < 2) {
                return TelegramError.error(`telegramControllet.sendMess Error: Body empty : ${body}`)
            }

        } else {
            return TelegramError.error(`telegramControllet.sendMess Error: statusCode: ${response.statusCode}, message: ${response.statusMessage}`);
        }
    });
}