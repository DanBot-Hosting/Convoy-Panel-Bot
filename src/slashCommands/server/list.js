module.exports.description = "VPS info.";

const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

const getUsersServers = require('../../utilities/getUsersServers.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("list")
        .setDescription("List the VPS you have.");

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
        const ServerResponse = await getUsersServers(UserAcc.id);
        const JSON = ServerResponse.data; //This is then the object that's documented from API docs.

        if (JSON.data.length == null) {
            // Do Nothing. - Reply to just make sure that users know and command isn't broken.
            return Interaction.reply({
                content: "You do not have any VPS servers.",
                flags: MessageFlags.Ephemeral
            });
        } else {
            const Dot = "<:dot:1164732475675783278>";

            const ResponseEmbed = new EmbedBuilder()
            .setTitle("Server List")
            .setDescription(`${JSON.data.map((Server) => `${Dot}**Server Name:** ${Server.name}\n${Dot}**Server ID:** ${Server.id}\n${Dot}**Server UUID:** ${Server.uuid}\n${Dot}**Server Node ID:** ${Server.node_id}\n${Dot}**Server Hostname:** ${Server.hostname}\n${Dot}**Server VMID:** ${Server.vmid}\n${Dot}**Server Internal ID:** ${Server.internal_id}\n\n`).join("\n----------------------")}`)
            .setTimestamp()
            .setColor("Blue")
            .setFooter({ text: "Command Executed by: " + Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL() });

            await Interaction.reply({
                embeds: [ResponseEmbed],
                flags: MessageFlags.Ephemeral
            }).catch((Error) => {});
        }
    }
}