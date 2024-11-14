const Axios = require('axios');
const Discord = require('discord.js');

const Config = require('./config.json');

const Client = new Discord.Client({
    intents: 3276799,
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.ThreadMember,
        Discord.Partials.User
    ],
    presence: {
        activities: [
            {
                name: "🌐 panel.danbot.host",
                type: Discord.ActivityType.Custom
            }
        ],
        status: "online"
    }
});

// ;(async() => {
//     await Axios.get('https://manage.danbot.cloud/api/application/users', {
//         headers: {
//             Authorization: "Bearer " + Config.ConvoyToken,
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         }
//     }).then(async (Response) => {
//         const JSON = Response.data;

//         const Usernames = JSON.data.map(User => User.name);

//         console.log(Usernames);
//     });
// })();

module.exports = Client;
require('./src/handler/index.js');


Client.login(Config.DiscordToken);