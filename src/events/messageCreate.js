const Discord = require("discord.js");
const Chalk = require("chalk");
const fs = require('fs');
const path = require('path');

const Config = require('../../config.json');

/**
 * 
 * @param {Discord.Client} Client 
 * @param {Discord.Message} Message 
 */
module.exports = async (Client, Message) => {
    if (Message.author.bot) return; // Stop bots from running commands.
    if (Message.channel.type === Discord.ChannelType.DM) return; // Stop commands in DMs.

    const Prefix = Config.DiscordBot.Prefix;

    if (!Message.content.toLowerCase().startsWith(Prefix.toLowerCase())) return;

    const args = Message.content.slice(Prefix.length).trim().split(/ +/g);
    const commandargs = Message.content.split(" ").slice(1).join(" ");
    const command = args.shift().toLowerCase();

    console.log(
        Chalk.magenta("[DISCORD] ") +
            Chalk.yellow(
                `[${Message.author.username}] [${Message.author.id}] >> ${Prefix}${command} ${commandargs}`,
            ),
    );

    try {

        const categoriesPath = path.join(__dirname, '../commands');
        const categories = fs.readdirSync(categoriesPath).filter(x => fs.statSync(path.join(categoriesPath, x)).isDirectory());

        if (categories.includes(command)) {
            if (!args[0]) {
                let commandFile = require(`../commands/${command}/help.js`);
                await commandFile.run(Client, Message, args);
            } else {
                let commandFile = require(`../commands/${command}/${args[0]}.js`);
                await commandFile.run(Client, Message, args);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            await commandFile.run(Client, Message, args);
        }
    } catch (Error) {
        if (!Error.message.startsWith("Cannot find module")) {
            console.log("Error loading module:", Error);
        }
    }
};