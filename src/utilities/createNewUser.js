const Axios = require('axios');

const Config = require('../../config.json');

/**
 * 
 * Creates a new user account.
 * @param {String} Name
 * @param {String} Email
 * @param {String} Password
 * @returns {Object}
 */
module.exports = async function (Name, Email, Password) {

    return Data = await Axios({
        method: "POST",
        url: `${Config.ConvoyPanelURL}/api/application/users`,
        headers: {
            "Authorization": `Bearer ${Config.ConvoyToken}`
        },
        data: {
            "root_admin": false,
            "name": Name,
            "email": Email,
            "password": Password
        },
        timeout: 30 * 1000
    });
};