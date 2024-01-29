const discord = require("discord.js");

module.exports = {
    commands: new discord.Collection(),
    alias: new discord.Collection(),
    embedData: {
        ore: "",
        varient: "",
        miner: "",
        position: "",
        pickaxe: "",
        rawChance: "",
        rng: "",
        rare: false
    }
    
}