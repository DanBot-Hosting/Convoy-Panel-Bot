const Axios = require('axios');

const Config = require('../../config.json');

module.exports = async function () {

    return Data = await Axios({
        method: "GET",
        url: `${Config.ConvoyPanelURL}/api/application/users`,
        headers: {
            "Authorization": `Bearer ${Config.ConvoyToken}`
        },
        params: {
            "per_page": 100
        },
        timeout: 30 * 1000
    });
};