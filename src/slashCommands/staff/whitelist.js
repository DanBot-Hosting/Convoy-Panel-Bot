module.exports.description = "Allow staff to whitelist users.";

const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } = require('discord.js');
const { QuickDB } = require('quick.db');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

const Config = require('../../../config.json');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("whitelist")
        .setDescription("Allow staff to whitelist users.")
        .addUserOption(Option => 
            Option.setName('user')
                .setDescription('The user to whitelist.')
                .setRequired(true)
        )
        .addBooleanOption(Option => 
            Option.setName('status')
                .setDescription('The status of the whitelist.')
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

    if(!Interaction.member.roles.cache.has(Config.DiscordBot.StaffRole)) return await Interaction.reply({ content: "You do not have permission to use this command.", flags: MessageFlags.Ephemeral });

    const Database = await DB();
    const Whitelist = Database.table("Whitelisted");

    const User = Interaction.options.getUser('user');
    const Status = Interaction.options.getBoolean('status');

    if(User.bot) return await Interaction.reply({ content: "You cannot whitelist a bot.", flags: MessageFlags.Ephemeral });

    await Whitelist.set(User.id, Status);

    await Interaction.reply({ content: `Successfully updated the whitelist status for ${User.toString()} to \`${Status}\`.`, flags: MessageFlags.Ephemeral });
};