const data = require("../data");
const util = require("../util.js");
const voidTracker = require("../voidTracker.js");

const guildId = "proxy server";

module.exports = async (client, message) => {
    // rare spawn tracker, global tracker, user tracker, etc
    if (message.guild.id === guildId && message.channel.id === "proxy server" && message.author.id === "proxy server") {
                
        data.embedData = util.formatData(message);
        data.embedData.variant = util.variantDetector(message.embeds[0]);

        const content = { embeds: [message.embeds[0]]};
        //await util.sendRarespawn({ content: data.embedData.rare ? "@everyone" : " ", embeds: [message.embeds[0]]});
        await util.sendRarespawn(content);
        await util.sendUserspawn(content, data.embedData.miner.toLowerCase());
        //await voidTracker(message, data.embedData);
        
        if (data.embedData.rng && data.embedData.rng.includes("/")) {
            if (util.convertToNumber(data.embedData.rng.split("/")[1].replace(/,/g, "")) >= 100000000) {
                await util.sendGlobal(content);
            }
        }

        if (data.embedData.rare) {
            await util.sendRareFind(content);
        }

        data.embedData = { ore: "", variant: "", miner: "", position: "", pickaxe: "", rawChance: "", rng: "", rare: false };
    }
    
    if (!message.content.startsWith(process.env.prefix) || message.author.bot || message.channel.type === "dm") return;

    const args = message.content.split(/ +/g);
    const mentionFix = message.cleanContent.slice(process.env.prefix).split(" ").slice(1);

    const command = args.shift().slice(process.env.prefix).toLowerCase();
    const register = data.commands.get(command.slice(process.env.prefix.length)) || data.commands.get(data.alias.get(command.slice(process.env.prefix.length)));

    const getUser = () => {
        return message.channel.guild.members.cache.find(r => r.user === message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || message.channel.guild.members.cache.find(r => r.user.username === args[0]) || message.channel.guild.members.cache.find(r => r.user.tag === args[0]);
    }

    if (register) {
        register.run(client, message, args, mentionFix, getUser);
    }
}
