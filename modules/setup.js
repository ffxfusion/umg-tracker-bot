const server = require("../schema/guild.js");
const { ChannelType } = require("discord.js");

module.exports.run = async (client, message, args, mentionFix, getUser) => {
    let category = await message.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === "syaro tracker");
    let channel = await server.findOne({ guildId: message.guild.id }).catch(err => console.log(err));

    if (!category) {
        category = await message.guild.channels.create({
            name: "syaro tracker",
            type: ChannelType.GuildCategory
        });
    }

    if (!isNaN(channel.config.rarespawn.channelID)) {
        return message.channel.send("Tracker has already been setup.");
    }

    if (isNaN(channel.config.rarespawn.channelID)) {
        channel = await message.guild.channels.create({
            name: "rare-spawn",
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
            "config.rarespawn": {
                webhookToken: tracker.token,
                webhookID: tracker.id,
                channelID: channel.id, 
            }
        }
    }).catch(err => console.log(err));

    message.channel.send("Tracker has been setup. It will log rare spawns in the channel, for username tracker, run the 'track' command.");
    console.log(`[SETUP] ${message.guild.name} (${message.guild.id}) has been setup.`);
}

module.exports.config = {
    name: "setup",
    description: "setup the rare-spawn tracker and everything else.",
    aliases: [],
    usages: [
        "setup",
    ],
    examples: [
        "setup",
    ]
}