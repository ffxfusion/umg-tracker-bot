const server = require("../schema/guild.js");
const util = require("../util.js");

module.exports = async (client, channel) => {
    let database = await server.findOne({ guildId: channel.guild.id }).catch(err => util.logger(err));

    if (!database || isNaN(database.config.rarespawn.channelID)) return;
    
    const logMsg = `[CHANNEL DELETE] - ${channel.name} (${channel.id}) was deleted in ${channel.guild.name} (${channel.guild.id}) (removed from database)`;

    const configs = ["rarespawn", "globaltracker", "raretracker"];

    for (let config of configs) {
        if (util.handleChannelDeleteAndLog(database.config[config], channel, database, logMsg)) {
            return;
        }
    }

    const user = database.config.userspawn.find(v => v.channelID === channel.id);

    if (user) {
        util.logger(logMsg);
        return await server.findOneAndUpdate({ guildId: channel.guild.id }, {
            $pull: {
                "config.userspawn": {
                    channelID: channel.id
                }
            }
        }).catch(err => util.logger(err));
    }
    return;
}
