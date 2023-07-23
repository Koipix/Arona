const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const ds = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");

module.exports = {
  description: "Guess the missing word",
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

    //test
    console.log(array)

    const randomWord = array[Math.floor(Math.random() * array.length)].replace(
      /[.;,']/g,
      ""
    );

    const newMessage = quote[0]["q"].replace(
      randomWord,
      "_".repeat(randomWord.length)
    );

    const question = new EmbedBuilder()
      .setColor("#D22B2B")
      .setTitle("Guess the missing word")
      .setDescription(newMessage)

    if (randomWord.length >= 5) {
      question.addFields(
        { name: "Hint:", 
        value: `First letter is "${randomWord[0]}" and it's ${randomWord.length} letters long`}
      );
    } else if (randomWord.length > 1 && randomWord.length < 5) {
      question.addFields({
        name: "Hint:", 
        value: `The word has ${randomWord.length} letters`
    });
    } else {
        question.addFields({
            name: "Hint:", 
            value: `You know it :3`
        });
    }

    message.channel.send({ embeds: [question] });

    console.log(randomWord);

    const filter = (m) => {
      return m.author.id === message.author.id;
    };

    const collector = new ds.MessageCollector(message.channel, filter, {
      max: 1,
      time: 5000,
    });

    const correctEmbed = new EmbedBuilder()
      .setColor("#D2042D")
      .setTitle("That's right!")
      .setDescription("You deserve a lick~")

    collector.on("collect", (m) => {
        if (m.content.toLowerCase() === randomWord.toLowerCase()) {
          m.reply({ embeds: [correctEmbed] });
          collector.stop();    
          clearTimeout(timeout);     
          return;
        }
      });

      const timeoutEmbed = new EmbedBuilder()
        .setColor("#D2042D")
        .setTitle(`Time's out! The word is "**${randomWord.toUpperCase()}**"`)
        .setDescription(quote[0]["q"])

    const timeout = setTimeout(() => {
      message.channel.send({ embeds: [timeoutEmbed] });
      collector.stop("Time's out");
    }, 25000);

  },
};