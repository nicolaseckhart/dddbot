// Libraries
const Discord = require('discord.js');
const fs = require('fs');

// Config and Data
const config = require('../config/config.json');

// Classes
const Player = require('./Player');
const Hero = require('./Hero');
const HeroCollection = require('./HeroCollection');

// Bot
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Parse Dota Hero information to begin with
client.heroes = new HeroCollection();
client.heroes.parseHeroes();

/*
 * =========================
 * =    SETUP COMMANDS:    =
 * =========================
 */

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.log(`Command directory could not be read: ${err}`);
  let commandFiles = files.filter(file => file.split('.').pop() === 'js');
  if (commandFiles <= 0) {
    console.log('No JavaScript files were found in src/commands. 0 commands loaded.');
    return;
  }

  console.log(`Loading ${commandFiles.length} bot command(s) from src/commands:`);

  commandFiles.forEach((file, index) => {
    let props = require(`./commands/${file}`);
    client.commands.set(props.help.name, props);
    console.log(`* ${index + 1}: ${file} loaded!`);
  });
});

/*
 * =========================
 * =    MAIN BOT LOGIC:    =
 * =========================
 */

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildDelete', guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = client.commands.get(args.shift().toLowerCase());
  if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);
