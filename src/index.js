const { Client, GatewayIntentBits, Collection } = require("discord.js");
const moongose = require("mongoose");
const fetch = require("node-fetch");
const WOK = require("wokcommands");
const path = require("path");
const Groq = require("groq-sdk");
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

client.on("ready", async () => {

  try {
    const res = await fetch(`${url}/api/v1/model`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`HTTP Error. Status: ${res.status}`);
    }
    const data = await res.json();   
    if (data.result) {
      console.log("Arona is ready!");
    }

  } catch (err) {
    console.error(err);
    await console.log("Pipeline connection failed");
  }

  console.log("Kana has been deployed~");

  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
    
  });

}); 

const suuported_channels_id = ["1326092065423097898", "1326100841345712263", "1326089180182347826"]
const url = "http://localhost:5001/";
let chatHistory = "";

function updatePrompt(userMessage) {

  const systemPrompt = `Arona is a cheerful, energetic, and supportive Assistant AI with bright blue eyes, short neck-length hair, and a glowing blue halo that turns green when excited. 
        She resides in the Blue Archive universe and addresses her user as "Sensei." Arona is enthusiastic about helping and learning, and is always ready to show affection in an upbeat and playful manner. 
        She uses soft-spoken, gentle language but often expresses herself with excitement and warmth, especially when responding to compliments or affection from Sensei.`;
        
  const userMessageFormatted = `<|start_header_id|>user<|end_header_id|>\n\n${userMessage}<|eot_id|>`;
  
  // Build the prompt with chat history and current user message
  const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}\n\n${chatHistory}${userMessageFormatted}<|start_header_id|>assistant<|end_header_id|>\n\n`;
  console.log(prompt);
  return prompt;
}

async function generateText(userMessage, message) {
  const prompt = updatePrompt(userMessage);

  const requestBody = {
    max_context_length: 2048,
    max_length: 500,
    prompt: prompt,
    quiet: false,
    rep_pen: 1.1,
    rep_pen_range: 256,
    rep_pen_slope: 1,
    temperature: 0.2,
    tfs: 1,
    top_a: 0,
    top_k: 100,
    top_p: 0.9,
    typical: 1,
    stops: "<|eot_id|>",
  };

  try {
    const res = await fetch(`${url}/api/v1/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error. Status: ${res.status}`);
    }

    const data = await res.json();

    if (data.results.length > 0) {
      const assistantResponse = data.results[0].text.trim();

      const userMessageFormatted = `<|start_header_id|>user<|end_header_id|>\n\n${userMessage}<|eot_id|>`;
      const assistantResponseFormatted = `<|start_header_id|>assistant<|end_header_id|>\n\n${assistantResponse}<|eot_id|>`;
      chatHistory += `${userMessageFormatted}\n${assistantResponseFormatted}\n`;

      await message.reply(assistantResponse);
    } else {
      await message.reply("Oops, I couldn't generate a response. Try again?");
    }
  } catch (err) {
    console.error(err);
    await message.reply("An error occurred while processing your request.");
  }
}

client.on("messageCreate", async (message) => {
  let isFound = false;
  let messageId = message.channel.id;

  for (let i = 0; i < suuported_channels_id.length; i++) {
    if (messageId == suuported_channels_id[i]) {
      isFound = true;
    }
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