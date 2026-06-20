import fs from 'fs';
import Papa from 'papaparse';

const csvContent = fs.readFileSync('public/data/lessons.csv', 'utf8');

Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  delimiter: '|',
  complete: (results) => {
    const data = results.data;
    if (data.length > 0) {
      console.log('Row 0 keys:', Object.keys(data[0]));
      console.log('Row 0 data:', data[0]);
    }
    const trades = new Set();
    const semesters = new Set();
    const modules = new Set();
    const titles = new Set();
    const descriptions = new Set();

    data.forEach(row => {
      // Clean keys
      const cleanRow = {};
      Object.keys(row).forEach(k => {
        cleanRow[k.trim()] = row[k] ? row[k].trim() : '';
      });

      if (cleanRow.Trade) trades.add(cleanRow.Trade);
      if (cleanRow.Year) semesters.add(cleanRow.Year);
      if (cleanRow.Module) modules.add(cleanRow.Module);
      if (cleanRow.Title) titles.add(cleanRow.Title);
      if (cleanRow.Description) descriptions.add(cleanRow.Description);
    });

    console.log('Unique Trades:', [...trades]);
    console.log('Unique Semesters:', [...semesters]);
    console.log('Unique Modules Count:', modules.size);
    console.log('Unique Titles Count:', titles.size);
    console.log('Unique Descriptions Count:', descriptions.size);
  }
});
