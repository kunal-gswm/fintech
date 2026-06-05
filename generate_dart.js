const fs = require('fs');
const xlsx = require('xlsx');

const workbook = xlsx.readFile('e:/FinTech AI/ai-finance/expanda/Daily_Expense_Tracker_Jun2025_Jun2026.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });

// Ensure the data directory exists
const dir = 'e:/FinTech AI/ai-finance/expanda/lib/data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Map the data into a dart string
let dartContent = `// GENERATED FILE - DO NOT EDIT MANUALLY\n\n`;
dartContent += `const List<Map<String, dynamic>> excelSeedData = [\n`;

data.forEach(row => {
  let dateStr = row.Date;

  // Escape quotes
  const category = (row.Category || '').replace(/'/g, "\\'");
  const desc = (row.Description || '').replace(/'/g, "\\'");
  const type = (row.Type || '').replace(/'/g, "\\'");
  
  // Parse amount cleanly
  let amountStr = row.Amount;
  let amount = 0;
  if (typeof amountStr === 'string') {
    amount = parseFloat(amountStr.replace(/[^0-9.-]+/g, ''));
  } else if (typeof amountStr === 'number') {
    amount = amountStr;
  }
  
  dartContent += `  {\n`;
  dartContent += `    'date': '${dateStr}',\n`;
  dartContent += `    'category': '${category}',\n`;
  dartContent += `    'description': '${desc}',\n`;
  dartContent += `    'amount': ${amount},\n`;
  dartContent += `    'type': '${type}'\n`;
  dartContent += `  },\n`;
});

dartContent += `];\n`;

fs.writeFileSync(`${dir}/excel_seed_data.dart`, dartContent);
console.log('Successfully generated excel_seed_data.dart with ' + data.length + ' rows.');
