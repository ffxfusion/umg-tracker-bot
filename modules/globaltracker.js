const server = require("../schema/guild.js");
const { ChannelType } = require("discord.js");

module.exports.run = async(client, message, args, mentionFix, getUser) => {
    const category = await message.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === "syaro tracker");
    let channel = await server.findOne({ guildId: message.guild.id }).catch(err => console.log(err));

    if (!category) {
        return message.channel.send("Tracker has not been setup, use the 'setup' command.");
    }

    if (!isNaN(channel.config.globaltracker.channelID)) {
        return message.channel.send("Global tracker has already been setup.");
    }

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
    }).catch(err => console.log(err));

    message.channel.send("Global tracker has been setup. This tracker will log all rare spawns that are 100M+.");

    console.log(`[SETUP] ${message.guild.name} (${message.guild.id}) global tracker has been setup.`);
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