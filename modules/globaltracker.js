const server = require("../schema/guild.js");
const { ChannelType } = require("discord.js");
const util = require("../util.js");

module.exports.run = async (client, message, args, mentionFix, getUser) => {
    let channel = await server.findOne({ guildId: message.guild.id }).catch(err => util.logger(err));

    if (!isNaN(channel.config.globaltracker.channelID)) {
        return message.channel.send("Global tracker has already been setup.");
    }

    const category = await util.handleChannelCreation(message, ChannelType.GuildCategory);

    if (isNaN(channel.config.globaltracker.channelID)) {
        channel = await message.guild.channels.create({
            name: "global-tracker",
            type: ChannelType.GuildText,
            parent: category.id
        });
    }

    let tracker = await channel.fetchWebhooks();

    if (tracker.size === 0) {
        tracker = await channel.createWebhook({
            name: "tracker"
        });
    }

    await server.findOneAndUpdate({ guildId: message.guild.id }, {
        $set: {
            "config.globaltracker": {
                webhookToken: tracker.token,
                webhookID: tracker.id,
                channelID: channel.id, 
            }
        }
    }).catch(err => util.logger(err));

    message.channel.send("Global tracker has been setup. This tracker will log all rare spawns that are 100M+.");

    util.logger(`[SETUP] ${message.guild.name} (${message.guild.id}) global tracker has been setup.`);
}

module.exports.config = {
    name: "globaltracker",
    description: "same to rare-spawn but for finds that are 100M+.",
    aliases: ["globaltrack", "global"],
    usages: [
        "globaltracker"
    ],
    examples: [
        "globaltracker"
    ]
}
