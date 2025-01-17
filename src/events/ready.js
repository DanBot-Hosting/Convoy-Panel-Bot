const Discord = require('discord.js');

const getAllUsers = require('../utilities/getAllUsers.js');

/**
 * 
 * @param {Discord.Client} Client 
 */
module.exports = async (Client) => {
    console.log(`Logged in as ${Client.user.tag}!`);

    const DB = await require('../handler/database.js')();

    // Create a new SlashCommandBuilder instance
    const { SlashCommandBuilder } = require('@discordjs/builders');

    // Define the slash command
    const command = new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello to the user.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the person to greet')
                .setRequired(true)
        );

    // Register the command with the Discord API
    await Client.application.commands.create(command);
};