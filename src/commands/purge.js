module.exports.run = async (bot, message, args) => {
  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    message.reply('Provide a number of messages to delete [2-100]');
    return;
  }

  const fetched = await message.channel.fetchMessages({ count: deleteCount });
  message.channel.bulkDelete(fetched).catch(error => {
    message.reply(`Couldn't delete messages because of: ${error}`);
  });
};

module.exports.help = {
  name: 'purge',
  usage: 'purge <number>',
  description: 'The bot deletes the last <number> message in the channel you post the command in.',
};
