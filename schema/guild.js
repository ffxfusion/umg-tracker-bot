const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildIcon: String,

    config: {
        rarespawn: {
            webhookToken: String,
            webhookID: String,
            channelID: String,
        },
        globaltracker: {
            channelID: String,
            webhookToken: String,
            webhookID: String,
        },
        userspawn: []
    }
});

module.exports = model("Guild", guildSchema, "guilds");