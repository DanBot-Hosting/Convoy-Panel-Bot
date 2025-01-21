const { QuickDB, MySQLDriver } = require('quick.db');
const Config = require('../../config.json');

module.exports = async () => {
    const MySQL = new MySQLDriver({
        host: Config.MySQL.Host,
        user: Config.MySQL.Username,
        password: Config.MySQL.Password,
        database: Config.MySQL.Database
    });

    await MySQL.connect().catch((Error) => {})

    const DB = await new QuickDB({ driver: MySQL });

    return DB;
}