const Discord = require('discord.js');

const getAllUsers = require('../utilities/getAllUsers.js');

/**
 * 
 * @param {Discord.Client} Client 
 */
module.exports = async (Client) => {
    console.log(`Logged in as ${Client.user.tag}!`);

    const DB = await require('../handler/database.js')();
};