const discord = require("discord.js")
const bot = new discord.Client({disableEveryone: true});
const botconfig = require("./botconfig.json")
const fs = require("fs")
const chalk = require('chalk');

const antiAd = require("./antiad.js")

antiAd(bot)



bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

fs.readdir('./commands/', (err, files) => {
    if(err) throw err;

    let file = files.filter(f => f.endsWith('.js'));
    if(file.length <= 0) return console.log('There is js files in the commands folder');

    file.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(chalk.yellow(`Attempting to load ${f}`));

        bot.commands.set(props.help.name, props);
    });
    console.log(chalk.bold.bgGreen('Everything loaded properly.'));
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

bot.on('error', () => console.error);

bot.on('warn', () => console.warn);

bot.on('ready', async () => {

    bot.user.setActivity(`with ${bot.guilds.cache.size} servers`);
    const readyChannel = bot.channels.cache.find(channel => channel.id === "773565574420627496");
    if(readyChannel)
        var readyEmbed = new discord.MessageEmbed()
        .setTitle("Bot is online!")
        .addField("Running in: ", bot.guilds.cache.size + " guilds")
        .addField("Listening to: ", bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0)+ " users")
        .setImage("https://media2.giphy.com/media/YnkMcHgNIMW4Yfmjxr/giphy.gif?cid=ecf05e47c451163e327d80c4945319c9d3044cfadc29c275&rid=giphy.gif")
        .setFooter("Bot is online!")
        readyChannel.send(readyEmbed)

})
    

bot.on('message', async (msg) => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith(botconfig.PREFIX)) return;
    if(msg.content.indexOf(botconfig.PREFIX) != 0) return;
    if(msg.channel.type == 'dm') return;

    const args = msg.content.slice(botconfig.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(bot, msg, args, botconfig);
});

bot.login(botconfig.token);