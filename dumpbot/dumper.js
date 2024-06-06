const { Client: selfbot, WebhookClient } = require("discord.js-selfbot-v13");
const superchills = require("../superchills.js");

const client = new selfbot();

client.on("ready", async () => {
    console.log("selfbot online.");
});

const rarespawn = new WebhookClient({ url: "proxy regular rarespawn webhook" });
const superchillUrl = {
    rarespawn: "superchill proxy",
    normalTracker: "superchill proxy",
    alteredTracker: "superchill proxy",
    superAlteredTracker: "superchill proxy",
    giganticTracker: "superchill proxy",
    tinyTracker: "superchill proxy",
    evilTracker: "superchill proxy"
};

const ids = {};

for (const [key, url] of Object.entries(superchillUrl)) {
    ids[`${key}Hook`] = new WebhookClient({ url });
}

const rarities = [...Object.values(superchills.world1), ...Object.values(superchills.world2), ...Object.values(superchills.w2Caves)].flat();

const trackers = {
    "1059846328772993064": { authorId: "1246216620880298065", hook: ids.rarespawnHook},
    "1059846357860491376": { authorId: "1088664394130534421", hook: ids.normalTrackerHook },
    "1173767047080054784": { authorId: "1173767219549843527", hook: ids.alteredTrackerHook },
    "1173773186240888842": { authorId: "1173773260542988483", hook: ids.superAlteredTrackerHook },
    "1173778041600757760": { authorId: "1173778285767950436", hook: ids.giganticTrackerHook },
    "1173778098379034705": { authorId: "1173779194933682197", hook: ids.tinyTrackerHook },
    "1173778128921960518": { authorId: "1173779668030206032", hook: ids.evilTrackerHook }
};

let embedData = {
    rare: false
};

client.on("messageCreate", async (message) => {
    const guildId = "1059506407826788393";

    if (message.guild.id === guildId) {
        if (message.channel.id === "1059846328772993064" && message.author.id === "1246216620880298065") {
            if (message.content) {
                embedData.rare = true;
            }
    
            rarespawn.send({ content: embedData.rare ? "ping" : " ", embeds: [message.embeds[0]] });
        }

        const tracker = trackers[message.channel.id];
        if (tracker && message.author.id === tracker.authorId) {
            if (message.content && tracker === trackers["1059846328772993064"]) {
                embedData.rare = true;
            }
            
            const title = message.embeds[0].title;
            const titleWithoutSpawned = title.replace(/ spawned./g, "");
            const titleWithoutDot = title.endsWith(".") ? title.slice(0, -1) : title;
            
            if ((title.includes("spawned.") && rarities.includes(titleWithoutSpawned)) || rarities.includes(titleWithoutDot)) {
                tracker.hook.send({ content: embedData.rare ? "ping" : " ", embeds: [message.embeds[0]] });
            }
        }
    }

    embedData = {
        rare: false
    };
});

client.login('alt token');
