const { EmbedBuilder } = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");
const profileModel = require("../models/profileSchema");

module.exports = {
  description: "Top 10 Leaderboard",
  type: CommandType.BOTH,

  cooldowns : {
    type: CooldownTypes.perGuild,
    duration: "10 s"
  },

  callback: async (m) => {

    await m.interaction.deferReply();

    let profileData;

    try {
      profileData = await profileModel.findOne({ userId: m.interaction.user.id});
      if (!profileData) {
        profileData = await profileModel.create({
          userId: m.interaction.user.id,
          serverId: m.interaction.guild.id,
        });
      }
    } catch (error) {
      console.log(error);
    }

    const { username, id } = m.interaction.user;
    const { userPoints } = profileData;

    let leaderbord = new EmbedBuilder()
      .setColor("#03f4fc")
      .setTitle("Wisdom's Top 10")
      .setFooter({text:` You're not ranked yet` });

      const members = await profileModel
        .find({ serverId: m.interaction.guild.id })
        .sort({ userPoints: -1 })
        .catch((err) => console.log(err));
      
      const membersIdx = members.findIndex((member) => member.userId === id);

      leaderbord.setFooter({
        text:`${username} you're rank #${membersIdx + 1} with ${ userPoints } points!`,
       });

       const topFive = members.slice(0, 10);

       let desc = "";

       for (let i = 0; i < topFive.length; i++) {
        let { user } = await m.interaction.guild.members.fetch(topFive[i].userId);
        if (!user) return;
        let userPoints = topFive[i].userPoints;
        desc += `${i + 1}. **${user.username}:** ${userPoints} Points \n`;
       }

       if (desc !== "") {
        leaderbord.setDescription(desc);
       }

        m.interaction.editReply({ embeds: [leaderbord]});
  },
};