const { google } = require("googleapis");
const gAuth = require("./jwt-auth");
const { sheetIds } = require("../config.json");

function getAuthRecord() {
  return gAuth.authRecord;
}

async function getSheet(sheetId) {
  // Load the api, specific sheet, and define the relevant cell range.
  const sheetsApi = google.sheets({ version: "v4", auth: getAuthRecord() });
  const range = "Blocks!A1:AE";
  const res = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
    valueRenderOption: "FORMULA", // Without this, image formula cells will return '' which leads to deleting all images when updating
  });

  const rows = res.data.values;
  // Exit early if the sheet is empty. This is a sign that we loaded the wrong range or something has gone wrong in the sheet
  if (!rows || rows.length === 0) {
    console.error(
      "Something went wrong while loading Google Sheet! No data found!"
    );
    return;
  }

  return {
    sheetsApi,
    spreadSheet: res,
    rows,
    range,
    spreadsheetId: sheetId,
  };
}

module.exports = {
  strand: {
    /**
     * Creates an entry on the Strand Blocks sheet by appending the next empty block.
     * @param {CommandInteraction} interaction - The command interaction triggering block creation
     * @returns The block number of the created record
     */
    async createBlock(interaction) {
      const { sheetsApi, rows, range, spreadsheetId } = await getSheet(
        sheetIds.strand
      );

      if (!rows?.length) {
        return;
      }

      // Generate next block of values, including the stash screenshot
      let blockNo = rows.length;
      let imageCell = `=IMAGE("${interaction.options.getAttachment("screenshot").url
        }")`;
      let values = [
        [
          blockNo,
          interaction.user.username,
          interaction.options.get("twinned").value.toString(),
          imageCell,
        ],
      ];
      const resource = {
        values,
      };

      // Append the row to the sheet. We use `USER_ENTERED` because we're using a formula for the screenshot, until the api natively supports BLOBs
      try {
        const result = await sheetsApi.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: "USER_ENTERED",
          resource,
        });
        console.log(
          `Block #${blockNo} created. ${result.data.updates.updatedCells} cells appended.`
        );
        return blockNo;
      } catch (err) {
        // TODO - Handle exception
        throw err;
      }
    },
    /**
     * Updates the entry on the Strand Blocks sheet according to the user-provided block number.
     * @param {CommandInteraction} interaction - The command interaction triggering block update
     * @returns The Google Sheets API reponse
     */
    async reportBlock(interaction) {
      const { sheetsApi, rows, range, spreadsheetId } = await getSheet(
        sheetIds.strand
      );

      if (!rows?.length) {
        return;
      }

      let blockNo = interaction.options.get("blockno")?.value?.toString();
      if (rows.find((r) => r[0] == blockNo)?.[4]) {
        return { error: "PREVIOUSLY_REPORTED" };
      }

      // Update row for provided block, including ISB screenshots, if present
      let isbCount = interaction.options.get("isbcount")?.value;
      let imageCell1, imageCell2, imageCell3;
      if (isbCount && isbCount > 0) {
        imageCell1 = `=IMAGE("${interaction.options.getAttachment("screenshot1")?.url}")`;
        imageCell2 = `=IMAGE("${interaction.options.getAttachment("screenshot2")?.url}")`;
        imageCell3 = `=IMAGE("${interaction.options.getAttachment("screenshot3")?.url}")`;
      }
      let values = [
        null,
        null,
        null,
        null, // null is ignored, which is desired since we don't want to change the first 4 values
        isbCount.toString(),
        imageCell1,
        imageCell2,
        imageCell3,
      ];

      // Update the appropriate row to the sheet. We use `USER_ENTERED` because we're using a formula for the screenshots, until the api natively supports BLOBs
      try {
        const result = await sheetsApi.spreadsheets.values.update({
          spreadsheetId,
          range,
          resource: { values: rows.map((r) => (r[0] == blockNo ? values : r)) },
          valueInputOption: "USER_ENTERED",
        });
        console.log(
          `Block #${blockNo} updated. ${result.data?.updatedCells || result.data?.updates?.updatedCells
          } cells updated.`
        );
        return result;
      } catch (err) {
        // TODO - Handle exception
        throw err;
      }
    },
    /**
     * Collates the data from the sheet for reporting status.
     * @returns An object with reportedCount, twinnedCount, isbCount, claimedCount,
     */
    async getStatus() {
      const { rows } = await getSheet(sheetIds.strand);
      const reportedCount = rows.reduce(
        (acc, row) => acc + (!!row[4] ? 1 : 0),
        0
      );
      const twinnedCount = rows.reduce(
        (acc, row) => acc + (!!row[4] ? Number(row[2]) || 0 : 0),
        0
      );
      const isbCount = rows.reduce(
        (acc, row) => acc + (Number(row[4]) || 0),
        0
      );
      const claimedCount = rows.length;
      return {
        reportedCount,
        twinnedCount,
        isbCount,
        claimedCount,
      };
    },
  },
  heist: {
    /**
     * Creates an entry on the Heist Blocks sheet by appending the next empty block.
     * @param {CommandInteraction} interaction - The command interaction triggering block creation
     * @returns The block number of the created record
     */
    async createBlock(interaction) {
      const { sheetsApi, rows, range, spreadsheetId } = await getSheet(
        sheetIds.heist
      );

      // If range didn't return, this means there was an error (which we've already logged)
      if (!range) {
        return;
      }

      // Generate next block of values, including the stash screenshot
      let blockNo = rows.length;
      let tabScreenshotValue = `=IMAGE("${interaction.options.getAttachment("tabscreenshot").url}")`;
      let vinderiScreenshotValue = `=IMAGE("${interaction.options.getAttachment("vinderiscreenshot").url}")`;
      let trinketScreenshotValue = `=IMAGE("${interaction.options.getAttachment("trinketscreenshot").url}")`;
      let values = [
        [
          blockNo,
          interaction.user.username,
          tabScreenshotValue,
          vinderiScreenshotValue,
          trinketScreenshotValue
        ],
      ];
      const resource = {
        values,
      };

      // Append the row to the sheet. We use `USER_ENTERED` because we're using a formula for the screenshot, until the api natively supports BLOBs
      try {
        const result = await sheetsApi.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: "USER_ENTERED",
          resource,
        });
        console.log(
          `Block #${blockNo} created. ${result.data.updates.updatedCells} cells appended.`
        );
        return blockNo;
      } catch (err) {
        // TODO - Handle exception
        throw err;
      }
    },
    /**
     * Updates the entry on the Heist Blocks sheet according to the user-provided block number.
     * @param {CommandInteraction} interaction - The command interaction triggering block update
     * @returns The Google Sheets API reponse
     */
    async reportBlock(interaction) {
      const { sheetsApi, rows, range, spreadsheetId } = await getSheet(
        sheetIds.heist
      );

      // If range didn't return, this means there was an error (which we've already logged)
      if (!range) {
        return;
      }

      let blockNo = interaction.options.get("blockno")?.value?.toString();
      if (await this.isSubcommandReported(blockNo, interaction.options.getSubcommand(), rows)) {
        return { error: "PREVIOUSLY_REPORTED" };
      }

      // Update row for provided block, including ISB screenshots, if present
      let values = getValues(interaction);

      // Update the appropriate row to the sheet. We use `USER_ENTERED` because we're using a formula for the screenshots, until the api natively supports BLOBs
      try {
        const result = await sheetsApi.spreadsheets.values.update({
          spreadsheetId,
          range,
          resource: { values: rows.map((r) => (r[0] == blockNo ? values : r)) },
          valueInputOption: "USER_ENTERED",
        });
        console.log(
          `Block #${blockNo} updated. ${result.data?.updatedCells || result.data?.updates?.updatedCells
          } cells updated.`
        );
        return result;
      } catch (err) {
        // TODO - Handle exception
        throw err;
      }
    },
    /**
     * Collates the data from the sheet for reporting status.
     * @returns An object with reportedCount, twinnedCount, isbCount, claimedCount,
     */
    async getStatus() {
      const { rows } = await getSheet(sheetIds.heist);
      const reportedCount = rows.reduce(
        (acc, row) => acc + (!!row[4] ? 1 : 0),
        0
      );
      const claimedCount = rows.length;
      return {
        reportedCount,
        claimedCount,
      };
    },
    /**
     * Checks if range for given subcommand has already been reported for the given block.
     * @returns True if cells are populated in the sheet for given subcommand and block number
     */
    async isSubcommandReported(blockNo, subCommand, loadedRows = undefined) {
      const reportStartIndex = subCommand == 'ultimatum' ? 5 : subCommand == 'catalysts' ? 11 : 21
      if (loadedRows)
      {
        console.log(loadedRows.find((r) => r[0] == blockNo)?.[reportStartIndex])
        return !!(loadedRows.find((r) => r[0] == blockNo)?.[reportStartIndex])
      } else {
        const { rows } = await getSheet(sheetIds.heist);
        console.log(rows)
        console.log(rows.find((r) => r[0] == blockNo)?.[reportStartIndex])
        return !!(rows.find((r) => r[0] == blockNo)?.[reportStartIndex])
      }
    },
  },
};

function getValues(interaction) {
  switch (interaction.options.getSubcommand()) {
    case 'delirium':
      return getDeliValues(interaction);
    case 'catalysts':
      return getCatalystValues(interaction);
    case 'ultimatum':
      return getUltiValues(interaction);
  }
}

function getDeliValues(interaction) {
  const deliriumchests = interaction.options.get('deliriumchests')?.value?.toString()
  const smallcluster = interaction.options.get('smallcluster')?.value?.toString()
  const medcluster = interaction.options.get('medcluster')?.value?.toString()
  const lgcluster = interaction.options.get('lgcluster')?.value?.toString()
  const simsplinters = interaction.options.get('simsplinters')?.value?.toString()
  const twentydeli = interaction.options.get('twentydeli')?.value?.toString()
  const fortydeli = interaction.options.get('fortydeli')?.value?.toString()
  const sixtydeli = interaction.options.get('sixtydeli')?.value?.toString()
  const eightydeli = interaction.options.get('eightydeli')?.value?.toString()
  const fulldeli = interaction.options.get('fulldeli')?.value?.toString()

  const values = []
  for (let i = 0; i < 21; i++) {
    values.push(null);
  }
  return values.concat([
    deliriumchests,
    smallcluster,
    medcluster,
    lgcluster,
    simsplinters,
    twentydeli,
    fortydeli,
    sixtydeli,
    eightydeli,
    fulldeli
  ]);
}

function getUltiValues(interaction) {
  const ultimatumchests = interaction.options.get('ultimatumchests')?.value?.toString()
  const rustedulti = interaction.options.get('rustedulti')?.value?.toString()
  const polishedulti = interaction.options.get('polishedulti')?.value?.toString()
  const gildedulti = interaction.options.get('gildedulti')?.value?.toString()
  const wingedulti = interaction.options.get('wingedulti')?.value?.toString()

  let values = [
    null,
    null,
    null,
    null,
    null,
    `=IMAGE("${interaction.options.getAttachment("tabscreenshot")?.url}")`,
    ultimatumchests,
    rustedulti,
    polishedulti,
    gildedulti,
    wingedulti
  ];
  return values;
}

function getCatalystValues(interaction) {
  const abrasive = interaction.options.get('abrasive')?.value?.toString()
  const accelerating = interaction.options.get('accelerating')?.value?.toString()
  const fertile = interaction.options.get('fertile')?.value?.toString()
  const imbued = interaction.options.get('imbued')?.value?.toString()
  const intrinsic = interaction.options.get('intrinsic')?.value?.toString()
  const noxious = interaction.options.get('noxious')?.value?.toString()
  const prismatic = interaction.options.get('prismatic')?.value?.toString()
  const tempering = interaction.options.get('tempering')?.value?.toString()
  const turbulent = interaction.options.get('turbulent')?.value?.toString()
  const unstable = interaction.options.get('unstable')?.value?.toString()

  const values = []
  for (let i = 0; i < 11; i++) {
    values.push(null);
  }
  return values.concat([
    abrasive,
    accelerating,
    fertile,
    imbued,
    intrinsic,
    noxious,
    prismatic,
    tempering,
    turbulent,
    unstable,
  ]);
}
