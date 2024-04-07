const server = require("../schema/guild.js");
const { ChannelType } = require("discord.js");
const util = require("../util.js");

module.exports.run = async (client, message, args, mentionFix, getUser) => {
    let channel = await server.findOne({ guildId: message.guild.id }).catch(err => util.logger(err));

    if (!isNaN(channel.config.raretracker.channelID)) {
        return message.channel.send("Rare find tracker has already been setup.");
    }

    const category = await util.handleChannelCreation(message, ChannelType.GuildCategory);

    if (isNaN(channel.config.raretracker.channelID)) {
        channel = await message.guild.channels.create({
            name: "rare-find-tracker",
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
            "config.raretracker": {
                webhookToken: tracker.token,
                webhookID: tracker.id,
                channelID: channel.id, 
            }
        }
    }).catch(err => util.logger(err));

    message.channel.send("Rare find tracker has been setup. Tracker will now log rare finds that are ping worthy. (fingu, 20b, 75b+)");

    util.logger(`[SETUP] ${message.guild.name} (${message.guild.id}) rare find tracker has been setup.`);
}

module.exports.config = {
    name: "raretracker",
    description: "same as rare-spawn but for finds that are ping worthy. (fingu, 20b, 75b+)",
    aliases: ["raretrack", "rare", "rarefindtracker"],
    usages: [
        "raretracker"
    ],
    examples: [
        "raretracker"
    ]
}