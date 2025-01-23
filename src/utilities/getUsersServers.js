const Axios = require('axios');

const Config = require('../../config.json');

/**
 * 
 * @returns {Object}
 */
module.exports = async function (ID) {

    return Data = await Axios({
        method: "GET",
        url: `${Config.ConvoyPanelURL}/api/application/servers?filter[user_id]=${ID}`,
        headers: {
            "Authorization": `Bearer ${Config.ConvoyToken}`
        },
        params: {
            "per_page": 100,
        },
        timeout: 30 * 1000
    });
};