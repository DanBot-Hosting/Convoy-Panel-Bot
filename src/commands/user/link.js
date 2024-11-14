const Discord = require('discord.js');

exports.description = "Linking your account to the panel.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    await message.channel.send({ content: "Hello"});
};