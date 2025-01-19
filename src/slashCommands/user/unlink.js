module.exports.description = "Unlink an from an existing VPS account.";

const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("unlink")
        .setDescription("Unlink an from an existing VPS account.");

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
            content: "You do not have an account linked to your Discord account."
        })
    } else {
        await UserAccounts.delete(Interaction.user.id);

        await Interaction.reply({
            content: "Your account has been unlinked from your Discord account.",
            flags: MessageFlags.Ephemeral
        });
    }
}