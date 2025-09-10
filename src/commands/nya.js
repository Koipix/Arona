const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");
require("dotenv").config();


module.exports = {
    description: "Action command",
    type: CommandType.BOTH,

    cooldowns: {
        errorMessage: "You're being rough! Please wait for **{TIME}**",
        type: CooldownTypes.perGuild,
        duration: "5 s"
    },

    callback: async (m) => {       
      const tag = m.message.content.replace(/^!nya/, '').trim();
      const res = await fetch(`https://api.nekosapi.com/v4/images/random?limit=1&rating=safe&tags=${tag}`);
      const data = await res.json();

      if (data.length === 0) {
        m.message.reply("Tag nyot found!");
        return;
      }

      const url = data[0].url;


      console.log(data);

      const result = new EmbedBuilder() 
        .setColor('#03F4FC')
        .setImage(url)


        return {embeds: [result]};
    },
};
