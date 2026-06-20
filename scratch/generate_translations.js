import fs from 'fs';
import Papa from 'papaparse';

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Free Google Translate API call
async function fetchTranslation(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  if (data && data[0]) {
    return data[0].map(x => x[0]).join('');
  }
  throw new Error("Invalid response format");
}

// Batch translator with individual fallback
async function translateBatch(batch, targetLang) {
  const joinedText = batch.join('\n');
  try {
    const translatedJoined = await fetchTranslation(joinedText, targetLang);
    // Split by newline
    const lines = translatedJoined.split('\n').map(l => l.trim());
    if (lines.length === batch.length) {
      const result = {};
      batch.forEach((orig, idx) => {
        result[orig] = lines[idx];
      });
      return result;
    } else {
      console.warn(`[Batch length mismatch] Expected ${batch.length}, got ${lines.length}. Falling back to individual translation...`);
    }
  } catch (err) {
    console.warn(`[Batch failed] Error: ${err.message}. Falling back to individual translation...`);
  }

  // Fallback to individual
  const result = {};
  for (const str of batch) {
    try {
      const trans = await fetchTranslation(str, targetLang);
      result[str] = trans;
    } catch (e) {
      console.error(`[Individual failed] Could not translate "${str.substring(0, 30)}":`, e.message);
      result[str] = str; // Fallback to original
    }
    await sleep(100);
  }
  return result;
}

async function run() {
  console.log("Reading public/data/lessons.csv...");
  const csvContent = fs.readFileSync('public/data/lessons.csv', 'utf8');
  
  const results = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    delimiter: '|'
  });
  
  const data = results.data;
  const trades = new Set();
  const semesters = new Set();
  const modules = new Set();
  const titles = new Set();
  const descriptions = new Set();
  
  data.forEach(row => {
    // Clean keys and values
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
  
  const allUniqueStrings = [
    ...Array.from(trades),
    ...Array.from(semesters),
    ...Array.from(modules),
    ...Array.from(titles),
    ...Array.from(descriptions)
  ].filter(Boolean);
  
  console.log(`Found ${allUniqueStrings.length} unique strings to translate (Trades: ${trades.size}, Semesters: ${semesters.size}, Modules: ${modules.size}, Titles: ${titles.size}, Descriptions: ${descriptions.size})`);
  
  const translations = {
    hi: {},
    mr: {}
  };

  const BATCH_SIZE = 15;
  const batches = [];
  for (let i = 0; i < allUniqueStrings.length; i += BATCH_SIZE) {
    batches.push(allUniqueStrings.slice(i, i + BATCH_SIZE));
  }

  // Hindi Translations
  console.log(`Translating in ${batches.length} batches of ${BATCH_SIZE} strings to Hindi (hi)...`);
  for (let idx = 0; idx < batches.length; idx++) {
    const batch = batches[idx];
    const transMap = await translateBatch(batch, 'hi');
    Object.assign(translations.hi, transMap);
    console.log(`Hindi Progress: Batch ${idx + 1}/${batches.length} done (${Math.round((idx+1)/batches.length*100)}%)`);
    await sleep(200); // Be polite
  }

  // Marathi Translations
  console.log(`Translating in ${batches.length} batches of ${BATCH_SIZE} strings to Marathi (mr)...`);
  for (let idx = 0; idx < batches.length; idx++) {
    const batch = batches[idx];
    const transMap = await translateBatch(batch, 'mr');
    Object.assign(translations.mr, transMap);
    console.log(`Marathi Progress: Batch ${idx + 1}/${batches.length} done (${Math.round((idx+1)/batches.length*100)}%)`);
    await sleep(200); // Be polite
  }
  
  console.log("Writing translations to src/services/csvTranslations.js...");
  const fileContent = `// Static translations generated from lessons.csv
export const csvTranslations = ${JSON.stringify(translations, null, 2)};
`;
  
  fs.writeFileSync('src/services/csvTranslations.js', fileContent, 'utf8');
  console.log("Static CSV translations generated successfully!");
}

run().catch(console.error);
