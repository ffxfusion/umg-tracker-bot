const data = require("../data");
const util = require("../util.js");


module.exports = async (client, message) => {
if (message.guild.id === guildId && message.channel.id === "1199452992215191773" && message.author.id === "1199453047600984115") {
        data.embedData = util.formatData(message);
        data.embedData.variant = util.variantDetector(message.embeds[0]);

        if (message.content) {
            data.embedData.rare = true
        }

        const content = { embeds: [message.embeds[0]]};
        //await util.sendRarespawn({ content: data.embedData.rare ? "@everyone" : " ", embeds: [message.embeds[0]]});
        await util.sendRarespawn(content);
        await util.sendUserspawn(content, data.embedData.miner.toLowerCase());
        
        if (util.convertToNumber(data.embedData.rng.split("/")[1].replace(/,/g, "")) >= 100000000) {
            await util.sendGlobal(content);
        }

        data.embedData = { ore: "", variant: "", miner: "", position: "", pickaxe: "", rawChance: "", rng: "", rare: false }
    }

    //copied from my old bot
    if (!message.content.startsWith(process.env.prefix) || message.author.bot || message.channel.type === "dm") return;

    const args = message.content.split(/ +/g);
    const mentionFix = message.cleanContent.slice(process.env.prefix).split(" ").slice(1);

    const command = args.shift().slice(process.env.prefix).toLowerCase();
    const register = data.commands.get(command.slice(process.env.prefix.length)) || data.commands.get(data.alias.get(command.slice(process.env.prefix.length)));

    const getUser = () => {
        return message.channel.guild.members.cache.find(r => r.user == message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || message.channel.guild.members.cache.find(r => r.user.username === args[0]) || message.channel.guild.members.cache.find(r => r.user.tag === args[0]);
    }

    if (register) {
        register.run(client, message, args, mentionFix, getUser);
    }
}
