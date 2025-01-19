const Axios = require('axios');

const Config = require('../../config.json');

/**
 * 
 * @description This will reset the password of an existing VPS account.
 * 
 * @param {Object} AccountReturnData 
 * @param {String} NewPassword
 * @returns {Object}
 */
module.exports = async function (AccountReturnData, NewPassword) {

    return Data = await Axios({
        method: "PUT",
        url: `${Config.ConvoyPanelURL}/api/application/users/${AccountReturnData.id}`,
        headers: {
            "Authorization": `Bearer ${Config.ConvoyToken}`
        },
        data: {
            "email": AccountReturnData.email,
            "root_admin": AccountReturnData.root_admin,
            "name": AccountReturnData.name,
            "password": NewPassword
        },
        timeout: 30 * 1000
    });
};