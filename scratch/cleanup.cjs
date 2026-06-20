const fs = require('fs');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/services/i18n.jsx', [
  { search: /'home.govResources': 'सरकारी व्यावसायिक संसाधन',/g, replace: "'home.govResources': 'शिक्षण संसाधन'," },
  { search: /'home.govResources': 'सरकारी व्यावसायिक संसाधने',/g, replace: "'home.govResources': 'शिक्षण संसाधने'," },
]);

console.log('Final text cleanup completed successfully.');
