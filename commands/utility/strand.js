const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gSheets = require("../../google/sheets");
const { sheetIds } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("strand")
    .setDescription(
      "Requests a block of 144 strands. Please attach a screenshot of the tab."
    )
    .addAttachmentOption((option) =>
      option
        .setRequired(true)
        .setName("screenshot")
        .setDescription(
          'The screenshot of the tab of strands with "two unique bosses" in the search bar'
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("twinned")
        .setDescription("How many strands are twinned?")
        .setMinValue(0)
        .setMaxValue(144)
        .setRequired(true)
    ),
  async execute(interaction) {
    const attachment = interaction.options.getAttachment("screenshot");
    const blockNo = await gSheets.createBlock(interaction);
    const embeddedResponse = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Block #${blockNo}`)
      .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.strand}`)
      .setDescription(`Request registered by @${interaction.user.username}`)
      .addFields({
        name: "Twinned count:",
        value: interaction.options.get("twinned").value.toString(),
      })
      .setImage(attachment.url)
      .setTimestamp();

    await interaction
      .reply({ embeds: [embeddedResponse], ephemeral: false })
      .then(() => console.log("Block request reply sent."))
      .catch(console.error);
  },
};
