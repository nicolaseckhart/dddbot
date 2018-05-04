const Discord = require("discord.js");
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports.run = async (bot, message, args) => {
    let uid = message.author.id;

    if (args.length <= 0) {
        (async () => {
            const client = await pool.connect()
            try {
                const result = await client.query("SELECT * FROM reminders WHERE discord_id = $1", [uid]);
                let answer = "";
                if (result.rows.length <= 0) {
                    answer = "You dont have any reminders..."    
                } else {
                    answer = "Member these? :grapes: \n";
                    result.rows.forEach((row, index) => {
                        answer += `**${row.created_at}**: ${row.reminder}\n`;
                    });
                }
                message.reply(answer);
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e.stack);
            message.channel.send("There was an issue fetching your reminders, try again later.");
        });
    } else {
        (async () => {
            const client = await pool.connect()
            try {
                let information = args.join(" ");
                await client.query("INSERT INTO reminders(discord_id, reminder, created_at) VALUES($1, $2, NOW())", [uid, information]);
                message.reply("I member :grapes:");
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e.stack);
            message.channel.send("There was an issue saving your reminder, try again later.");
        });
    }
}

module.exports.help = {
    name: "member",
    usage: "member <information>",
    description: "The bot members the information (words, senctences, links or whatever). If no information given, your reminders are displayed."
}