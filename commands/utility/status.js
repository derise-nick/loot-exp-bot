const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gSheets = require("../../google/sheets");
const { sheetIds } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Prints current status of reported data."),
  async execute(interaction) {
    const { reportedCount, twinnedCount, isbCount, claimedCount } =
      await gSheets.getStatus();
    const embeddedResponse = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${reportedCount.toString()} blocks reported`)
      .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.strand}`)
      .setDescription(`${isbCount.toString()} **I See Brothers** found so far!`)
      .addFields(
        {
          name: "Reported Blocks:",
          value: reportedCount.toString(),
          inline: true,
        },
        {
          name: "I See Brothers found:",
          value: isbCount.toString(),
          inline: true,
        },
        {
          name: "Unclaimed Blocks:",
          value: (144 - claimedCount).toString(),
          inline: false,
        },
        {
          name: "Reported Map Total:",
          value: (reportedCount * 144).toString(),
          inline: true,
        },
        {
          name: "Reported Twinned Maps:",
          value: twinnedCount.toString(),
          inline: true,
        }
      )
      .addFields()
      .setTimestamp();

    await interaction
      .reply({ embeds: [embeddedResponse], ephemeral: false })
      .then(() => console.log("Status reply sent."))
      .catch(console.error);
  },
};
