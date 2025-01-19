const Axios = require('axios');

const Config = require('../../config.json');

/**
 * 
 * @param {Number} ID 
 * @returns {Object}
 */
module.exports = async function (ID) {

    return Data = await Axios({
        method: "GET",
        url: `${Config.ConvoyPanelURL}/api/application/users?filter[id]=${ID}`,
        headers: {
            "Authorization": `Bearer ${Config.ConvoyToken}`
        },
        timeout: 30 * 1000
    });
};