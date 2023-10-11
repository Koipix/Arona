const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const DiscordJS = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");

module.exports = {
  description: "Guess the missing word (HARDCORE)",
  type: CommandType.BOTH,

  cooldowns : {
    type: CooldownTypes.perGuild,
    duration: "10 s"
  },

  callback: async (message) => {
    const quote = await fetch("https://zenquotes.io/api/random", {
      method: "GET",
    }).then((response) => response.json());

    const array = quote[0]["q"].split(" ");

    //takes the longest word
    let words = array;
    let maxLength = 0;
    let longestWord = '';

    for(let i = 0; i < words.length; i++) {
        if (words[i].length > maxLength) {
            maxLength = words[i].length;
            longestWord = words[i].replace(
                /[.;,'-]/g,
                ""
              );
        }
    }

    const newMessage = quote[0]["q"].replace(
        longestWord,
      "_".repeat(longestWord.length)
    );

    const hint = longestWord[Math.floor(Math.random() * longestWord.length)];
    
    const question = new EmbedBuilder()
      .setColor("#D2042D")
      .setTitle("Guess the missing word (HARDCORE)")
      .setDescription(newMessage)
      .addFields({name: "Hint:", value: `The word has a letter "**${hint.toUpperCase()}**" on it.`});

    const filter = (m) => {
      return m.author.id === message.author.id;
    };

    const collector = new DiscordJS.MessageCollector(message.channel, filter, {
      max: 1,
      time: 5000,
    });

    const correctEmbed = new EmbedBuilder()
        .setColor("#D2042D")
        .setTitle("That's right!")
        .setDescription("You deserve a lick~")

    collector.on("collect", (m) => {
        if (m.content.toLowerCase() === longestWord.toLowerCase()) {
          m.reply({ embeds: [correctEmbed] });
          collector.stop();    
          clearTimeout(timeout);     
          return;
        }
      });

      const timeoutEmbed = new EmbedBuilder()
        .setColor("#D2042D")
        .setTitle(`Time's out! The word is "**${longestWord.toUpperCase()}**"`)
        .setDescription(quote[0]["q"])

    const timeout = setTimeout(() => {

      message.channel.send({ embeds: [timeoutEmbed] });
      collector.stop("Time's out");
    }, 25000);

    console.log(longestWord);

    return {embeds: [question]};

  },
};