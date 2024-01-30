const { WebhookClient } = require("discord.js");
const server = require("./schema/guild.js");

const getInfo = async () => {
    let data = await server.find({});
    return data;
}

const sendHook = (id, token, content) => {
    const hook = new WebhookClient({ id: id, token: token });

    hook.send(content).catch(console.error);
}

const sendRarespawn = async (msg) => {
    const data = await getInfo();
    for (const id of data) {
        if (isNaN(id.config.rarespawn.webhookID)) continue;

        try {
            sendHook(id.config.rarespawn.webhookID, id.config.rarespawn.webhookToken, msg)
        } catch (err) {
            console.log(`[ERROR] ${id.guildName} (${id.guildId}) | ${err}`);
        }
    }
}

const sendUserspawn = async (msg, miner) => {
    const data = await getInfo();
    for (const id of data) {
        for (const user of id.config.userspawn) {
            if (user.username !== miner || isNaN(user.webhookID)) continue;
            try {
                sendHook(user.webhookID, user.webhookToken, msg);
            } catch (err) {
                console.log(`[ERROR] ${id.guildName} (${id.guildId}) | ${err}`);
            }
        }
    }
}

const formatData = (message) => {
    const embed = message.embeds[0];
    const data = embed.description.split(" | ").map(item => item.split("**"));

    return {
        ore: embed.title,
        miner: data[0][1],
        position: data[1][1],
        pickaxe: data[2][1],
        rawChance: data[3][1],
        rng: data[3][3],
        rare: false
    }
}

const convertToNumber = (rawChance) => {
    let number = 0;
    if (rawChance.includes("T")) {
        number = parseFloat(rawChance.replace("T", "")) * 1000000000000;
    } else if (rawChance.includes("B")) {
        number = parseFloat(rawChance.replace("B", "")) * 1000000000;
    } else {
        number = parseFloat(rawChance);
    }
    return number;
}

const sendGlobal = async (msg) => {
    const data = await getInfo();
    for (const id of data) {
        if (isNaN(id.config.globaltracker.webhookID)) continue;

        try {
            sendHook(id.config.globaltracker.webhookID, id.config.globaltracker.webhookToken, msg);
        } catch (err) {
            console.log(`[ERROR] ${id.guildName} (${id.guildId}) | ${err}`);
        }
    }
}

const handleChannelDelete = (config, db) => {
    Object.assign(config, {
        channelID: "null",
        webhookID: "null",
        webhookToken: "null"
    });
    return db.save().catch(err => console.log(err));
}

const handleChannelDeleteAndLog = (config, channel, database, logMessage) => {
    if (config.channelID === channel.id) {
        handleChannelDelete(config, database);
        console.log(logMessage);
        return true;
    }
    return false;
}


const variantDetector = (embed) => {
    const variants = ["Altered", "Super", "Altered", "Gigantic", "Tiny", "EVIL"];
    const title = embed.title.split(" ");

    if (title.length === 1) {
        return "";
    }

    if (variants.includes(title[0]) && !title[1].includes(variants[0]) || variants.includes(title[1]) && title[1].includes(variants[2])){
        return title[0] === variants[1] && title[1] === variants[2] ? `${title[0]} ${title[1]}` : title[0] === variants[1] ? "" : title[0];
    } else {
        return "";
    }
}

module.exports = {
    getInfo,
    sendHook,
    sendRarespawn,
    sendUserspawn,
    formatData,
    convertToNumber,
    sendGlobal,
    handleChannelDelete,
    handleChannelDeleteAndLog,
    variantDetector
}
