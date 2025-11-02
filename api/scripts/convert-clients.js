// scripts/convert-clients.cjs
const XLSX = require("xlsx");
const { writeFileSync } = require("fs");

function convertExcelToJson(path, output) {
  const workbook = XLSX.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet);
  writeFileSync(output, JSON.stringify(json, null, 2));
  console.log(`✅ Converted ${path} → ${output}`);
}

convertExcelToJson("./scripts/Client A.xls", "./config/clientA.json");
convertExcelToJson("./scripts/Client B.xls", "./config/clientB.json");
