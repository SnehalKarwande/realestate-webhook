const { GoogleSpreadsheet } = require("google-spreadsheet");

async function addLeadToSheet(data) {
  try {
    console.log("🚀 Starting Google Sheets process...");

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // Authenticate using ENV variables only
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo(); // loads document properties and worksheets
    console.log("📄 Sheet Loaded:", doc.title);

    const sheet = doc.sheetsByIndex[0]; // first sheet
    const row = await sheet.addRow({
      "Date/Time": new Date().toLocaleString(),
      "Customer Number": data.phone,
      "Intent": data.message,
      "Property": data.name,
    });

    console.log("✅ Lead added:", row._rawData);
    return true;

  } catch (error) {
    console.error("💥 Google Sheets Error:", error.message);
    return false;
  }
}

module.exports = { addLeadToSheet };