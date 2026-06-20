const fs = require('fs');

let content = fs.readFileSync('src/services/i18n.jsx', 'utf8');

// Replace specific descriptions globally
content = content.replace(/'tradeCard\.desc\.chnm': '.*?',/g, "'tradeCard.desc.class 9': 'Foundational lessons for 9th Standard students. Includes Mathematics, Science, and English Grammar.',");
content = content.replace(/'tradeCard\.desc\.fitter': '.*?',/g, "'tradeCard.desc.class 10': 'Core subjects for 10th Standard. Prepare for board exams with Maths, Science, and English.',");
content = content.replace(/'tradeCard\.desc\.electrician': '.*?',/g, "'tradeCard.desc.class 12': 'Advanced topics for 12th Standard students including Physics, Mathematics, and language skills.',");
content = content.replace(/'tradeCard\.desc\.copa': '.*?',/g, "'tradeCard.desc.skill development': 'Tech training and growth programs including MS Word, Excel, and introductory programming.',");
content = content.replace(/'tradeCard\.desc\.welder': '.*?',/g, "'tradeCard.desc.career guidance': 'Career roadmap, resume building, MCQs, and interview preparation for future success.',");
content = content.replace(/'tradeCard\.desc\.mechanic': '.*?',/g, '');
content = content.replace(/'tradeCard\.desc\.turner': '.*?',/g, '');
content = content.replace(/'tradeCard\.desc\.draftsman': '.*?',/g, '');
content = content.replace(/'tradeCard\.desc\.default': '.*?'/g, "'tradeCard.desc.default': 'Comprehensive educational resources and lessons.'");

fs.writeFileSync('src/services/i18n.jsx', content);
console.log('Descriptions updated');
