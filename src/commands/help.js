const Discord = require("discord.js");
const config = require("../../config/config.json");

module.exports.run = async (bot, message, args) => {
    let helpMessage = "";
    for(let i = 0; i < bot.commands.array().length; i++) {
        let command = bot.commands.array()[i];
        helpMessage += `__**${command.help.name}**__\n**Usage:** \`${config.prefix}${command.help.usage}\`\n**Description:** ${command.help.description}\n\n`;
    }
    message.channel.send(helpMessage);
}

module.exports.help = {
    name: "help",
    usage: "help",
    description: "The bot lists all it's commands and tells you how to use them."
}