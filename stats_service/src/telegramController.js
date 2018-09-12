const request = require('request');
const config_t = require('./config/telegram.json');
const config = require('./config/config.json');
let token = '';

// Intel logger setup
const intel = require('intel');
const TelegramError = intel.getLogger('TelegramError');
TelegramError.setLevel(TelegramError.ERROR).addHandler(new intel.handlers.File(__dirname + `/logs/error.log`));

function auth() {
    let url = `${config.telegramConnectionString}/auth`;
    const options = {
        method: 'POST',
        url: url,
        form: {
            login: config_t.login,
            psw: config_t.psw
        },
        headers: [{
                'name': 'Content-Type',
                'value': 'application/x-www-form-urlencoded'
            }]
    };
    return new Promise(function (resolve, reject) {
        request(options, async (error, response, body) => {
            if (error)
                return reject(error);
            if (response.statusCode && response.statusCode !== 200) {
                return reject(new Error(`${response.statusCode} : ${response.statusMessage}, path : ${url}`));
            }
            if (!body || body.length < 2)
                return reject(new Error(`Body : ${body}`));
            body = JSON.parse(body) || {};
            if (!body.token)
                return reject(new Error(`Error: token empty`));
            resolve(body.token);
        });
    });
};
function telegramSend(message)
{
    let url = `${config.telegramConnectionString}/message?content=` + message;
    return new Promise( (resolve, reject) => {
        request.get(url, {headers: { 'authorization': `JWT ${token}` }},
             (error, response, body) => {
                if(error)
                    return reject(error);

                if(response.statusCode === 401)
                    return resolve(false);

                if (!body || body.length < 2)
                    return reject(new Error(`Body empty : ${body}`));

                if (response.statusCode && response.statusCode !== 200)
                    return reject(new Error(`${response.statusCode} : ${response.statusMessage}, path : ${url}`));

                resolve(true);
            });
    });
}

exports.sendMessage = async function( message ) {

    try{
        if(token === ''){
            token = await auth();
        }
        if(token !== ''){
            telegramSend(message)
                .then( async (bool) => {
                    if(bool === false){
                        token = await auth();
                        telegramSend(message);
                    }
                });
        }
    } catch (error){
        TelegramError.error(`telegram.sendMessage ${error}`);
    }

};
