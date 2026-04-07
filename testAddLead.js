const { addLeadToSheet } = require("../services/googleSheets");

async function test() {
  await addLeadToSheet({
    phone: "9999999999",
    message: "Test Lead",
    name: "Test"
  });
}

test();