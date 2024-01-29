const data = require("../data.js")

// exported from my old help command
module.exports.run = async (client, message, args, mentionFix, getUser) => {

    if (!args.length) {
        const home = `\`\`\`md
# Help menu

### **List of commands**
  - ${data.commands.map(r => r.config.name).join("\n  - ")}

fyi you can do ${process.env.prefix}help <command> to get more information about a command
there will be more commands in the future.. haha..\`\`\``;
  
        return message.channel.send(home);
    }
    
    const cmd = data.commands.get(args[0].toLowerCase()) || data.commands.get(data.alias.get(args[0].toLowerCase()));

    if (cmd) {
        const commandBase = `\`\`\`md
# Command Information

### **${cmd.config.name} command**     
  - Description: ${cmd.config.description}
  - Aliases: ${!cmd.config.aliases.length ? "None" : cmd.config.aliases.map(r => `"${r}"`).join(", ")}
  - Usages: ${cmd.config.usages.map(r => `\n    - ${process.env.prefix + r}`).join(" ")}
  - Examples: ${cmd.config.examples.map(r => `\n    - ${process.env.prefix + r}`).join(" ")}
\`\`\``;

        return message.channel.send(commandBase);
    }

    if (!data.commands.filter(r => r.config.cmd === args[0].toLowerCase()).size) {
        return message.channel.send("cannot find that command");
    }
}

module.exports.config = {
    name: "help",
    description: "never gonna give you up never gonna let you down",
    aliases: [],
    usages: [
        "help",
        "help <command>"
    ],
    examples: [
        "help",
        "help setup"
    ]
}