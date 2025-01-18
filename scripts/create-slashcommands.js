const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const Config = require('../config.json')
const fs = require('fs');

var Commands = [];

const CommandsDir = fs.readdirSync("./src/slashCommands");

for (SubCommandDir of CommandsDir) {
    const SubCommandDirFiles = fs.readdirSync(`./src/slashCommands/${SubCommandDir}`).filter(m => !m.endsWith(".json")).map(m => m.replace(".js", ""));

    let CommandBuild = new SlashCommandBuilder()
        .setName(SubCommandDir)
        .setDescription("View this command for more options.");
    
    for (SubCommandFile of SubCommandDirFiles) {
        const SubCommand = require(`../src/slashCommands/${SubCommandDir}/${SubCommandFile}.js`);

        CommandBuild.addSubcommand(SubCommand.commandData);
    }

    Commands.push(CommandBuild.toJSON());
};


// Initialize the REST client.
const Rest = new REST({ version: '10' }).setToken(Config.DiscordToken);

// Register commands.
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await Rest.put(
            Routes.applicationGuildCommands(Config.DiscordBot.ClientId, Config.DiscordBot.MainGuildId),
            { body: Commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();