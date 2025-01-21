const Discord = require('discord.js');
const Chalk = require('chalk');

const { Sentry } = require('../../index.js')

/**
 * 
 * @param {Discord.Client} Client 
 * @param {Discord.ChatInputCommandInteraction} Interaction 
 */
module.exports.run = async function(Client, Interaction){

    console.log(
        Chalk.greenBright(`Slash Command: `) +
        Chalk.blueBright(`${Interaction.commandName}`) +
        Chalk.magentaBright(` ${Interaction.options.getSubcommand()}`) +
        Chalk.yellowBright(` - ${Interaction.user.username}`) +
        Chalk.cyanBright(` | ${Interaction.user.id}`)
    );
    
    try {
        await require(`../slashCommands/${Interaction.commandName}/${Interaction.options.getSubcommand()}.js`).run(Client, Interaction);
    } catch (Error) {
        Sentry.captureException(Error);
    }
};