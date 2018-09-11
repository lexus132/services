const request = require('request');
const config = require('./config/telegram.json');
let token = '';

function auth() {
    const options = {
        method: 'POST',
        url: `http://${config.http_host}:${config.http_port}/auth`,
        form: {
            login: config.login,
            psw: config.psw
        },
        headers: [
            {
                'name': 'Content-Type',
                'value': 'application/x-www-form-urlencoded'
            }
        ]
    };
    return new Promise(function (resolve, reject) {
        request(options, async (error, response, body) => {
            if (error)
                return reject(error);
            if (!body || body.length < 2 || (response.statusCode && response.statusCode !== 200))
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
    return new Promise( (resolve, reject) => {
        request.get(`http://${config.http_host}:${config.http_port}/message?content=` + message,
            {headers: { 'authorization': `JWT ${token}` }},
            async (error, response, body) => {
                if(error)
                    return reject(error);

                if(response.statusCode === 401)
                    return reject('bad_auth');

                if (!body || body.length < 2 || (response.statusCode && response.statusCode !== 200))
                    return reject(new Error(`Body empty : ${body}`));

            });
    });
}

exports.sendMessage = async function( message ) {

    try{
        if(token === ''){
            await auth()
                .then( rezult => {
                    token = rezult;
                });
        }
        telegramSend(message)
            .catch( bad_auth => {
                token = '';
                this.sendMessage(message);
            });
    } catch (error){
        console.error(' - telegramController - ', error );
    }

};
