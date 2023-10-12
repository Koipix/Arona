const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");

module.exports = {
    description: "Kana will guess your luckiness",
    type: CommandType.BOTH,
    minArgs: 1,
    expectedArgs: "your-question",

    cooldowns: {
        type: CooldownTypes.perGuild,
        duration: "5 s"
    },

    callback: async ({ message, args}) => {
        
        if (!args) {
            message.reply(`Hmph! Where's the question?`);
            return
        }

        const res = await fetch('https://eightballapi.com/api/', {
            method: 'GET'
        }).then(response => response.json())

        const resEmbed = new EmbedBuilder()
        .setColor("#D22B2B")
        .setTitle("Kana says....")
        .setDescription(`${res["reading"]}`)

        return { embeds: [resEmbed] };
    }
}