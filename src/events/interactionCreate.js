const Discord = require('discord.js')
const Chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const Config = require('../../config.json')

/**
 *
 * @param {Discord.Client} Client
 * @param {Discord.BaseInteraction} Interaction
 */
module.exports = async (Client, Interaction) => {

    //Checks if the command is a slash command. Also known as type 2: https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type

    if (Interaction.type == 2) {
        await require('../interactions/slashCommands.js').run(Client, Interaction);
    } else if (Interaction.type == 3) {

    } else if (Interaction.type == 4) {

    }
}
