const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    try {
        let duration = args.shift();
        let content = args.join(" ");

        // separate the wait duration from the time measure
        let timeMeasure = duration.substring((duration.length - 1), (duration.length));
        let returnTime = duration.substring(0, (duration.length - 1));

        // calculate the exact wait duration in milliseconds
        switch (timeMeasure) {
            case "s":
                returnTime = returnTime * 1000;
                break;
            case "m":
                returnTime = returnTime * 1000 * 60;
                break;
            case "h":
                returnTime = returnTime * 1000 * 60 * 60;
                break;
            case "d":
                returnTime = returnTime * 1000 * 60 * 60 * 24;
                break;
            default:
                returnTime = returnTime * 1000;
                break;
        }
        
        // reply with the reminder after the duration has run through
        bot.setTimeout(function () {
            message.reply(`Your reminder from ${duration} ago: ${content}`);
        }, returnTime);

    } catch (e) {
        message.reply("An error has occured with your reminder...");
        console.error(e.toString());
    }
}

module.exports.help = {
    name: "remind", 
    usage: "remind <duration> Some Text To Remind You Of", 
    description: "The bot reposts your reminder text and tags you. (Duration examples: 10s, 15m, 3h, 2d, etc.)"
}