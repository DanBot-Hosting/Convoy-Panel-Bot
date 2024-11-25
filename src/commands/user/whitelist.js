const Discord = require('discord.js');

const Config = require('../../../config.json');

exports.description = "Whitelist a user to use the bot.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    if(!message.member.roles.cache.has(Config.DiscordBot.Permissions.BotAdmin)) return message.reply({ content: "You do not have permission to use this command." });

    await message.channel.send('This command is currently disabled.');    
};