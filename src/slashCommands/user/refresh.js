module.exports.description = "Refresh account information.";

const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

const getSpecificUserId = require('../../utilities/getSpecificUserId.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("refresh")
        .setDescription("Refresh an existing VPS account.");

/**
 * 
 * This will run when this slash command is executed.
 * 
 * @param {Client} Client 
 * @param {ChatInputCommandInteraction} Interaction 
 */
module.exports.run = async function(Client, Interaction){

    const Database = await DB();
    const Whitelisted = Database.table("Whitelisted");
    const UserAccounts = Database.table("UserAccounts");

    const UserWhitelist = await Whitelisted.get(Interaction.user.id);

    if(!UserWhitelist) return await Interaction.reply({ content: "You do not have permission to use this command.", flags: MessageFlags.Ephemeral });

    const UserAcc = await UserAccounts.get(Interaction.user.id);

    if(UserAcc == null){
        await Interaction.reply({
            content: "You do not have an account linked to your Discord account. You must create an account."
        })
    } else {
        const ServerResponse = await getSpecificUserId(UserAcc.id);
        const JSON = ServerResponse.data; //This is then the object that's documented from API docs.

        if (JSON.data.length == 0) {
            // Do Nothing.
        } else {
            const UserObject = JSON.data[0];

            await UserAccounts.set(`${Interaction.user.id}.email`, UserObject.email);
            await UserAccounts.set(`${Interaction.user.id}.name`, UserObject.name);
            await UserAccounts.set(`${Interaction.user.id}.id`, UserObject.id);

            await Interaction.reply({
                content: "Your account has been refreshed.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}