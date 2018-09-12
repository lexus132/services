const request = require('request');
const config = require('./config/telegram.json');
let token = '';

// Intel logger setup
const intel = require('intel');
const TelegramError = intel.getLogger('TelegramError');
TelegramError.setLevel(TelegramError.ERROR).addHandler(new intel.handlers.File(__dirname + `/logs/error.log`));

function auth() {
    let url = `http://${config.http_host}:${config.http_port}/auth`;
    const options = {
        method: 'POST',
        url: url,
        form: {
            login: config.login,
            psw: config.psw
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
    let url = `http://${config.http_host}:${config.http_port}/message?content=` + message;
    return new Promise( (resolve, reject) => {
        request.get(url, {headers: { 'authorization': `JWT ${token}` }},
            async (error, response, body) => {
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
                .then( (bool) => {
                    if(bool === false){
                        auth().then( rezTok => {
                            token = rezTok;
                            telegramSend(message);
                        });
                    }
                });
        }
    } catch (error){
        TelegramError.error(`sendMessage ${error}`);
    }

};
