module.exports.description = "Allows users to link to a existing VPS account.";

const { Client, ChatInputCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, MessageFlags, User } = require('discord.js');
const { QuickDB } = require('quick.db');

const sendEmail = require('../../utilities/sendEmail.js');
const generateCode = require('../../utilities/generateCode.js');
const createNewUser = require('../../utilities/createNewUser.js');
const generatePassword = require('../../utilities/generatePassword.js');

/** @type {QuickDB} */
const DB = require('../../handler/database.js');

/** 
 * Building of the subcommand for the slash command. 
 * @param {SlashCommandSubcommandBuilder} SubCommand 
 */
module.exports.commandData = (SubCommand) => 
    SubCommand
        .setName("new")
        .setDescription("Create a new VPS Panel Account.");

/**
 * 
 * @param {Client} Client 
 * @param {ChatInputCommandInteraction} Interaction 
 */
module.exports.run = async function(Client, Interaction){

    const Database = await DB();
    const Whitelisted = Database.table("Whitelisted");

    const UserWhitelist = await Whitelisted.get(Interaction.user.id);

    if(!UserWhitelist) return await Interaction.reply({ content: "You do not have permission to use this command.", flags: MessageFlags.Ephemeral });

    const Modal = new ModalBuilder()
        .setCustomId('newModal')
        .setTitle('Account Creation');

    const nameInput = new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel("What is your Name?")
        .setStyle(TextInputStyle.Short);

    const emailInput = new TextInputBuilder()
        .setCustomId('emailInput')
        .setLabel("What is your Email?")
        .setStyle(TextInputStyle.Short);

    const ActionRow = new ActionRowBuilder().addComponents(nameInput);
    const ActionRow2 = new ActionRowBuilder().addComponents(emailInput);

    Modal.addComponents(ActionRow, ActionRow2);

    await Interaction.showModal(Modal);

    const filter = (i) => i.customId === 'newModal' && i.user.id === Interaction.user.id;

    await Interaction.awaitModalSubmit({ filter, time: 5 * 60_000 })
        .then(async (modalInteraction) => {

            const email = modalInteraction.fields.getTextInputValue('emailInput');
            const name = modalInteraction.fields.getTextInputValue('nameInput');
    
            let Code = generateCode();
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
    
                const verificationFilter = (i) =>
                    i.customId === 'verificationModal' && i.user.id === Interaction.user.id;
    
                await buttonInteraction.awaitModalSubmit({ filter: verificationFilter, time: 5 * 60_000 })
                    .then(async (verificationInteraction) => {

                        const userCode = verificationInteraction.fields.getTextInputValue('codeInput');
    
                        if (userCode === Code) {
                            await verificationInteraction.reply({
                                content: "Verification successful! Your account details will arrive via email.",
                                flags: MessageFlags.Ephemeral,
                            });
    
                            await SettingAccountData(name, email);
                        } else {
                            await verificationInteraction.reply({
                                content: "Invalid verification code. Please try again later.",
                                flags: MessageFlags.Ephemeral,
                            });
                        }
                    })
                    .catch(async (Error) => {
                        if (Error.code === 'InteractionCollectorError' && Error.message.includes('time')) {
                            // Specific handling for timeout
                            await buttonInteraction.followUp({
                                content: "Verification process timed out. Please try again.",
                                flags: MessageFlags.Ephemeral,
                            });
                        } else {
                            // General error handling for other cases
                            console.error(Error);
                    
                            await buttonInteraction.followUp({
                                content: "An error occurred while processing your request. Please try again later.",
                                flags: MessageFlags.Ephemeral,
                            });
                        }
                    });
            });
    
            collector.on('end', async (collected) => {
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
     * @description This function is used to set the account data for the user.
     * @param {String} Name
     * @param {String} Email
     */
    async function SettingAccountData(Name, Email){

        const Password = await generatePassword();

        const CreateUserAccount = await createNewUser(Name, Email, Password);

        const UserAccounts = Database.table("UserAccounts");

        const JSON = CreateUserAccount.data; //This is then the object that's documented from API docs.

        await UserAccounts.set(`${Interaction.user.id}.email`, JSON.data.email);
        await UserAccounts.set(`${Interaction.user.id}.name`, JSON.data.name);
        await UserAccounts.set(`${Interaction.user.id}.id`, JSON.data.id);

        await Interaction.user.send({ content: `Your account has been created. Link: https://manage.danbot.cloud\n\nHere are your account details:\n\n**Email:** ${JSON.data.email}\n**Password:** ${Password}\n\nPlease keep this information safe.`, ephemeral: true });

        await sendEmail(JSON.data.email, "Account Information", `Your account has been created. Link: https://manage.danbot.cloud\n\nHere are your account details:\n\n**Email:** ${JSON.data.email}\n**Password:** ${Password}\n\nPlease keep this information safe.`);
    }
}
