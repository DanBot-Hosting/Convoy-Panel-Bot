const { QuickDB } = require('quick.db');

module.exports = async () => {
    console.log("Database handler is ready!");

    const DB = new QuickDB({
        filePath: './database.sqlite'
    });

    return DB;
}