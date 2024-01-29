const server = require("../schema/guild.js");

module.exports = async(client, guild) => {

    await server.findOneAndDelete({ guildId: guild.id });

    console.log(`[GUILD] ${client.user.tag} has left ${guild.name} (${guild.id}) (removed from database).`);
}