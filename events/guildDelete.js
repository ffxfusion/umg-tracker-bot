const server = require("../schema/guild.js");
const util = require("../util.js");

module.exports = async(client, guild) => {

    await server.findOneAndDelete({ guildId: guild.id });

    util.logger(`[GUILD] ${client.user.tag} has left ${guild.name} (${guild.id}) (removed from database).`);
}
