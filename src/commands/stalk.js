const Player = require('../Player');

module.exports.run = async (bot, message, args) => {
  for (let i = 0; i < args.length; i++) {
    let player = new Player(args[i], bot.heroes);
    await player.parsePlayerInformation();
    message.channel.send(player.embedify());
  }
};

module.exports.help = {
  name: 'stalk',
  usage: 'stalk <opendota-player-id>',
  description: 'The bot posts a summary of the players OpenDota profile in the channel.',
};
