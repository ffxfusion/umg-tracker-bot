module.exports.run = async (client, message, args, mentionFix, getUser) => {

    message.channel.send(`[[click here]](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) to invite me to your server lol`);
}

module.exports.config = {
    name: "invite",
    description: "generates an invite link, so i can join your server!",
    aliases: [],
    usages: [
        "invite"
    ],
    examples: [
        "invite",
    ]
}