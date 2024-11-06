const Axios = require('axios');

module.exports = async function (Endpoint, Method) {
    try {
        await Axios

        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
};