module.exports.description = "Allows users to link to an existing VPS account.";

const { Client, ChatInputCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, MessageFlags, User } = require('discord.js');
const { QuickDB } = require('quick.db');

const sendEmail = require('../../utilities/sendEmail.js');
const generateCode = require('../../utilities/generateCode.js');
const getSpecificUser = require('../../utilities/getSpecificUser.js');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("link")
        .setDescription("Link to an existing VPS account.");

/**
 * 
 * @param {Client} Client 
 * @param {ChatInputCommandInteraction} Interaction 
 */
module.exports.run = async function(Client, Interaction){

    const Database = await DB();
    const Whitelisted = Database.table("Whitelisted");
    const UserAccounts = Database.table("UserAccounts");

    if(await UserAccounts.get(Interaction.user.id)) return await Interaction.reply({ content: "You already have an account linked to your Discord account. Please use the `/user info` to see your information.", flags: MessageFlags.Ephemeral });

    const UserWhitelist = await Whitelisted.get(Interaction.user.id);

    if(!UserWhitelist) return await Interaction.reply({ content: "You do not have permission to use this command.", flags: MessageFlags.Ephemeral });

    const Modal = new ModalBuilder()
        .setCustomId('linkModal')
        .setTitle('Account Linking');

    const emailInput = new TextInputBuilder()
        .setCustomId('emailInput')
        .setLabel("What is your Email?")
        .setStyle(TextInputStyle.Short);

    const ActionRow = new ActionRowBuilder().addComponents(emailInput);

    Modal.addComponents(ActionRow);

    await Interaction.showModal(Modal);

    const filter = (i) => i.customId === 'linkModal' && i.user.id === Interaction.user.id;

    await Interaction.awaitModalSubmit({ filter, time: 5 * 60_000 })
        .then(async (modalInteraction) => {

            const email = modalInteraction.fields.getTextInputValue('emailInput');
    
            const Code = generateCode();
            console.log("Verification Code: " + Code);
            await sendEmail(email, "Email Verification", `Your verification code is: ${Code}`);
    
            // Button for sending the Verification Code.
            const resendButton = new ButtonBuilder()
                .setCustomId('sendCode')
                .setLabel('Click Here To Send Verification Code')
                .setStyle(ButtonStyle.Primary);
    
            const actionRow = new ActionRowBuilder().addComponents(resendButton);
    
            await modalInteraction.reply({
                content: "A verification code has been sent to your email. Click the button below to enter the verification code.",
                components: [actionRow],
                flags: MessageFlags.Ephemeral,
            });
    
            const buttonFilter = (i) => i.customId === 'sendCode' && i.user.id === Interaction.user.id;
            const collector = modalInteraction.channel.createMessageComponentCollector({ filter: buttonFilter, time: 5 * 60_000 });
    
            collector.on('collect', async (buttonInteraction) => {
                resendButton.setDisabled(true);

                await modalInteraction.editReply({
                    components: [new ActionRowBuilder().addComponents(resendButton)],
                    flags: MessageFlags.Ephemeral
                });

                const verificationModal = new ModalBuilder()
                    .setCustomId('verificationModal')
                    .setTitle('Enter Verification Code:');
    
                const codeInput = new TextInputBuilder()
                    .setCustomId('codeInput')
                    .setLabel('Verification Code')
                    .setStyle(TextInputStyle.Short);
    
                const modalActionRow = new ActionRowBuilder().addComponents(codeInput);
                verificationModal.addComponents(modalActionRow);
    
                await buttonInteraction.showModal(verificationModal);
    
                const verificationFilter = (i) => i.customId === 'verificationModal' && i.user.id === Interaction.user.id;
    
                await buttonInteraction.awaitModalSubmit({ filter: verificationFilter, time: 5 * 60_000 })
                    .then(async (verificationInteraction) => {
    
                        const userCode = verificationInteraction.fields.getTextInputValue('codeInput');
    
                        if (userCode === Code) {
                            await verificationInteraction.reply({
                                content: "Verification successful! If the email is linked to an account, you'll be linked.",
                                flags: MessageFlags.Ephemeral,
                            });
    
                            await SettingAccountData(email);
                            
                        } else {
                            await verificationInteraction.reply({
                                content: "Invalid verification code. Please try again.",
                                flags: MessageFlags.Ephemeral,
                            });
                        }
                    })
                    .catch(async () => {
                        await buttonInteraction.followUp({
                            content: "You ran out of time to type out the code. Please use the command again to link your account.",
                            flags: MessageFlags.Ephemeral,
                        });
                    });
            });
    
            collector.on('end', async () => {
                resendButton.setDisabled(true);
    
                await modalInteraction.editReply({
                    content: "The button is now disabled. Please run the command again if you need to redo this process.",
                    components: [new ActionRowBuilder().addComponents(resendButton)],
                    flags: MessageFlags.Ephemeral
                });
            });
        })

        .catch(async () => {
            await Interaction.followUp({
                content: "You did not respond in time. Please use the command again to link your account.",
                flags: MessageFlags.Ephemeral
            });
        });
    
    /**
     * 
     * @param {String} Email
     */
    async function SettingAccountData(Email){

        const ServerResponse = await getSpecificUser(Email);
        const UserAccounts = Database.table("UserAccounts");

        const JSON = ServerResponse.data; //This is then the object that's documented from API docs.

        if (JSON.data.length == 0) {
            // Do Nothing.
        } else {
            const UserObject = JSON.data[0];

            await UserAccounts.set(`${Interaction.user.id}.email`, UserObject.email);
            await UserAccounts.set(`${Interaction.user.id}.name`, UserObject.name);
            await UserAccounts.set(`${Interaction.user.id}.id`, UserObject.id);
        }
    }
}