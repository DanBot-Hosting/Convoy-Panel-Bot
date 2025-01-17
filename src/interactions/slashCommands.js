const Discord = require('discord.js');
const fs = require('fs');

const Config =  require('../../config.json');

/**
 * 
 * @param {Discord.Client} Client 
 * @param {Discord.ChatInputCommandInteraction} Interaction 
 */
module.exports.run = async function(Client, Interaction){
    console.log("[SLASH COMMAND TRIGGERED]:");

    console.log(Interaction);

    await Interaction.reply({ content: "Hello, World!", flags: Discord.MessageFlags.Ephemeral });
};