const jwt = require('jsonwebtoken');
const config = require('./config/config.json');
const authUser = function (body) {
    const usersList = require('./config/config.json').servers;
    return new Promise((resolve, reject) => {
        for (var index in usersList) {
            if (body.login === usersList[index].login && body.psw === usersList[index].psw)
                resolve({
                    serverName: index,
                })
        }
        reject(new Error('User not exist'));
    })
}
exports.sign_in = async function (body, expiresIn) {
    try {
        let user = await authUser(body)
        let token = jwt.sign(
            user,
            config.secret_key,
            { expiresIn: expiresIn }
        )
        return ({ token: token });
    } catch (error) {
        throw new Error(error);
    }
};
exports.getUserFromHead = function (req) {
    return new Promise((resolve, reject) => {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
            jwt.verify(req.headers.authorization.split(' ')[1], config.secret_key, function (err, decode) {
                if (err) reject((new Error('Unauthorized user')));
                if(typeof decode=='undefined')
                    reject(new Error('ERROR!!!'));

                resolve(decode);
            })
        }else reject((new Error('Unauthorized user')))
    });
}