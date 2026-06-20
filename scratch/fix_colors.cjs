const fs = require('fs');

const files = [
  'src/index.css',
  'src/components/TradeCard.jsx',
  'src/components/SemesterCard.jsx',
  'src/components/LessonCard.jsx',
  'src/pages/Home.jsx',
  'src/pages/VideoPlayer.jsx',
  'src/pages/Lessons.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace hardcoded old colors with new colors
  content = content.replace(/rgba\(140, 198, 63,/g, 'rgba(139, 90, 43,'); 
  content = content.replace(/rgba\(0, 173, 239,/g, 'rgba(196, 164, 132,'); 
  content = content.replace(/rgba\(28, 68, 133,/g, 'rgba(92, 64, 51,'); 
  content = content.replace(/rgba\(30, 75, 143,/g, 'rgba(92, 64, 51,'); 
  content = content.replace(/rgba\(15, 23, 42,/g, 'rgba(74, 63, 53,');
  
  content = content.replace(/#00adef/gi, '#c4a484'); 
  content = content.replace(/#8cc63f/gi, '#8b5a2b'); 
  content = content.replace(/#1c4485/gi, '#5c4033'); 
  content = content.replace(/#1e4b8f/gi, '#5c4033'); 
  content = content.replace(/#e2ebf6/gi, '#f4eee8'); 

  // Empty ruleset lint fix for index.css
  if (file === 'src/index.css') {
    content = content.replace(/\/\* ── Dark theme overrides[\s\S]*?:root\.dark {\s*\/\* Site locked to Light Theme \*\/\s*}/, '');
  }

  fs.writeFileSync(file, content);
});

console.log('Color updates complete.');
