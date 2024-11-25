const Fs = require('fs');
const Path = require('path'); 
const Discord = require('discord.js');

/**
 * {Discord.Client} Client
 */
const Client = require('../../index.js');

const BotEvents = Fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));

for (BotEvent of BotEvents) {
    const Event = require(Path.join(`../events/`, BotEvent));

    Client.on(BotEvent.split('.')[0], Event.bind(null, Client));
    delete require.cache[require.resolve(`../events/${BotEvent}`)]
}