module.exports.run = (bot, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(error => console.error(error));
  message.channel.send(sayMessage);
};

module.exports.help = {
  name: 'say',
  usage: 'say Hello World',
  description: 'The bot repeats everything after "say" and deletes your message.',
};
