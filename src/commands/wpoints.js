const { CommandType, CooldownTypes } = require("wokcommands");
const profileModel = require("../models/profileSchema");

module.exports = {
    description: "Check your points",
    type: CommandType.SLASH,

    cooldowns : {
        type: CooldownTypes.perGuild,
        duration: "10 s"
    },

    callback: async (m) => {

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
        const { userPoints } = profileData;
        const user = m.interaction.user;

        return `**${user}** you have **${userPoints}** points!`;
    },
};