const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const DiscordJS = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");
const profileModel = require("../models/profileSchema");

module.exports = {
  description: "Guess the missing word (HARDCORE)",
  type: CommandType.BOTH,

  cooldowns : {
    errorMessage: "You're being rough! Please wait for **{TIME}**",
    type: CooldownTypes.perGuild,
    duration: "10 s"
  },


  callback: async (message) => {
    const quote = await fetch("https://zenquotes.io/api/random", {
      method: "GET",
    }).then((response) => response.json());

    let profileData;
    try {
      profileData = await profileModel.findOne({ userId: message.interaction.user.id});
      if (!profileData) {
        profileData = await profileModel.create({
          userId: message.interaction.user.id,
          serverId: message.interaction.guild.id,
        });
      }
    } catch (error) {
      console.log(error);
    }

    const array = quote[0]["q"].split(" ");

    //takes the longest word
    let maxLength = 0;
    let longestWord = '';

    for(let i = 0; i < array.length; i++) {
        if (array[i].length > maxLength) {
            maxLength = array[i].length;
            longestWord = array[i].replace(
                /[.;,'-]/g,
                ""
              );
        }
    }

    const newMessage = quote[0]["q"].replace(
        longestWord,
      "-".repeat(longestWord.length)
    );

    const hint = longestWord[0];
    
    const question = new EmbedBuilder()
      .setColor("#03f4fc")
      .setTitle("Guess the missing word (HARDCORE)")
      .setDescription(newMessage)
      .addFields({name: "Hint:", value: `The starting letter is "**${hint.toUpperCase()}**"`});

    const filter = (msg) => {
      return msg.author.id === message.author.id;
    };

    const collect = new DiscordJS.MessageCollector(message.channel, filter, {
      max: 1,
      time: 5000,
    });

    let points = longestWord.length;

    collect.on("collect", async (m) => {
      let user = m.author;

      const correctEmbed = new EmbedBuilder()
      .setColor("#03f4fc")
      .setTitle("That's right!")
      .setDescription(`${ user } you've gained ${points} points!`);
      
        if (m.content.toLowerCase() === longestWord.toLowerCase()) {
          m.reply({ embeds: [correctEmbed] });
          collect.stop();    
          clearTimeout(timeout);
          const id = m.author.id;

          try {
            await profileModel.findOneAndUpdate(
              { userId: id }, 
              {
              $inc: {
                userPoints: points,
              },
            });            
          } catch (err) {
            console.log(err);
          }       
          return;
        }
      });

      const timeoutEmbed = new EmbedBuilder()
        .setColor("#03f4fc")
        .setTitle(`Time's out! The word is "**${longestWord.toUpperCase()}**"`)
        .setDescription(quote[0]["q"])

    const timeout = setTimeout(() => {

      message.channel.send({ embeds: [timeoutEmbed] });
      collect.stop("Time's out");
    }, 25000);

    console.log(longestWord);

    return {embeds: [question]};

  },
};