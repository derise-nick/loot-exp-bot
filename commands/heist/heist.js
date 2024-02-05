const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gSheets = require("../../google/sheets");
const { sheetIds } = require("../../config.json");

// TODO - Get descriptions for commands / params
// TODO - Get heist reward tabs param details

module.exports = {
  data: new SlashCommandBuilder()
    .setName("heist")
    .setDescription(
      "Get status or request/report a block for the heist experiment."
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("request")
        .setDescription(
          "Requests a block of 100 lvl 83 heist demolition contracts. Please attach a screenshot of the tab."
        )
        .addAttachmentOption((option) =>
          option
            .setRequired(true)
            .setName("tabscreenshot")
            .setDescription(
              'The screenshot of the tab of demo contracts with "???" in the search bar'
            )
        )
        .addAttachmentOption((option) =>
          option
            .setRequired(true)
            .setName("vinderiscreenshot")
            .setDescription(
              "The screenshot of level 5 Vinderi with brooch hovered"
            )
        )
        .addAttachmentOption((option) =>
          option
            .setRequired(true)
            .setName("trinketscreenshot")
            .setDescription("The screenshot of your heist trinket")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("report")
        .setDescription(
          "Reports results for a heist contract block. Please attach screenshots of the reward stash tab."
        )
        .addIntegerOption((option) =>
          option
            .setName("blockno")
            .setDescription("What was your block number?")
            .setMinValue(0)
            .setMaxValue(50)
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setRequired(false)
            .setName("tabscreenshot")
            .setDescription("The screenshot of the 12x12 tab of non-core drops")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("status")
        .setDescription("Prints current status of reported data.")
    ),
  async execute(interaction) {
    console.log(interaction.options.getSubcommand());
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
  const tabScreenshot = interaction.options.getAttachment("tabscreenshot");
  const blockNo = await gSheets.heist.createBlock(interaction);
  const embeddedResponse = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Block #${blockNo}`)
    .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.heist}`)
    .setDescription(`Request registered by @${interaction.user.username}`)
    .setImage(tabScreenshot.url)
    .setTimestamp();

  await interaction
    .reply({ embeds: [embeddedResponse], ephemeral: false })
    .then(() => console.log("Block request reply sent."))
    .catch(console.error);
}

async function handleReport(interaction) {
  const tabScreenshot = interaction.options.getAttachment("tabscreenshot");
  const blockNo = interaction.options.get("blockno").value;
  const result = await gSheets.heist.reportBlock(interaction);
  const success = !!result && !result.error;
  const embeddedResponse = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Block #${blockNo} Reported`)
    .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.heist}`)
    .setDescription(`Request registered by @${interaction.user.username}`)
    .setImage(tabScreenshot?.url)
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
  const { reportedCount, claimedCount } = await gSheets.heist.getStatus();
  const embeddedResponse = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${reportedCount.toString()} blocks reported`)
    .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.heist}`)
    .addFields(
      {
        name: "Reported Blocks:",
        value: reportedCount.toString(),
        inline: true,
      },
      {
        name: "Unclaimed Blocks:",
        value: (40 - claimedCount).toString(),
        inline: true,
      },
      {
        name: "Reported Contract Total:",
        value: (reportedCount * 100).toString(),
        inline: false,
      }
    )
    .setTimestamp();

  await interaction
    .reply({ embeds: [embeddedResponse], ephemeral: false })
    .then(() => console.log("Status reply sent."))
    .catch(console.error);
}
