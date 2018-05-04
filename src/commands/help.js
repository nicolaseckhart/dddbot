const config = require('../../config/config.json');

module.exports.run = (bot, message) => {
  let helpMessage = '';
  for (let i = 0; i < bot.commands.array().length; i++) {
    let command = bot.commands.array()[i];
    helpMessage += `__**${command.help.name}**__\n`;
    helpMessage += `**Usage:** \`${config.prefix}${command.help.usage}\`\n`;
    helpMessage += `**Description:** ${command.help.description}\n\n`;
  }
  message.channel.send(helpMessage);
};

module.exports.help = {
  name: 'help',
  usage: 'help',
  description: "The bot lists all it's commands and tells you how to use them.",
};
