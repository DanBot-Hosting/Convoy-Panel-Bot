const Discord = require('discord.js');
const fs = require('fs');

const Config =  require('../../config.json');

/**
 * 
 * @param {Discord.Client} Client 
 * @param {Discord.ChatInputCommandInteraction} Interaction 
 */
module.exports.run = async function(Client, Interaction){
    return require(`../slashCommands/${Interaction.commandName}/${Interaction.options.getSubcommand()}.js`).run(Client, Interaction);
};