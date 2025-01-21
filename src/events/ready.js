const Discord = require('discord.js');
const Chalk = require('chalk');
const { exec } = require("child_process");
const Util = require('util');
const execPromise = Util.promisify(exec);

const Config = require('../../config.json');

/**
 * 
 * @param {Discord.Client} Client 
 */
module.exports = async (Client) => {

    console.log(
        Chalk.magenta("[DISCORD] ") + Chalk.green(Client.user.username + " has logged in!"),
    );

    // Just starts the DB.
    await require('../handler/database.js')();

    setInterval(async () => {
        try {
            const { stdout } = await execPromise('git pull');
    
            if (!stdout.includes("Already up to date.")) {
                await Client.channels.cache
                    .get(Config.DiscordBot.GitHubChannel)
                    .send(
                        `<t:${Math.floor(Date.now() / 1000)}:f> Automatic update from GitHub, pulling files.\n\`\`\`${stdout}\`\`\``,
                    );
                setTimeout(() => {
                    process.exit();
                }, 5000);
            }
        } catch (Error) {
        }
    }, 30 * 1000);
};