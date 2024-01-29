require("dotenv").config();

const discord = require("discord.js");
const client = new discord.Client({
	intents: [
		discord.GatewayIntentBits.Guilds, 
		discord.GatewayIntentBits.GuildMessages, 
		discord.GatewayIntentBits.GuildPresences, 
		discord.GatewayIntentBits.GuildMessageReactions, 
		discord.GatewayIntentBits.DirectMessages,
		discord.GatewayIntentBits.MessageContent
	], 
	partials: [discord.Partials.Channel, discord.Partials.Message, discord.Partials.User, discord.Partials.GuildMember, discord.Partials.Reaction] 
});

const { connect } = require("mongoose");

const handle = require("./handler.js");

handle.getEvents("./events", client);
handle.getModules("./modules");
handle.getDB("./mongo");

client.login(process.env.token);

(async() => {
	await connect(process.env.mongoose).catch(console.error);
})();

// syaro was here