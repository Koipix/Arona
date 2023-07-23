const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Configuration, OpenAIApi } = require('openai');
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

    // client.channels.fetch('1130814754957561967')
    //   .then(channel => {
    //       channel.send("Hmph!");
    //   });

  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
  });

});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
})

// const openai = new OpenAIApi(configuration); OPEN AI API

client.on("messageCreate", async (message) => {

  // if (message.author.bot) return;
  // if (message.channel.id !== process.env.CHANNEL_ID) return;
  // if (message.content.startsWith('!kanya')) return;

  // let conversationLog = [{ role: 'system', content: "You're Kana from Oshi no Ko Anime" }];

  // conversationLog.push({
  //   role: 'user',
  //   content: message.content,
  // })
  
  // await message.channel.sendTyping();

  // const result = await openai.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   message: conversationLog,
  // })

  // message.reply(result.data.choices[0].message);

  const msg = message.content.toLowerCase();
  const regex = /milk/;
  if (msg.match(regex)) {
    message.reply('<:shy:1131580449743978537>');
  }
  
});

client.login(process.env.TOKEN);