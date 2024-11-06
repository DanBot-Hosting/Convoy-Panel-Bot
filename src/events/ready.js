const Discord = require('discord.js');

/**
 * 
 * @param {Discord.Client} Client 
 */
module.exports = async (Client) => {
    console.log(`Logged in as ${Client.user.tag}!`);

    // const file = new Discord.AttachmentBuilder('https://thehungrybeast.com/wp-content/uploads/2022/08/2valorant-szachy_kv.jpg');
    // await Client.guilds.cache.get('639477525927690240').channels.cache.get('898050443446464532').send({ files: [file] });
}
