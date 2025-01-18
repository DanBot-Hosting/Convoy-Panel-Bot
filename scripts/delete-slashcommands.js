const Discord = require('discord.js')
const Config = require('../config.json')

const Client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds],
})

const GUILD_ID = Config.MainGuildId

Client.once('ready', async () => {
    console.log(`Logged in as ${Client.user.tag}!`)

    //Delete all global commands.
    const globalCommands = await Client.application.commands.fetch()
    for (const command of globalCommands.values()) {
        await command.delete()
        console.log(`Deleted global command: ${command.name}`)
    }

    //Delete guild-specific commands given ID.
    const guild = Client.guilds.cache.get(GUILD_ID)
    if (guild) {
        const guildCommands = await guild.commands.fetch()
        for (const command of guildCommands.values()) {
            await command.delete()
            console.log(`Deleted guild command: ${command.name}`)
        }
    } else {
        console.log(`Guild with ID ${GUILD_ID} not found.`)
    }

    await Client.destroy()
})

Client.login(Config.DiscordToken)
