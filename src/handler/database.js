const { QuickDB } = require('quick.db');

module.exports = async () => {
    console.log("Database handler is ready!");

    const DB = new QuickDB({
        filePath: './database.sqlite'
    });

    const users = DB.table('users');

    const usersData = await users.all();

    console.log(usersData);
}