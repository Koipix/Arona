const { Client, GatewayIntentBits, Collection } = require("discord.js");
const moongose = require("mongoose");
const fetch = require("node-fetch");
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
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.cooldowns = new Collection();

client.on("ready", () => {
client.on("ready", async () => {

  console.log("Kana has been deployed~");

  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
    
  });

});

client.on("messageCreate", async (message) => {

  }

  if (isFound && !message.author.bot && message.content.split(' ')[0] == "<@1123607101500035113>") {
    const userMessage = message.content.replace(/<@1123607101500035113>/, '').trim();
    await generateText(userMessage, message);
  }
});

moongose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

client.login(process.env.TOKEN);