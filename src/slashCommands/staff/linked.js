module.exports.description = "Check account status of a person.";

const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("linked")
        .setDescription("Information of an existing VPS account.")
        .addUserOption(Option => 
            Option
                .setName("user")
                .setDescription("The user to check the account information.")
                .setRequired(true)
        );

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

    const User = Interaction.options.getUser('user');

    if(User.bot) return await Interaction.reply({ content: "That's a bot.", flags: MessageFlags.Ephemeral });

    const UserAcc = await UserAccounts.get(Interaction.options.getUser("user")?.id);
    const UserWhitelistCheck = await Whitelisted.get(Interaction.options.getUser("user")?.id);

    if(UserAcc == null){
        await Interaction.reply({
            content: "This user does not have a Discord account linked. Whitelist Status: " + (UserWhitelistCheck ? "Whitelisted." : "Not Whitelisted."),
            flags: MessageFlags.Ephemeral
        });
    } else {

        const ResponseEmbed = new EmbedBuilder()
            .setTitle("Account Information")
            .setTimestamp()
            .addFields(
                { name: "Account Name", value: "```" + UserAcc.name.toString() + "```" },
                { name: "Account Email", value:  "```" + UserAcc.email.toString() + "```" },
                { name: "Account ID", value:  "```" + UserAcc.id.toString() + "```" },
                { name: "Whitelist Status:", value: "```" + (UserWhitelistCheck ? "Whitelisted" : "Not Whitelisted") + "```" },
                { name: "Discord ID", value:  "```" + Interaction.options.getUser("user")?.id.toString() + "```" }
            )
            .setColor("Blue")
            .setFooter({ text: "Command Executed by: " + Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL() });

        await Interaction.reply({
            embeds: [ResponseEmbed],
            flags: MessageFlags.Ephemeral
        });
    }
}