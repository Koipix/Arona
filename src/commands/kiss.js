const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const ds = require("discord.js");
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
        
        let apiKey = process.env.TENOR_API;
        let clientKey = 'AronaBot'
        let lmt = 8;
        let q = 'anime kiss'; // user interaction message goes here
        let rand = Math.floor(Math.random() * lmt)

        var search_url = "https://tenor.googleapis.com/v2/search?q=" + q + "&key=" +
            apiKey +"&client_key=" + clientKey +  "&limit=" + lmt;
        
        const gif = await fetch(search_url, {
            method: 'GET',
        })
        .then((response) => response.json());

        const gifData = gif["results"][rand]['media_formats']['mediumgif']['url'];
        
        let isMentioned = m.message.mentions.members.size;

        if ( isMentioned === 0) {
            m.channel.send("You need to mention someone!")
            return;
        }

        let user = m.member.displayName;
        let mentionedUser = m.message.mentions.members.first().displayName;
        
        const result = new EmbedBuilder()
        .setColor("#03f4fc")
        .setTitle(`${user} kissed ${mentionedUser}! How cute~ ❤️`)
        .setImage(gifData)

        return {embeds: [result]};
        
    },
};
