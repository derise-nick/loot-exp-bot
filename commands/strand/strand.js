const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gSheets = require("../../google/sheets");
const { sheetIds } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("strand")
    .setDescription(
      "Get status or request/report a block for the strand experiment."
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("request")
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
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("report")
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
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("status")
        .setDescription("Prints current status of reported data.")
    ),
  async execute(interaction) {
    console.log(interaction.options.getSubcommand())
    switch (interaction.options.getSubcommand()) {
      case "request":
        await handleRequest(interaction);
        break;
      case "report":
        await handleReport(interaction);
        break;
      case "status":
        await handleStatus(interaction);
        break;
    }
  },
};

async function handleRequest(interaction) {
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
}

async function handleReport(interaction) {
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
}

async function handleStatus(interaction) {
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
}
