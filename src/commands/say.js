const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o => { });
    message.channel.send(sayMessage);
}

module.exports.help = {
    name: "say",
    usage: "say Hello World",
    description: "The bot repeats everything after \"say\" and deletes your message."
}