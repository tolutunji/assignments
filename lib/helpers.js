const config =  require('./config');
const crypto = require('crypto')


const helpers = {};


helpers.parseJsonToObject = function(str) {
    try {
        const obj = JSON.parse(str)
        return obj;
    } catch (error) {
        return {};
    }
};



helpers.hash = function(str) {
    if(typeof(str) === 'string'&& str.length > 0) {
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
        return hash
    } else {
        return false;
    }
};


helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if(strLength) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let str = '';
        for(i = 0; i <= strLength; i++) {
            const randomCharacters = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

            str += randomCharacters;
        }
        return str;
    } else {
        return false;
    }
}









module.exports = helpers;