const fs = require('fs');
let content = fs.readFileSync('src/services/i18n.jsx', 'utf8');

// General replacements
content = content.replace(/E-Kaushalaya Hub/g, 'Dasvi Platform');
content = content.replace(/nav\.digitalITI': 'Dasvi Platform'/g, "nav.digitalITI': 'Dasvi'");
content = content.replace(/nav\.digitalITI': 'लर्निंग प्लेटफ़ॉर्म'/g, "nav.digitalITI': 'Dasvi'");
content = content.replace(/nav\.digitalITI': 'लर्निंग प्लॅटफॉर्म'/g, "nav.digitalITI': 'Dasvi'");

content = content.replace(/'hero\.titleHighlight': 'ITI Academy'/g, "'hero.titleHighlight': 'School & Beyond'");
content = content.replace(/'hero\.titleHighlight': 'डिजिटल सशक्तिकरण'/g, "'hero.titleHighlight': 'School & Beyond'");
content = content.replace(/'hero\.titleHighlight': 'डिजिटल सक्षमीकरण'/g, "'hero.titleHighlight': 'School & Beyond'");

content = content.replace(/'hero\.description': '.*?'/g, "'hero.description': 'Discover a comprehensive library of premium, 100% free digital learning resources. Access video lectures for 9th, 10th, 12th standards, tech training, resume building, career roadmaps, and more in English, Hindi, and Marathi.'");

content = content.replace(/'home\.whatTrade': 'What trade do you want to learn today\?'/g, "'home.whatTrade': 'What do you want to learn today?'");
content = content.replace(/'home\.coreTradesTitle': 'Core ITI Courseware Trades'/g, "'home.coreTradesTitle': 'Learning Categories'");
content = content.replace(/'home\.noTradesParsed': 'No trades parsed\. Please upload a valid CSV syllabus to populate\.'/g, "'home.noTradesParsed': 'No categories parsed. Please upload a valid CSV syllabus to populate.'");

content = content.replace(/'home\.visionP1': '.*?'/g, "'home.visionP1': 'Dasvi by Mindstix Foundation Trust provides a universal platform for 9th, 10th, and 12th standards in English, Hindi, and Marathi. We also offer specialized English grammar lessons in Marathi.'");
content = content.replace(/'home\.visionP2': '.*?'/g, "'home.visionP2': 'We integrate basic tech training like Word and Excel, career roadmaps, MCQs, and resume formatting videos, all free of cost to empower your growth.'");

content = content.replace(/'home\.itiCenters': 'ITI Centers Partnered'/g, "'home.itiCenters': 'Schools Partnered'");

content = content.replace(/'trade\.overview': 'TRADE OVERVIEW'/g, "'trade.overview': 'CATEGORY OVERVIEW'");
content = content.replace(/'trade\.chooseSemester': 'Choose a semester to access custom curriculum video packages, downloadable workbooks, and resource files\.'/g, "'trade.chooseSemester': 'Choose a medium or program to access custom curriculum video packages, downloadable workbooks, and resource files.'");
content = content.replace(/'trade\.selectYear': 'Select Year \/ Semester'/g, "'trade.selectYear': 'Select Medium / Program'");

content = content.replace(/'hero\.statTrades': 'Core ITI Trades'/g, "'hero.statTrades': 'Categories'");
content = content.replace(/'home\.govResources': 'OFFICIAL GOVERNMENT VOCATIONAL RESOURCES'/g, "'home.govResources': 'LEARNING RESOURCES'");
content = content.replace(/'home\.nimiTitle': 'NIMI Mock Test & Bharat Skills Portal'/g, "'home.nimiTitle': 'Practice & Growth'");
content = content.replace(/'home\.nimiDesc': '.*?'/g, "'home.nimiDesc': 'Practice MCQs, build your resume, and explore career roadmaps for a successful future.'");
content = content.replace(/'home\.nimiMockTestApp': 'Nimi Mock Test App'/g, "'home.nimiMockTestApp': 'MCQs & Tests'");
content = content.replace(/'home\.visitBharatSkills': 'Visit Bharat Skills'/g, "'home.visitBharatSkills': 'Career Roadmap'");


fs.writeFileSync('src/services/i18n.jsx', content);
console.log('Updated i18n.jsx');
