const { google } = require("googleapis");
const gAuth = require("./jwt-auth");
const { sheetIds } = require("../config.json");

function getAuthRecord() {
  return gAuth.authRecord;
}

async function getSheet() {
  // Load the api, specific sheet, and define the relevant cell range.
  const sheetsApi = google.sheets({ version: "v4", auth: getAuthRecord() });
  const range = "Blocks!A2:H";
  const res = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: sheetIds.strand,
    range,
  });

  const rows = res.data.values;
  // Exit early if the sheet is empty. This is a sign that we loaded the wrong range or something has gone wrong in the sheet
  if (!rows || rows.length === 0) {
    console.error("Something went wrong! No data found!");
    return;
  }

  return {
    sheetsApi,
    spreadSheet: res,
    rows,
    range,
    spreadsheetId: sheetIds.strand,
  };
}

module.exports = {
  /**
   * Creates an entry on the Strand Blocks sheet by appending the next empty block.
   * @param {CommandInteraction} interaction - The command interaction triggering block creation
   * @returns The block number of the created record
   */
  async createBlock(interaction) {
    // // Load the api, specific sheet, and define the relevant cell range.
    // const sheets = google.sheets({ version: "v4", auth: getAuthRecord() });
    // const spreadsheetId = sheetIds.strand;
    // const range = "Blocks!A2:H";
    // const res = await sheets.spreadsheets.values.get({
    //   spreadsheetId,
    //   range,
    // });

    // const rows = res.data.values;
    // // Exit early if the sheet is empty. This is a sign that we loaded the wrong range or something has gone wrong in the sheet
    // if (!rows || rows.length === 0) {
    //   console.error("Something went wrong! No data found!");
    //   return;
    // }

    const { sheetsApi, rows, range, spreadsheetId } = await getSheet();

    if (!rows?.length) {
      return;
    }

    // Generate next block of values, including the stash screenshot
    let blockNo = rows.length + 1;
    let imageCell = `=IMAGE("${
      interaction.options.getAttachment("screenshot").url
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
  async reportBlock(interaction) {
    const { sheetsApi, rows, range, spreadsheetId } = await getSheet();

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
      imageCell1 = `=IMAGE("${
        interaction.options.getAttachment("screenshot1")?.url
      }")`;
      imageCell2 = `=IMAGE("${
        interaction.options.getAttachment("screenshot2")?.url
      }")`;
      imageCell3 = `=IMAGE("${
        interaction.options.getAttachment("screenshot3")?.url
      }")`;
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
        `Block #${blockNo} updated. ${
          result.data?.updatedCells || result.data?.updates?.updatedCells
        } cells updated.`
      );
      return result;
    } catch (err) {
      // TODO - Handle exception
      throw err;
    }
  },
  async getStatus() {
    const { rows } = await getSheet();
    const reportedCount = rows.reduce(
      (acc, row) => acc + (!!row[4] ? 1 : 0),
      0
    );
    const twinnedCount = rows.reduce(
      (acc, row) => acc + (!!row[4] ? Number(row[2]) || 0 : 0),
      0
    );
    const isbCount = rows.reduce((acc, row) => acc + (Number(row[4]) || 0), 0);
    const claimedCount = rows.length;
    return {
      reportedCount,
      twinnedCount,
      isbCount,
      claimedCount,
    };
  },
};
