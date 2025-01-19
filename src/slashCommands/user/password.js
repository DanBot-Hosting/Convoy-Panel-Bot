module.exports.description = "Reset the password.";

const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

const generatePassword = require('../../utilities/generatePassword.js');
const getSpecificUserId = require('../../utilities/getSpecificUserId.js');
const resetPassword = require('../../utilities/resetPassword.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("password")
        .setDescription("Reset the password of an existing VPS account.");

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
        const newPassword = generatePassword();

        const User = await getSpecificUserId(UserAcc.id);

        const AccountData = User.data.data[0];

        await resetPassword(AccountData, newPassword);

        await Interaction.reply({
            content: `Your password has been reset to: ||\`${newPassword}\`||`,
            flags: MessageFlags.Ephemeral
        });

        await Interaction.user.send({
            content: `Your password has been reset to: ||\`${newPassword}\`||`
        });
    }
}