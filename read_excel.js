const xlsx = require('xlsx');

const workbook = xlsx.readFile('e:/FinTech AI/ai-finance/expanda/Daily_Expense_Tracker_Jun2025_Jun2026.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

console.log(JSON.stringify(data.slice(0, 5), null, 2));
console.log("Total rows:", data.length);
