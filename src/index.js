const { Client, GatewayIntentBits, Collection } = require("discord.js");
const WOK = require("wokcommands");
const path = require("path");
require("dotenv").config();

const client = new Client ({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.cooldowns = new Collection();

client.on("ready", () => {

  console.log("Kana has been deployed~");

  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
  });

});

client.on("messageCreate", async (message) => {

  const msg = message.content.toLowerCase();
  const regex = /milk/;
  if (msg.match(regex)) {
    message.reply('<:shy:1131580449743978537>');
  }
  
});

client.login(process.env.TOKEN);