const { Client } = require('discord.js');
const Fs = require('fs');
const Path = require('path'); 

/**
 * 
 * @param {Client} Client 
 */
module.exports = function InitializeHandlers(Client) {

    const BotEvents = Fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));

    for (const BotEvent of BotEvents) {
        const Event = require(Path.join(`../events/`, BotEvent));

        Client.on(BotEvent.split('.')[0], Event.bind(null, Client));
        delete require.cache[require.resolve(`../events/${BotEvent}`)];
    }
}