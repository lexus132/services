const express = require("express");
const bodyParser = require('body-parser');
const config = require('./config/config.json');
const telegramBot = require('node-telegram-bot-api');
const userController = require('./userController');

const botError = new telegramBot(config.telegram_token, {polling: true});
const app = express();

const Status = {
    NOT_FOUND: 404,
    NOT_FOUND_MSG: '404 - Resource Not found',
    OK: 200,
    OK_MSG: '200 - Success',
    SERVER_ERROR: 500,
    SERVER_ERROR_MSG: '500 - Battery Error'
};
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.json({type: 'json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/auth', async (req, res) => {
    try {
        let user = await userController.sign_in(req.body, '15m');
        res.send(user);

    } catch (error) {
        res.status(401).send({'msg':'Unauthorized user'});
    }
})
app.get('/message', async(req, res) => {
    try {
        let user = await userController.getUserFromHead(req);
        botError.sendMessage(config.telegram_chat_id,  `${user.serverName}  ${req.query.content}`);
        res.send(user);
    } catch (error) {
        res.status(401).send({'msg':'Unauthorized user'});
    }
})


app.listen(8082, function() {
    botError.sendMessage(config.telegram_chat_id, "Telegram service start");
});