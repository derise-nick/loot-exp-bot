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
    .addSubcommandGroup((subCommandGroup) =>
      subCommandGroup
        .setName("report")
        .setDescription(
          "Reports results for a heist contract block. Please attach screenshots of the reward stash tab."
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName('ultimatum')
            .setDescription('Reports ultimatum chests and rewards')
            .addIntegerOption((option) =>
              option
                .setName("blockno")
                .setDescription("What was your block number?")
                .setMinValue(0)
                .setMaxValue(50)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("ultimatumchests")
                .setDescription("How many ultimatum chests did you open?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("rustedulti")
                .setDescription("How many rusted ultimatum scarabs did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("polishedulti")
                .setDescription("How many polished ultimatum scarabs did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("gildedulti")
                .setDescription("How many gilded ultimatum scarabs did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("wingedulti")
                .setDescription("How many winged ultimatum scarabs did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addAttachmentOption((option) =>
              option
                .setRequired(true)
                .setName("tabscreenshot")
                .setDescription("The screenshot of the 12x12 tab of non-core drops")
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName('catalysts')
            .setDescription('Reports ultimatum chests and rewards')
            .addIntegerOption((option) =>
              option
                .setName("blockno")
                .setDescription("What was your block number?")
                .setMinValue(0)
                .setMaxValue(50)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("abrasive")
                .setDescription("How many abrasive catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("accelerating")
                .setDescription("How many accelerating catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("fertile")
                .setDescription("How many fertile catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("imbued")
                .setDescription("How many imbued catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("intrinsic")
                .setDescription("How many intrinsic catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("noxious")
                .setDescription("How many noxious catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("prismatic")
                .setDescription("How many prismatic catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("tempering")
                .setDescription("How many tempering catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("turbulent")
                .setDescription("How many turbulent catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("unstable")
                .setDescription("How many unstable catalysts did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
        )
        .addSubcommand((subCommand) =>
          subCommand
            .setName('delirium')
            .setDescription('Reports delirium chests and rewards')
            .addIntegerOption((option) =>
              option
                .setName("blockno")
                .setDescription("What was your block number?")
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("deliriumchests")
                .setDescription("How many delirium chests did you open?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("smallcluster")
                .setDescription("How many small cluster jewels did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("medcluster")
                .setDescription("How many medium cluster jewels did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("lgcluster")
                .setDescription("How many large cluster jewels did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("simsplinters")
                .setDescription("How many simulacrum splinters did you obtain?")
                .setMinValue(0)
                .setMaxValue(1000)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("twentydeli")
                .setDescription("How many 20% delirious maps did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("fortydeli")
                .setDescription("How many 40% delirious maps did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("sixtydeli")
                .setDescription("How many 60% delirious maps did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("eightydeli")
                .setDescription("How many 80% delirious maps did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("fulldeli")
                .setDescription("How many 100% delirious maps did you obtain?")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName("status")
        .setDescription("Prints current status of reported data.")
    ),
  async execute(interaction) {
    if (interaction.options?.getSubcommandGroup() == 'report') {
      switch (interaction.options.getSubcommand()) {
        case "delirium":
          await handleDelirium(interaction);
          break;
        case "catalysts":
          await handleCatalyst(interaction);
          break;
        case "ultimatum":
          await handleUltimatum(interaction);
          break;
      }
    }
    switch (interaction.options.getSubcommand()) {
      case "request":
        await handleRequest(interaction);
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

async function handleDelirium(interaction) {
  const blockNo = interaction.options.get("blockno").value;
  const result = await gSheets.heist.reportBlock(interaction);
  const success = !!result && !result.error;
  const embeddedResponse = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Block #${blockNo} Delirium Reported`)
    .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.heist}`)
    .setDescription(`Request registered by @${interaction.user.username}. `)
    .addFields(
      { name: 'blockno', value: blockNo?.toString(), inline: true },
      { name: 'deliriumchests', value: interaction.options.get('deliriumchests')?.value?.toString(), inline: true },
      { name: 'smallcluster', value: interaction.options.get('smallcluster')?.value?.toString(), inline: true },
      { name: 'medcluster', value: interaction.options.get('medcluster')?.value?.toString(), inline: true },
      { name: 'lgcluster', value: interaction.options.get('lgcluster')?.value?.toString(), inline: true },
      { name: 'simsplinters', value: interaction.options.get('simsplinters')?.value?.toString(), inline: true },
      { name: 'twentydeli', value: interaction.options.get('twentydeli')?.value?.toString(), inline: true },
      { name: 'fortydeli', value: interaction.options.get('fortydeli')?.value?.toString(), inline: true },
      { name: 'sixtydeli', value: interaction.options.get('sixtydeli')?.value?.toString(), inline: true },
      { name: 'eightydeli', value: interaction.options.get('eightydeli')?.value?.toString(), inline: true },
      { name: 'fulldeli', value: interaction.options.get('fulldeli')?.value?.toString(), inline: true }
    )
    .setTimestamp();

  await replyWithEmbed(success, interaction, embeddedResponse);
}

async function handleUltimatum(interaction) {
  const tabScreenshot = interaction.options.getAttachment("tabscreenshot");
  const blockNo = interaction.options.get("blockno").value;
  const result = await gSheets.heist.reportBlock(interaction);
  const success = !!result && !result.error;
  const embeddedResponse = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Block #${blockNo} Ultimatum Reported`)
    .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.heist}`)
    .setDescription(`Request registered by @${interaction.user.username}.`)
    .setImage(tabScreenshot?.url)
    .addFields(
      { name: 'ultimatumchests', value: interaction.options.get('ultimatumchests')?.value?.toString() },
      { name: 'rustedulti', value: interaction.options.get('rustedulti')?.value?.toString() },
      { name: 'polishedulti', value: interaction.options.get('polishedulti')?.value?.toString() },
      { name: 'gildedulti', value: interaction.options.get('gildedulti')?.value?.toString() },
      { name: 'wingedulti', value: interaction.options.get('wingedulti')?.value?.toString() }
    )
    .setTimestamp();

  await replyWithEmbed(success, interaction, embeddedResponse);
}

async function handleCatalyst(interaction) {
  const blockNo = interaction.options.get("blockno").value;
  const result = await gSheets.heist.reportBlock(interaction);
  const success = !!result && !result.error;
  const embeddedResponse = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Block #${blockNo} Catalysts Reported`)
    .setURL(`https://docs.google.com/spreadsheets/d/${sheetIds.heist}`)
    .setDescription(`Request registered by @${interaction.user.username}.`)
    .addFields(
      { name: 'Abrasive Catalysts', value: interaction.options.get('abrasive')?.value?.toString(), inline: true },
      { name: 'Accelerating Catalysts', value: interaction.options.get('accelerating')?.value?.toString(), inline: true },
      { name: 'Fertile Catalysts', value: interaction.options.get('fertile')?.value?.toString(), inline: true },
      { name: 'Imbued Catalysts', value: interaction.options.get('imbued')?.value?.toString(), inline: true },
      { name: 'Intrinsic Catalysts', value: interaction.options.get('intrinsic')?.value?.toString(), inline: true },
      { name: 'Noxious Catalysts', value: interaction.options.get('noxious')?.value?.toString(), inline: true },
      { name: 'Prismatic Catalysts', value: interaction.options.get('prismatic')?.value?.toString(), inline: true },
      { name: 'Tempering Catalysts', value: interaction.options.get('tempering')?.value?.toString(), inline: true },
      { name: 'Turbulent Catalysts', value: interaction.options.get('turbulent')?.value?.toString(), inline: true },
      { name: 'Unstable Catalysts', value: interaction.options.get('unstable')?.value?.toString(), inline: true },
    )
    .setTimestamp();

  await replyWithEmbed(success, interaction, embeddedResponse);
}

async function replyWithEmbed(success, interaction, embeddedResponse) {
  if (success) {
    await interaction
      .reply({ embeds: [embeddedResponse], ephemeral: false })
      .then(() => console.log("Block report reply sent."))
      .catch(console.error);
  } else {
    await interaction
      .reply({
        ephemeral: true,
        content: "Something went wrong! Please ensure your block number is correct and try again. If you've already reported your result and need to make a change, please contact a mod.",
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
