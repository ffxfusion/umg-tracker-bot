const fs = require("fs");
const data = require("./data");
const { connection } = require("mongoose");

const getModules = (path) => {
    const files = fs.readdirSync(path).filter(r => r.endsWith(".js"));

    for (const file of files) {
        const command = require(`${path}/${file}`);
        data.commands.set(command.config.name, command);

        for (const alias of command.config.aliases) {
            data.alias.set(alias, command.config.name);
        }
    }
}

const getEvents = (path, client) => {
    const files = fs.readdirSync(path).filter(r => r.endsWith(".js"));

    for (const file of files) {
        const event = require(`${path}/${file}`);
        const name = file.split(".")[0];
        
        client.on(name, event.bind(null, client));
    }
}

const getDB = (path) => {
    const files = fs.readdirSync(path).filter(r => r.endsWith(".js"));

    for (const file of files) {
        const event = require(`${path}/${file}`);
        const name = file.split(".")[0];
        
        connection.once(name, event.bind(null, connection));
    }
}

module.exports = {
    getModules,
    getEvents,
    getDB
}