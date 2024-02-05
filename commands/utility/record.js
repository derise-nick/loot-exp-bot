const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gSheets = require("../../google/sheets");
const { sheetIds } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription(
      "Reports results for a strand block. Please attach screenshots of any I See Brothers drops."
    )
    .addIntegerOption((option) =>
      option
        .setName("blockno")
        .setDescription("What was your block number?")
        .setMinValue(0)
        .setMaxValue(144)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("isbcount")
        .setDescription("How many I See Brothers dropped?")
        .setMinValue(0)
        .setMaxValue(3)
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setRequired(false)
        .setName("screenshot1")
        .setDescription(
          'The screenshot of the tab of strands with "two unique bosses" in the search bar'
        )
    )
    .addAttachmentOption((option) =>
      option
        .setRequired(false)
        .setName("screenshot2")
        .setDescription(
          'The screenshot of the tab of strands with "two unique bosses" in the search bar'
        )
    )
    .addAttachmentOption((option) =>
      option
        .setRequired(false)
        .setName("screenshot3")
        .setDescription(
          'The screenshot of the tab of strands with "two unique bosses" in the search bar'
        )
    ),
  async execute(interaction) {
    const attachment1 = interaction.options.getAttachment("screenshot1");
    const blockNo = interaction.options.get("blockno").value;
    const result = await gSheets.reportBlock(interaction);
    const success = !!result && !result.error;
    const embeddedResponse = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Block #${blockNo} Reported`)
      .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.strand}`)
      .setDescription(`Request registered by @${interaction.user.username}`)
      .addFields({
        name: "ISB count:",
        value: interaction.options.get("isbcount").value.toString(),
      })
      .setImage(attachment1?.url)
      .setTimestamp();

    if (success) {
      await interaction
        .reply({ embeds: [embeddedResponse], ephemeral: false })
        .then(() => console.log("Block record reply sent."))
        .catch(console.error);
    } else {
      await interaction
        .reply({
          ephemeral: true,
          content:
            "Something went wrong! Please ensure your block number is correct and try again. If you've already reported your result and need to make a change, please contact a mod.",
        })
        .then(() => console.log("Google sheets error reply sent."))
        .catch(console.error);
    }
  },
};
