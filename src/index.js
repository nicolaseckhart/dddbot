// Libraries
const Discord = require('discord.js');

// Config and Data
const config = require('../config/config.json');

// Classes
const Player = require('./Player');
const Hero = require('./Hero');
const HeroCollection = require('./HeroCollection');

// Bot
const client = new Discord.Client();

// Parse Dota Hero information to begin with
var heroes = new HeroCollection();
heroes.parseHeroes();

/* 
 * =========================
 * =    MAIN BOT LOGIC:    =
 * =========================
 */

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o => { });
        message.channel.send(sayMessage);
    }

    if (command === "purge") {
        const deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        const fetched = await message.channel.fetchMessages({ count: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }

    if (command === "stalk") {
        for(let i = 0; i < args.length; i++) {
            let player = new Player(args[i], heroes);
            await player.parsePlayerInformation();
            message.channel.send(player.embedify());
        }
    }

    if (command === "help") {
        let helpMessage = '';
        for(let i = 0; i < config.commands.length; i++) {
            let command = config.commands[i];
            helpMessage += `__**${command.name}**__\n**Usage:** \`${config.prefix}${command.usage}\`\n**Description:** ${command.description}\n\n`;
        }
        message.channel.send(helpMessage);
    }
});

client.login(process.env.TOKEN);