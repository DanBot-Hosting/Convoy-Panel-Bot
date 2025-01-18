const Axios = require('axios');

const Config = require('../../config.json');

/**
 * 
 * @param {String} Email 
 * @returns {Object}
 */
module.exports = async function (Email) {

    return Data = await Axios({
        method: "GET",
        url: `${Config.ConvoyPanelURL}/api/application/users?filter[email]=${Email}`,
        headers: {
            "Authorization": `Bearer ${Config.ConvoyToken}`
        },
        timeout: 30 * 1000
    });
};