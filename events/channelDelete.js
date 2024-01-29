const server = require("../schema/guild.js");
const util = require("../util.js");

module.exports = async (client, channel) => {
    let database = await server.findOne({ guildId: channel.guild.id }).catch(err => console.log(err));

    if (!database || isNaN(database.config.rarespawn.channelID)) return;
    
    const logMsg = `[CHANNEL DELETE] - ${channel.name} (${channel.id}) was deleted in ${channel.guild.name} (${channel.guild.id}) (removed from database)`;

    if (util.handleChannelDeleteAndLog(database.config.rarespawn, channel, database, logMsg)) {
        return;
    }
    
    if (util.handleChannelDeleteAndLog(database.config.globaltracker, channel, database, logMsg)) {
        return;
    }

    const user = database.config.userspawn.find(v => v.channelID === channel.id);

    if (user) {
        console.log(`[CHANNEL DELETE] - ${channel.name} (${channel.id}) was deleted in ${channel.guild.name} (${channel.guild.id}) (removed from database)`);
        return await server.findOneAndUpdate({ guildId: channel.guild.id }, {
            $pull: {
                "config.userspawn": {
                    channelID: channel.id
                }
            }
        }).catch(err => console.log(err));
    }
    return;
}