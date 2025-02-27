const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const ds = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");
const profileModel = require("../models/profileSchema");

module.exports = {
  description: "Guess the missing word",
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

    const randomWord = array[Math.floor(Math.random() * array.length)].replace(
      /[.;,']/g,
      ""
    );
    console.log(array);
    console.log(randomWord);

    const newMessage = quote[0]["q"].replace(
      randomWord,
      "-".repeat(randomWord.length)
    );

    const question = new EmbedBuilder()
      .setColor("#03f4fc")
      .setTitle("Guess the missing word")
      .setDescription(newMessage)

    if (randomWord.length >= 5) {
      question.addFields(
        { name: "Hint:",
        value: `First letter is "**${randomWord[0].toUpperCase()}**" and it's ${randomWord.length} letters long`}
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

    const filter = (m) => {
      return m.author.id === message.author.id;
    };

    const collector = new ds.MessageCollector(message.channel, filter, {
      max: 1,
      time: 10000,
    });

    let points;
    if (randomWord.length > 4) {
      points = 5;
    } else {
      points = randomWord.length;
    }

    const timeoutEmbed = new EmbedBuilder()
        .setColor("#03f4fc")
        .setTitle(`Time's out! The word is "**${randomWord.toUpperCase()}**"`)
        .setDescription(quote[0]["q"])

    const timeout = setTimeout(() => {
      message.channel.send({ embeds: [timeoutEmbed] });
      collector.stop("Time's out");
    }, 25000);

    collector.on("collect", async (m) => {
      const user = m.author;
      const correctEmbed = new EmbedBuilder()
      .setColor("#03f4fc")
      .setTitle("That's right!")
      .setDescription(`${ user } you've gained **${points}** points!`)
        if (m.content.toLowerCase() === randomWord.toLowerCase()) {
          m.reply({ embeds: [correctEmbed] });
          collector.stop();
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

      return {embeds: [question]};

  },
};
