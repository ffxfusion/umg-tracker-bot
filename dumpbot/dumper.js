const { Client, WebhookClient } = require("discord.js-selfbot-v13")

const client = new Client();

client.on("ready", async () => {
    console.log("selfbot online.");
});

let embedData = {
    ore: "",
    varient: "", //no varient detection here yet
    miner: "",
    position: "",
    pickaxe: "",
    rawChance: "",
    rng: "",
    rare: false
};

const hook = new WebhookClient({ url: "webhook url here (of proxy server)" })

client.on("messageCreate", async (message) => {
    if (message.guild.id === "1059506407826788393" && message.channel.id === "1059846328772993064" && message.author.id === "1088664915457347594") {
        const data = message.embeds[0].description.split(" | ").map(item => item.split("**")[1]);

        [embedData.miner, embedData.position, embedData.pickaxe, embedData.rawChance] = data;
        
        embedData.ore = message.embeds[0].title;
        embedData.rng = data[3].split("**")[3];

        if (message.content) {
            embedData.rare = true;
        }

        //sends to proxy server
        hook.send({ content: embedData.rare ? "ping" : " ", embeds: [message.embeds[0]] });
    }

    embedData = {
        ore: "",
        varient: "",
        miner: "",
        position: "",
        pickaxe: "",
        rawChance: "",
        rng: "",
        rare: false
    };
})

client.login("token here");