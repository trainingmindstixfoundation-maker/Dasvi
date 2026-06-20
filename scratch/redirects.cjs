const fs = require('fs');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content);
}

// 1. Update i18n.jsx English translations
replaceInFile('src/services/i18n.jsx', [
  { search: /'nav.mockTest': "Mock Test 'Nimi'",/g, replace: "'nav.mockTest': 'Mindstix Foundation'," },
  { search: /'nav.nimiPortal': 'NIMI Portal',/g, replace: "'nav.nimiPortal': 'Our Website'," },
  { search: /'home.itiCenters': 'Schools Partnered',/g, replace: "'home.itiCenters': 'Schools Partnered'," }, // keep
  { search: /'home.curatedContentDesc': 'NIMI and standard national ITI alignment.',/g, replace: "'home.curatedContentDesc': 'Curated content mapped to national standards.'," },
  { search: /'home.nimiTitle': 'Practice & Growth',/g, replace: "'home.nimiTitle': 'Mindstix Foundation Trust'," },
  { search: /'home.nimiMockTestApp': 'MCQs & Tests',/g, replace: "'home.nimiMockTestApp': 'Visit Mindstix'," },
  { search: /'home.visitBharatSkills': 'Career Roadmap',/g, replace: "'home.visitBharatSkills': 'Our Initiatives'," },
  { search: /'contact.subtitle': 'Have questions about the ITI Learning Platform, syllabus modules, or technical support\? Feel free to reach out to us.',/g, replace: "'contact.subtitle': 'Have questions about the Dasvi Learning Platform, syllabus modules, or technical support? Feel free to reach out to us.'," },
  { search: /'footer.aboutText': 'Mindstix Foundation Trust is a registered non-profit organization dedicated to expanding access to top-tier technical training resources for vocational and ITI students across the nation.',/g, replace: "'footer.aboutText': 'Mindstix Foundation Trust is a registered non-profit organization dedicated to expanding access to top-tier technical training resources for students across the nation.'," },
  
  // Hindi
  { search: /'nav.mockTest': "मॉक टेस्ट 'निमी'",/g, replace: "'nav.mockTest': 'माइंडस्टिक्स फाउंडेशन'," },
  { search: /'nav.nimiPortal': 'निमी पोर्टल',/g, replace: "'nav.nimiPortal': 'हमारी वेबसाइट'," },
  { search: /'hero.titlePrefix': 'ITI अकादमी के लिए ',/g, replace: "'hero.titlePrefix': 'दसवीं प्लेटफार्म के लिए '," },
  { search: /'hero.statTrades': 'ITI ट्रेड',/g, replace: "'hero.statTrades': 'लर्निंग पाथ्स'," },
  { search: /'home.coreTradesTitle': 'मुख्य ITI कोर्सवेयर ट्रेड',/g, replace: "'home.coreTradesTitle': 'मुख्य लर्निंग श्रेणियां'," },
  { search: /'home.itiCenters': 'ITI केंद्र साझेदार',/g, replace: "'home.itiCenters': 'भागीदार स्कूल'," },
  { search: /'home.curatedContentDesc': 'निमी और राष्ट्रीय ITI मानकों के अनुसार।',/g, replace: "'home.curatedContentDesc': 'राष्ट्रीय मानकों के अनुसार सामग्री।'," },
  { search: /'home.nimiTitle': 'निमी मॉक टेस्ट और भारत स्किल्स पोर्टल',/g, replace: "'home.nimiTitle': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट'," },
  { search: /'home.nimiMockTestApp': 'निमी मॉक टेस्ट ऐप',/g, replace: "'home.nimiMockTestApp': 'माइंडस्टिक्स विजिट करें'," },
  { search: /'home.visitBharatSkills': 'भारत स्किल्स देखें',/g, replace: "'home.visitBharatSkills': 'हमारी पहल'," },
  { search: /'contact.subtitle': 'ITI लर्निंग प्लेटफ़ॉर्म, सिलेबस मॉड्यूल, या तकनीकी सहायता के बारे में प्रश्न हैं\? बेझिझक हमसे संपर्क करें।',/g, replace: "'contact.subtitle': 'दसवीं लर्निंग प्लेटफ़ॉर्म, सिलेबस मॉड्यूल, या तकनीकी सहायता के बारे में प्रश्न हैं? बेझिझक हमसे संपर्क करें।'," },
  { search: /'footer.aboutText': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट एक पंजीकृत गैर-लाभकारी संगठन है जो देश भर में व्यावसायिक और ITI छात्रों के लिए उच्च-स्तरीय तकनीकी प्रशिक्षण संसाधनों तक पहुँच बढ़ाने के लिए समर्पित है।',/g, replace: "'footer.aboutText': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट एक पंजीकृत गैर-लाभकारी संगठन है जो देश भर में छात्रों के लिए उच्च-स्तरीय तकनीकी प्रशिक्षण संसाधनों तक पहुँच बढ़ाने के लिए समर्पित है।'," },

  // Marathi
  { search: /'nav.mockTest': "मॉक टेस्ट 'निमी'",/g, replace: "'nav.mockTest': 'माइंडस्टिक्स फाउंडेशन'," },
  { search: /'nav.nimiPortal': 'निमी पोर्टल',/g, replace: "'nav.nimiPortal': 'आमची वेबसाइट'," },
  { search: /'hero.titlePrefix': 'ITI अकॅडमीसाठी ',/g, replace: "'hero.titlePrefix': 'दहावी प्लॅटफॉर्मसाठी '," },
  { search: /'hero.statTrades': 'ITI ट्रेड्स',/g, replace: "'hero.statTrades': 'लर्निंग पाथ्स'," },
  { search: /'home.coreTradesTitle': 'मुख्य ITI कोर्सवेअर ट्रेड्स',/g, replace: "'home.coreTradesTitle': 'मुख्य लर्निंग श्रेण्या'," },
  { search: /'home.itiCenters': 'ITI केंद्रे भागीदार',/g, replace: "'home.itiCenters': 'भागीदार शाळा'," },
  { search: /'home.curatedContentDesc': 'निमी आणि राष्ट्रीय ITI मानकांनुसार.',/g, replace: "'home.curatedContentDesc': 'राष्ट्रीय मानकांनुसार सामग्री.'," },
  { search: /'home.nimiTitle': 'निमी मॉक टेस्ट आणि भारत स्किल्स पोर्टल',/g, replace: "'home.nimiTitle': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट'," },
  { search: /'home.nimiMockTestApp': 'निमी मॉक टेस्ट ॲप',/g, replace: "'home.nimiMockTestApp': 'माइंडस्टिक्स भेट द्या'," },
  { search: /'home.visitBharatSkills': 'भारत स्किल्स भेट द्या',/g, replace: "'home.visitBharatSkills': 'आमचे उपक्रम'," },
  { search: /'contact.subtitle': 'ITI लर्निंग प्लॅटफॉर्म, सिलॅबस मॉड्यूल्स, किंवा तांत्रिक सहाय्याबद्दल प्रश्न आहेत\? आम्हाला संपर्क करा.',/g, replace: "'contact.subtitle': 'दहावी लर्निंग प्लॅटफॉर्म, सिलॅबस मॉड्यूल्स, किंवा तांत्रिक सहाय्याबद्दल प्रश्न आहेत? आम्हाला संपर्क करा.'," },
  { search: /'footer.aboutText': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट ही एक नोंदणीकृत ना-नफा संस्था आहे जी देशभरातील व्यावसायिक आणि ITI विद्यार्थ्यांसाठी उच्च दर्जाच्या तांत्रिक प्रशिक्षण संसाधनांची उपलब्धता वाढवण्यासाठी समर्पित आहे.',/g, replace: "'footer.aboutText': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट ही एक नोंदणीकृत ना-नफा संस्था आहे जी देशभरातील विद्यार्थ्यांसाठी उच्च दर्जाच्या तांत्रिक प्रशिक्षण संसाधनांची उपलब्धता वाढवण्यासाठी समर्पित आहे.'," },
]);

// 2. Update Navbar.jsx links
replaceInFile('src/components/Navbar.jsx', [
  { search: /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.nimi\.nimimocktest&hl=en&gl=US/g, replace: "https://mindstixfoundation.org/" },
  { search: /https:\/\/bharatskills\.gov\.in\//g, replace: "https://mindstixfoundation.org/" },
  { search: /<i className="bi bi-play-btn-fill text-success"><\/i>/g, replace: '<i className="bi bi-globe text-success"></i>' }, // Mock Test
  { search: /<i className="bi bi-journal-bookmark-fill text-info"><\/i>/g, replace: '<i className="bi bi-building text-info"></i>' }, // NIMI Portal
]);

// 3. Update Home.jsx links
replaceInFile('src/pages/Home.jsx', [
  { search: /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.nimi\.nimimocktest&hl=en&gl=US/g, replace: "https://mindstixfoundation.org/" },
  { search: /https:\/\/bharatskills\.gov\.in\//g, replace: "https://mindstixfoundation.org/" },
  { search: /<i className="bi bi-play-btn-fill"><\/i>/g, replace: '<i className="bi bi-globe"></i>' },
  { search: /<i className="bi bi-box-arrow-up-right"><\/i>/g, replace: '<i className="bi bi-building"></i>' }
]);

console.log('Redirects and text updates completed successfully.');
