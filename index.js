const Discord = require('discord.js');
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

const Config = require('./config.json');

const Client = new Discord.Client({
    intents: 3276799,
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
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

Sentry.init({
    dsn: Config.Sentry.DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0
});

module.exports.Sentry = Sentry;

process.on("unhandledRejection", (Error) => Sentry.captureException(Error));

module.exports = Client;
require('./src/handler/index.js');


Client.login(Config.DiscordToken);