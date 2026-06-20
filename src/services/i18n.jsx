import React, { createContext, useContext, useState, useCallback } from 'react';
import { csvTranslations } from './csvTranslations';

// ─── Translation Dictionaries ───────────────────────────────────────────
const translations = {
  // ═══════════════════════════════════════════════════════════════════════
  //  ENGLISH
  // ═══════════════════════════════════════════════════════════════════════
  en: {
    // ── Navbar ──
    'nav.digitalITI': 'Dasvi',
    'nav.learningPlatform': 'Learning Platform',
    'nav.searchPlaceholder': 'Search for lessons, trades, modules...',
    'nav.searchMobile': 'Search lessons...',
    'nav.feedback': 'Feedback',
    'nav.contact': 'Contact',
    'nav.mockTest': 'Mindstix Foundation',
    'nav.nimiPortal': 'Our Website',
    'nav.customCSV': 'Custom CSV',
    'nav.customCSVLoaded': 'Custom CSV Loaded',
    'nav.menuDirectory': 'MENU DIRECTORY',
    'nav.feedbackSurvey': 'Feedback Survey',
    'nav.contactMindstix': 'Contact Mindstix',

    // ── Hero Banner ──
    'hero.badge': 'MINDSTIX FOUNDATION TRUST',
    'hero.titlePrefix': 'Digital Empowerment for ',
    'hero.titleHighlight': 'School & Beyond',
    'hero.description': 'Discover a comprehensive library of premium, 100% free digital learning resources. Access video lectures for 9th, 10th, 12th standards, tech training, resume building, career roadmaps, and more in English, Hindi, and Marathi.',
    'hero.exploreCourses': 'Explore Courses',
    'hero.ourMission': 'Our Mission',
    'hero.continueLearning': 'Continue Learning',
    'hero.statVideos': 'Videos Imported',
    'hero.statTrades': 'Categories',
    'hero.statFree': 'Free Education',
    'hero.statOffline': 'Offline',
    'hero.statOfflineLabel': 'Video Downloads',

    // ── Language Popup ──
    'langPopup.title': 'Choose Your Language',
    'langPopup.subtitle': 'Select your preferred language for the platform',
    'langPopup.continue': 'Continue',
    'langPopup.english': 'English',
    'langPopup.hindi': 'हिंदी (Hindi)',
    'langPopup.marathi': 'मराठी (Marathi)',

    // ── Home ──
    'home.whatTrade': 'What do you want to learn today?',
    'home.searchResults': 'Search Results',
    'home.itemsFound': 'items found',
    'home.watchNow': 'Watch Now',
    'home.noLessonsMatch': 'No lessons match your query. Try searching "OSI", "Lathe", or "Earthing".',
    'home.coreTradesTitle': 'Learning Categories',
    'home.noTradesParsed': 'No categories parsed. Please upload a valid CSV syllabus to populate.',
    'home.digitalEducation': 'DIGITAL EDUCATION INITIATIVE',
    'home.visionImpact': 'Our Vision & Impact',
    'home.visionP1': 'Dasvi by Mindstix Foundation Trust provides a universal platform for 9th, 10th, and 12th standards in English, Hindi, and Marathi. We also offer specialized English grammar lessons in Marathi.',
    'home.visionP2': 'We integrate basic tech training like Word and Excel, career roadmaps, MCQs, and resume formatting videos, all free of cost to empower your growth.',
    'home.itiCenters': 'Schools Partnered',
    'home.worksheetsServed': 'Worksheets Served',
    'home.mobileFirst': 'Mobile First',
    'home.mobileFirstDesc': 'Optimized specifically for low-end Android phones.',
    'home.offlineReady': 'Offline Ready',
    'home.offlineReadyDesc': 'Dedicated MP4 video downloading options.',
    'home.lowBandwidth': 'Low Bandwidth',
    'home.lowBandwidthDesc': 'Lightweight static loading avoids hefty javascript.',
    'home.curatedContent': 'Curated Content',
    'home.curatedContentDesc': 'Curated content mapped to national standards.',
    'home.govResources': 'LEARNING RESOURCES',
    'home.nimiTitle': 'Mindstix Foundation Trust',
    'home.nimiDesc': 'Practice MCQs, build your resume, and explore career roadmaps for a successful future.',
    'home.nimiMockTestApp': 'Visit Mindstix',
    'home.visitBharatSkills': 'Our Initiatives',

    // ── Trade ──
    'trade.overview': 'CATEGORY OVERVIEW',
    'trade.chooseSemester': 'Choose a medium or program to access custom curriculum video packages, downloadable workbooks, and resource files.',
    'trade.selectYear': 'Select Medium / Program',
    'trade.noSemesters': 'No semesters found matching',
    'trade.tryDifferent': 'Try a different term.',

    // ── Modules ──
    'modules.title': 'Curriculum Syllabus Modules',
    'modules.description': 'Access specific chapters and lessons curated by Mindstix Foundation for deep hands-on learning.',
    'modules.noModules': 'No modules found matching',

    // ── Lessons ──
    'lessons.title': 'Video Lecture Lessons',
    'lessons.description': 'Watch high-quality visual demonstrations or download resources to your smartphone for offline learning.',
    'lessons.playVideo': 'Play Video',
    'lessons.test': 'Test',
    'lessons.noLessons': 'No video lessons found matching',

    // ── VideoPlayer ──
    'vp.lessonNotFound': 'Lesson Not Found',
    'vp.lessonNotFoundDesc': 'The video lesson may have been moved or parsing parameters have changed.',
    'vp.backToHome': 'Back to Home',
    'vp.noVideoEmbed': 'No video embed available',
    'vp.upNextInCourse': 'UP NEXT IN COURSE',
    'vp.playingIn': 'Playing in',
    'vp.playNow': 'Play Now',
    'vp.cancel': 'Cancel',
    'vp.courseComplete': 'COURSE COMPLETE',
    'vp.allModulesFinished': 'All Modules Finished!',
    'vp.courseCompleteDesc1': 'You have successfully watched all visual lectures inside',
    'vp.courseCompleteDesc2': 'Excellent achievement!',
    'vp.takeFinalAssessment': 'Take Final Assessment',
    'vp.keepReviewing': 'Keep Reviewing',
    'vp.lessonDescription': 'LESSON DESCRIPTION',
    'vp.noDescription': 'कोई पूर्ण ट्रांसक्रिप्ट या विवरण उपलब्ध नहीं है। वीडियो लेक्चर के साथ आगे बढ़ें और विवरण के लिए पूरक PDF वर्कशीट्स तथा प्रशिक्षण मैनुअल डाउनलोड करें।',
    'vp.moduleEvaluation': 'MODULE EVALUATION',
    'vp.assessmentAvailable': 'Assessment Available:',
    'vp.takeOfficialTest': 'Take the official online test curated for this module syllabus.',
    'vp.takeTest': 'Take Test',
    'vp.downloadVideo': 'Download Video',
    'vp.nextVideos': 'Next Videos',
    'vp.autoplay': 'AUTOPLAY',
    'vp.searchPlaylist': 'Search upcoming playlist...',
    'vp.noMatchingLessons': 'No matching lessons found in course.',
    'vp.currentModule': 'CURRENT MODULE:',
    'vp.playing': 'PLAYING',
    'vp.watchVisualDemo': 'Watch visual demonstration lecture',
    'vp.nextModule': 'NEXT MODULE:',
    'vp.prevModule': 'PREVIOUS MODULE:',
    'vp.moduleVideoSeq': 'Module Video Sequence',
    'vp.endOfCourse': 'End of Course Playlist',
    'vp.endOfCourseDesc1': 'You are playing the final video lecture.',
    'vp.endOfCourseDesc2': 'Hit "Take Test" to complete your assessment!',
    'vp.endOfCourseDesc3': 'Excellent job completing your course playlist!',
    'vp.moduleAssessment': 'Module Assessment',
    'vp.testEvaluation': 'Test Evaluation',
    'vp.openInNewTab': 'Open in New Tab',
    'vp.completeAllQuestions': 'Complete all questions before submitting',
    'vp.poweredByGF': 'Powered by Google Forms',
    'vp.enjoyedCourse': 'Enjoyed the course?',
    'vp.feedbackMsg1': 'We hope you enjoyed the visual lectures for',
    'vp.feedbackMsg2': 'of',
    'vp.feedbackMsg3': 'Would you like to share your feedback or take the module assessment now?',
    'vp.notNow': 'Not now',
    'vp.yesNow': 'Yes, now',

    // ── Contact ──
    'contact.backToHome': 'Back to Home',
    'contact.getInTouch': 'GET IN TOUCH',
    'contact.title': 'Contact Mindstix Foundation',
    'contact.subtitle': 'Have questions about the Dasvi Learning Platform, syllabus modules, or technical support? Feel free to reach out to us.',
    'contact.orgName': 'Mindstix Foundation Trust',
    'contact.officeAddress': 'Office Address',
    'contact.address': '604, Block A, Ashar Belleza, Road No. 16, Waghle Estate, Thane (W): 400604, Maharashtra, India.',
    'contact.emailInquiries': 'Email Inquiries',
    'contact.officialWebsite': 'Official Website',
    'contact.sendMessage': 'Send Us a Message',
    'contact.messageReceived': 'Message Received!',
    'contact.thankYou': 'Thank you for your feedback. We will get back to you shortly.',
    'contact.yourName': 'Your Name',
    'contact.emailAddress': 'Email Address',
    'contact.subjectTopic': 'Subject Topic',
    'contact.howCanWeHelp': 'How can we help you?',
    'contact.sendBtn': 'Send Message →',
    'contact.close': 'Close',
    'contact.showPopup': 'Show Popup',

    // ── Footer ──
    'footer.orgName': 'Mindstix Foundation Trust',
    'footer.aboutText': 'Mindstix Foundation Trust is a registered non-profit organization dedicated to expanding access to top-tier technical training resources for students across the nation.',
    'footer.contactOffice': 'Contact NPO Office',
    'footer.copyright': '© {year} Mindstix Foundation Trust. All rights reserved. | Dasvi Platform is a free public vocational education project.',

    // ── TradeCard ──
    'tradeCard.modules': 'Modules',
    'tradeCard.module': 'Module',
    'tradeCard.lectures': 'Lectures',
    'tradeCard.lecture': 'Lecture',
    'tradeCard.mods': 'Mods',
    'tradeCard.mod': 'Mod',
    'tradeCard.lecs': 'Lecs',
    'tradeCard.lec': 'Lec',
    'tradeCard.desc.class 9': 'Foundational lessons for 9th Standard students. Includes Mathematics, Science, and English Grammar.',
    'tradeCard.desc.class 10': 'Core subjects for 10th Standard. Prepare for board exams with Maths, Science, and English.',
    'tradeCard.desc.class 12': 'Advanced topics for 12th Standard students including Physics, Mathematics, and language skills.',
    'tradeCard.desc.skill development': 'Tech training and growth programs including MS Word, Excel, and introductory programming.',
    'tradeCard.desc.career guidance': 'Career roadmap, resume building, MCQs, and interview preparation for future success.',
    
    
    
    'tradeCard.desc.default': 'Comprehensive educational resources and lessons.',

    // ── ModuleCard ──
    'moduleCard.description': 'Comprehensive video lectures, worksheets, notes and digital study assets',
    'moduleCard.videos': 'Videos',
    'moduleCard.video': 'Video',
    'moduleCard.takeTest': 'Take Test',

    // ── LessonCard ──
    'lessonCard.playVideo': 'Play Video',
    'lessonCard.test': 'Test',

    // ── SemesterCard ──
    'semesterCard.description': 'Standard curricular modules, theory explanations, and practical guidebooks.',
    'semesterCard.modules': 'Modules',
    'semesterCard.videoLessons': 'Video Lessons',

    // ── Breadcrumb ──
    'breadcrumb.back': 'Back',
    'breadcrumb.home': 'Home',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  HINDI
  // ═══════════════════════════════════════════════════════════════════════
  hi: {
    // ── Navbar ──
    'nav.digitalITI': 'Dasvi',
    'nav.learningPlatform': 'लर्निंग प्लेटफ़ॉर्म',
    'nav.searchPlaceholder': 'पाठ, ट्रेड, मॉड्यूल खोजें...',
    'nav.searchMobile': 'पाठ खोजें...',
    'nav.feedback': 'फीडबैक',
    'nav.contact': 'संपर्क',
    'nav.mockTest': 'माइंडस्टिक्स फाउंडेशन',
    'nav.nimiPortal': 'हमारी वेबसाइट',
    'nav.customCSV': 'कस्टम CSV',
    'nav.customCSVLoaded': 'कस्टम CSV लोडेड',
    'nav.menuDirectory': 'मेनू',
    'nav.feedbackSurvey': 'फीडबैक सर्वे',
    'nav.contactMindstix': 'माइंडस्टिक्स से संपर्क',

    // ── Hero Banner ──
    'hero.badge': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'hero.titlePrefix': 'दसवीं प्लेटफार्म के लिए ',
    'hero.titleHighlight': 'School & Beyond',
    'hero.description': 'Discover a comprehensive library of premium, 100% free digital learning resources. Access video lectures for 9th, 10th, 12th standards, tech training, resume building, career roadmaps, and more in English, Hindi, and Marathi.',
    'hero.exploreCourses': 'कोर्स देखें',
    'hero.ourMission': 'हमारा मिशन',
    'hero.statVideos': 'वीडियो आयातित',
    'hero.statTrades': 'लर्निंग पाथ्स',
    'hero.statFree': 'मुफ्त शिक्षा',
    'hero.statOffline': 'ऑफ़लाइन',
    'hero.statOfflineLabel': 'वीडियो डाउनलोड',

    // ── Language Popup ──
    'langPopup.title': 'अपनी भाषा चुनें',
    'langPopup.subtitle': 'प्लेटफ़ॉर्म के लिए अपनी पसंदीदा भाषा चुनें',
    'langPopup.continue': 'जारी रखें',
    'langPopup.english': 'English',
    'langPopup.hindi': 'हिंदी (Hindi)',
    'langPopup.marathi': 'मराठी (Marathi)',

    // ── Home ──
    'home.whatTrade': 'आज आप कौन सा ट्रेड सीखना चाहते हैं?',
    'home.searchResults': 'खोज परिणाम',
    'home.itemsFound': 'परिणाम मिले',
    'home.watchNow': 'अभी देखें',
    'home.noLessonsMatch': 'कोई पाठ मेल नहीं खाता। "OSI", "Lathe", या "Earthing" खोजने का प्रयास करें।',
    'home.coreTradesTitle': 'मुख्य लर्निंग श्रेणियां',
    'home.noTradesParsed': 'कोई ट्रेड नहीं मिला। कृपया एक वैध CSV सिलेबस अपलोड करें।',
    'home.digitalEducation': 'डिजिटल शिक्षा पहल',
    'home.visionImpact': 'हमारी दृष्टि और प्रभाव',
    'home.visionP1': 'Dasvi by Mindstix Foundation Trust provides a universal platform for 9th, 10th, and 12th standards in English, Hindi, and Marathi. We also offer specialized English grammar lessons in Marathi.',
    'home.visionP2': 'We integrate basic tech training like Word and Excel, career roadmaps, MCQs, and resume formatting videos, all free of cost to empower your growth.',
    'home.itiCenters': 'भागीदार स्कूल',
    'home.worksheetsServed': 'वर्कशीट वितरित',
    'home.mobileFirst': 'मोबाइल फर्स्ट',
    'home.mobileFirstDesc': 'कम क्षमता वाले एंड्रॉइड फोन के लिए अनुकूलित।',
    'home.offlineReady': 'ऑफ़लाइन तैयार',
    'home.offlineReadyDesc': 'MP4 वीडियो डाउनलोड के विकल्प उपलब्ध।',
    'home.lowBandwidth': 'कम बैंडविड्थ',
    'home.lowBandwidthDesc': 'हल्की स्टैटिक लोडिंग, कम जावास्क्रिप्ट।',
    'home.curatedContent': 'क्यूरेटेड कंटेंट',
    'home.curatedContentDesc': 'राष्ट्रीय मानकों के अनुसार सामग्री।',
    'home.govResources': 'शिक्षण संसाधन',
    'home.nimiTitle': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'home.nimiDesc': 'Practice MCQs, build your resume, and explore career roadmaps for a successful future.',
    'home.nimiMockTestApp': 'माइंडस्टिक्स विजिट करें',
    'home.visitBharatSkills': 'हमारी पहल',

    // ── Trade ──
    'trade.overview': 'ट्रेड अवलोकन',
    'trade.chooseSemester': 'कस्टम पाठ्यक्रम वीडियो पैकेज, डाउनलोड करने योग्य वर्कबुक और संसाधन फ़ाइलों तक पहुँचने के लिए एक सेमेस्टर चुनें।',
    'trade.selectYear': 'वर्ष / सेमेस्टर चुनें',
    'trade.noSemesters': 'कोई सेमेस्टर नहीं मिला',
    'trade.tryDifferent': 'एक अलग शब्द आज़माएं।',

    // ── Modules ──
    'modules.title': 'पाठ्यक्रम सिलेबस मॉड्यूल',
    'modules.description': 'माइंडस्टिक्स फाउंडेशन द्वारा गहन प्रशिक्षण के लिए तैयार किए गए विशिष्ट अध्याय और पाठ एक्सेस करें।',
    'modules.noModules': 'कोई मॉड्यूल नहीं मिला',

    // ── Lessons ──
    'lessons.title': 'वीडियो लेक्चर पाठ',
    'lessons.description': 'उच्च गुणवत्ता वाले विजुअल डेमो देखें या ऑफ़लाइन सीखने के लिए अपने स्मार्टफ़ोन में संसाधन डाउनलोड करें।',
    'lessons.playVideo': 'वीडियो चलाएं',
    'lessons.test': 'टेस्ट',
    'lessons.noLessons': 'कोई वीडियो पाठ नहीं मिला',

    // ── VideoPlayer ──
    'vp.lessonNotFound': 'पाठ नहीं मिला',
    'vp.lessonNotFoundDesc': 'वीडियो पाठ स्थानांतरित हो गया है या पार्सिंग पैरामीटर बदल गए हैं।',
    'vp.backToHome': 'होम पर वापस जाएं',
    'vp.noVideoEmbed': 'कोई वीडियो उपलब्ध नहीं',
    'vp.upNextInCourse': 'कोर्स में आगे',
    'vp.playingIn': 'चल रहा है',
    'vp.playNow': 'अभी चलाएं',
    'vp.cancel': 'रद्द करें',
    'vp.courseComplete': 'कोर्स पूरा',
    'vp.allModulesFinished': 'सभी मॉड्यूल पूरे हुए!',
    'vp.courseCompleteDesc1': 'आपने सभी विजुअल लेक्चर सफलतापूर्वक देख लिए हैं',
    'vp.courseCompleteDesc2': 'उत्कृष्ट उपलब्धि!',
    'vp.takeFinalAssessment': 'अंतिम मूल्यांकन दें',
    'vp.keepReviewing': 'समीक्षा जारी रखें',
    'vp.lessonDescription': 'पाठ विवरण',
    'vp.noDescription': 'कोई पूर्ण विवरण उपलब्ध नहीं है। वीडियो लेक्चर देखें और पूरक PDF वर्कशीट और प्रशिक्षण मैनुअल डाउनलोड करें।',
    'vp.moduleEvaluation': 'मॉड्यूल मूल्यांकन',
    'vp.assessmentAvailable': 'मूल्यांकन उपलब्ध:',
    'vp.takeOfficialTest': 'इस मॉड्यूल सिलेबस के लिए तैयार किया गया आधिकारिक ऑनलाइन टेस्ट दें।',
    'vp.takeTest': 'टेस्ट दें',
    'vp.downloadVideo': 'वीडियो डाउनलोड',
    'vp.nextVideos': 'अगले वीडियो',
    'vp.autoplay': 'ऑटोप्ले',
    'vp.searchPlaylist': 'प्लेलिस्ट में खोजें...',
    'vp.noMatchingLessons': 'कोर्स में कोई मेल खाने वाला पाठ नहीं मिला।',
    'vp.currentModule': 'वर्तमान मॉड्यूल:',
    'vp.playing': 'चल रहा है',
    'vp.watchVisualDemo': 'विजुअल डेमो लेक्चर देखें',
    'vp.nextModule': 'अगला मॉड्यूल:',
    'vp.prevModule': 'पिछला मॉड्यूल:',
    'vp.moduleVideoSeq': 'मॉड्यूल वीडियो क्रम',
    'vp.endOfCourse': 'कोर्स प्लेलिस्ट समाप्त',
    'vp.endOfCourseDesc1': 'आप अंतिम वीडियो लेक्चर देख रहे हैं।',
    'vp.endOfCourseDesc2': 'अपना मूल्यांकन पूरा करने के लिए "टेस्ट दें" पर क्लिक करें!',
    'vp.endOfCourseDesc3': 'आपका कोर्स पूरा होने पर बधाई!',
    'vp.moduleAssessment': 'मॉड्यूल मूल्यांकन',
    'vp.testEvaluation': 'टेस्ट मूल्यांकन',
    'vp.openInNewTab': 'नई टैब में खोलें',
    'vp.completeAllQuestions': 'सबमिट करने से पहले सभी प्रश्न पूरे करें',
    'vp.poweredByGF': 'Google Forms द्वारा संचालित',
    'vp.enjoyedCourse': 'कोर्स पसंद आया?',
    'vp.feedbackMsg1': 'हमें आशा है कि आपने',
    'vp.feedbackMsg2': 'के',
    'vp.feedbackMsg3': 'विजुअल लेक्चर पसंद किए। क्या आप अपनी प्रतिक्रिया साझा करना चाहेंगे?',
    'vp.notNow': 'अभी नहीं',
    'vp.yesNow': 'हाँ, अभी',

    // ── Contact ──
    'contact.backToHome': 'होम पर वापस',
    'contact.getInTouch': 'संपर्क करें',
    'contact.title': 'माइंडस्टिक्स फाउंडेशन से संपर्क',
    'contact.subtitle': 'दसवीं लर्निंग प्लेटफ़ॉर्म, सिलेबस मॉड्यूल, या तकनीकी सहायता के बारे में प्रश्न हैं? बेझिझक हमसे संपर्क करें।',
    'contact.orgName': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'contact.officeAddress': 'कार्यालय पता',
    'contact.address': '604, ब्लॉक A, अशर बेलेज़ा, रोड नं. 16, वाघले एस्टेट, ठाणे (पश्चिम): 400604, महाराष्ट्र, भारत।',
    'contact.emailInquiries': 'ईमेल पूछताछ',
    'contact.officialWebsite': 'आधिकारिक वेबसाइट',
    'contact.sendMessage': 'हमें संदेश भेजें',
    'contact.messageReceived': 'संदेश प्राप्त!',
    'contact.thankYou': 'आपकी प्रतिक्रिया के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।',
    'contact.yourName': 'आपका नाम',
    'contact.emailAddress': 'ईमेल पता',
    'contact.subjectTopic': 'विषय',
    'contact.howCanWeHelp': 'हम आपकी कैसे मदद कर सकते हैं?',
    'contact.sendBtn': 'संदेश भेजें →',
    'contact.close': 'बंद करें',
    'contact.showPopup': 'पॉपअप दिखाएं',

    // ── Footer ──
    'footer.orgName': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'footer.aboutText': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट एक पंजीकृत गैर-लाभकारी संगठन है जो देश भर में छात्रों के लिए उच्च-स्तरीय तकनीकी प्रशिक्षण संसाधनों तक पहुँच बढ़ाने के लिए समर्पित है।',
    'footer.contactOffice': 'NGO कार्यालय संपर्क',
    'footer.copyright': '© {year} माइंडस्टिक्स फाउंडेशन ट्रस्ट। सर्वाधिकार सुरक्षित। | Dasvi Platform एक मुफ्त सार्वजनिक व्यावसायिक शिक्षा परियोजना है।',

    // ── TradeCard ──
    'tradeCard.modules': 'मॉड्यूल',
    'tradeCard.module': 'मॉड्यूल',
    'tradeCard.lectures': 'लेक्चर',
    'tradeCard.lecture': 'लेक्चर',
    'tradeCard.mods': 'मॉड',
    'tradeCard.mod': 'मॉड',
    'tradeCard.lecs': 'लेक',
    'tradeCard.lec': 'लेक',
    'tradeCard.desc.class 9': 'Foundational lessons for 9th Standard students. Includes Mathematics, Science, and English Grammar.',
    'tradeCard.desc.class 10': 'Core subjects for 10th Standard. Prepare for board exams with Maths, Science, and English.',
    'tradeCard.desc.class 12': 'Advanced topics for 12th Standard students including Physics, Mathematics, and language skills.',
    'tradeCard.desc.skill development': 'Tech training and growth programs including MS Word, Excel, and introductory programming.',
    'tradeCard.desc.career guidance': 'Career roadmap, resume building, MCQs, and interview preparation for future success.',
    
    
    
    'tradeCard.desc.default': 'Comprehensive educational resources and lessons.',

    // ── ModuleCard ──
    'moduleCard.description': 'व्यापक वीडियो लेक्चर, वर्कशीट, नोट्स और डिजिटल अध्ययन संसाधन',
    'moduleCard.videos': 'वीडियो',
    'moduleCard.video': 'वीडियो',
    'moduleCard.takeTest': 'टेस्ट दें',

    // ── LessonCard ──
    'lessonCard.playVideo': 'वीडियो चलाएं',
    'lessonCard.test': 'टेस्ट',

    // ── SemesterCard ──
    'semesterCard.description': 'मानक पाठ्यक्रम मॉड्यूल, सिद्धांत व्याख्या, और व्यावहारिक गाइडबुक।',
    'semesterCard.modules': 'मॉड्यूल',
    'semesterCard.videoLessons': 'वीडियो पाठ',

    // ── Breadcrumb ──
    'breadcrumb.back': 'वापस',
    'breadcrumb.home': 'होम',
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  MARATHI
  // ═══════════════════════════════════════════════════════════════════════
  mr: {
    // ── Navbar ──
    'nav.digitalITI': 'Dasvi',
    'nav.learningPlatform': 'लर्निंग प्लॅटफॉर्म',
    'nav.searchPlaceholder': 'धडे, ट्रेड, मॉड्यूल शोधा...',
    'nav.searchMobile': 'धडे शोधा...',
    'nav.feedback': 'अभिप्राय',
    'nav.contact': 'संपर्क',
    'nav.mockTest': 'माइंडस्टिक्स फाउंडेशन',
    'nav.nimiPortal': 'हमारी वेबसाइट',
    'nav.customCSV': 'कस्टम CSV',
    'nav.customCSVLoaded': 'कस्टम CSV लोड झाले',
    'nav.menuDirectory': 'मेनू',
    'nav.feedbackSurvey': 'अभिप्राय सर्वे',
    'nav.contactMindstix': 'माइंडस्टिक्सशी संपर्क',

    // ── Hero Banner ──
    'hero.badge': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'hero.titlePrefix': 'दहावी प्लॅटफॉर्मसाठी ',
    'hero.titleHighlight': 'School & Beyond',
    'hero.description': 'Discover a comprehensive library of premium, 100% free digital learning resources. Access video lectures for 9th, 10th, 12th standards, tech training, resume building, career roadmaps, and more in English, Hindi, and Marathi.',
    'hero.exploreCourses': 'कोर्सेस पहा',
    'hero.ourMission': 'आमचे ध्येय',
    'hero.statVideos': 'व्हिडिओ आयात',
    'hero.statTrades': 'लर्निंग पाथ्स',
    'hero.statFree': 'मोफत शिक्षण',
    'hero.statOffline': 'ऑफलाइन',
    'hero.statOfflineLabel': 'व्हिडिओ डाउनलोड',

    // ── Language Popup ──
    'langPopup.title': 'तुमची भाषा निवडा',
    'langPopup.subtitle': 'प्लॅटफॉर्मसाठी तुमची पसंतीची भाषा निवडा',
    'langPopup.continue': 'पुढे जा',
    'langPopup.english': 'English',
    'langPopup.hindi': 'हिंदी (Hindi)',
    'langPopup.marathi': 'मराठी (Marathi)',

    // ── Home ──
    'home.whatTrade': 'आज तुम्हाला कोणता ट्रेड शिकायचा आहे?',
    'home.searchResults': 'शोध निकाल',
    'home.itemsFound': 'निकाल सापडले',
    'home.watchNow': 'आता पहा',
    'home.noLessonsMatch': 'कोणताही धडा जुळत नाही. "OSI", "Lathe", किंवा "Earthing" शोधण्याचा प्रयत्न करा.',
    'home.coreTradesTitle': 'मुख्य लर्निंग श्रेण्या',
    'home.noTradesParsed': 'कोणतेही ट्रेड सापडले नाहीत. कृपया वैध CSV सिलॅबस अपलोड करा.',
    'home.digitalEducation': 'डिजिटल शिक्षण उपक्रम',
    'home.visionImpact': 'आमची दृष्टी आणि प्रभाव',
    'home.visionP1': 'Dasvi by Mindstix Foundation Trust provides a universal platform for 9th, 10th, and 12th standards in English, Hindi, and Marathi. We also offer specialized English grammar lessons in Marathi.',
    'home.visionP2': 'We integrate basic tech training like Word and Excel, career roadmaps, MCQs, and resume formatting videos, all free of cost to empower your growth.',
    'home.itiCenters': 'भागीदार शाळा',
    'home.worksheetsServed': 'वर्कशीट्स वितरित',
    'home.mobileFirst': 'मोबाइल फर्स्ट',
    'home.mobileFirstDesc': 'कमी क्षमतेच्या अँड्रॉइड फोनसाठी अनुकूलित.',
    'home.offlineReady': 'ऑफलाइन तयार',
    'home.offlineReadyDesc': 'समर्पित MP4 व्हिडिओ डाउनलोड पर्याय.',
    'home.lowBandwidth': 'कमी बँडविड्थ',
    'home.lowBandwidthDesc': 'हलके स्टॅटिक लोडिंग, कमी जावास्क्रिप्ट.',
    'home.curatedContent': 'क्युरेटेड कंटेंट',
    'home.curatedContentDesc': 'राष्ट्रीय मानकांनुसार सामग्री.',
    'home.govResources': 'शिक्षण संसाधने',
    'home.nimiTitle': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'home.nimiDesc': 'Practice MCQs, build your resume, and explore career roadmaps for a successful future.',
    'home.nimiMockTestApp': 'माइंडस्टिक्स भेट द्या',
    'home.visitBharatSkills': 'आमचे उपक्रम',

    // ── Trade ──
    'trade.overview': 'ट्रेड आढावा',
    'trade.chooseSemester': 'कस्टम अभ्यासक्रम व्हिडिओ पॅकेजेस, डाउनलोड करण्यायोग्य वर्कबुक्स आणि संसाधन फाइल्स ऍक्सेस करण्यासाठी सेमिस्टर निवडा.',
    'trade.selectYear': 'वर्ष / सेमिस्टर निवडा',
    'trade.noSemesters': 'कोणताही सेमिस्टर सापडला नाही',
    'trade.tryDifferent': 'वेगळा शब्द वापरा.',

    // ── Modules ──
    'modules.title': 'अभ्यासक्रम सिलॅबस मॉड्यूल्स',
    'modules.description': 'माइंडस्टिक्स फाउंडेशनने सखोल प्रशिक्षणासाठी तयार केलेले विशिष्ट अध्याय आणि धडे ऍक्सेस करा.',
    'modules.noModules': 'कोणताही मॉड्यूल सापडला नाही',

    // ── Lessons ──
    'lessons.title': 'व्हिडिओ लेक्चर धडे',
    'lessons.description': 'उच्च दर्जाचे व्हिज्युअल डेमो पहा किंवा ऑफलाइन शिक्षणासाठी तुमच्या स्मार्टफोनवर संसाधने डाउनलोड करा.',
    'lessons.playVideo': 'व्हिडिओ प्ले करा',
    'lessons.test': 'टेस्ट',
    'lessons.noLessons': 'कोणताही व्हिडिओ धडा सापडला नाही',

    // ── VideoPlayer ──
    'vp.lessonNotFound': 'धडा सापडला नाही',
    'vp.lessonNotFoundDesc': 'व्हिडिओ धडा हलवला गेला असावा किंवा पार्सिंग पॅरामीटर्स बदलले आहेत.',
    'vp.backToHome': 'होमवर परत जा',
    'vp.noVideoEmbed': 'कोणताही व्हिडिओ उपलब्ध नाही',
    'vp.upNextInCourse': 'कोर्समध्ये पुढे',
    'vp.playingIn': 'सुरू होत आहे',
    'vp.playNow': 'आता प्ले करा',
    'vp.cancel': 'रद्द करा',
    'vp.courseComplete': 'कोर्स पूर्ण',
    'vp.allModulesFinished': 'सर्व मॉड्यूल्स पूर्ण!',
    'vp.courseCompleteDesc1': 'तुम्ही सर्व व्हिज्युअल लेक्चर्स यशस्वीरित्या पाहिले आहेत',
    'vp.courseCompleteDesc2': 'उत्कृष्ट कामगिरी!',
    'vp.takeFinalAssessment': 'अंतिम मूल्यांकन द्या',
    'vp.keepReviewing': 'पुनरावलोकन सुरू ठेवा',
    'vp.lessonDescription': 'धडा वर्णन',
    'vp.noDescription': 'पूर्ण ट्रांस्क्रिप्ट किंवा वर्णन उपलब्ध नाही. व्हिडिओ लेक्चरच्या बरोबरीने पुढे जा आणि अधिक माहितीसाठी पूरक PDF वर्कशीट्स व प्रशिक्षण मॅन्युअल डाउनलोड करा.',
    'vp.moduleEvaluation': 'मॉड्यूल मूल्यांकन',
    'vp.assessmentAvailable': 'मूल्यांकन उपलब्ध:',
    'vp.takeOfficialTest': 'या मॉड्यूल सिलॅबससाठी तयार केलेली अधिकृत ऑनलाइन टेस्ट द्या.',
    'vp.takeTest': 'टेस्ट द्या',
    'vp.downloadVideo': 'व्हिडिओ डाउनलोड',
    'vp.nextVideos': 'पुढचे व्हिडिओ',
    'vp.autoplay': 'ऑटोप्ले',
    'vp.searchPlaylist': 'प्लेलिस्टमध्ये शोधा...',
    'vp.noMatchingLessons': 'कोर्समध्ये कोणताही जुळणारा धडा सापडला नाही.',
    'vp.currentModule': 'सध्याचा मॉड्यूल:',
    'vp.playing': 'सुरू आहे',
    'vp.watchVisualDemo': 'व्हिज्युअल डेमो लेक्चर पहा',
    'vp.nextModule': 'पुढचा मॉड्यूल:',
    'vp.prevModule': 'मागचा मॉड्यूल:',
    'vp.moduleVideoSeq': 'मॉड्यूल व्हिडिओ क्रम',
    'vp.endOfCourse': 'कोर्स प्लेलिस्ट संपली',
    'vp.endOfCourseDesc1': 'तुम्ही शेवटचा व्हिडिओ लेक्चर पाहत आहात.',
    'vp.endOfCourseDesc2': 'तुमचे मूल्यांकन पूर्ण करण्यासाठी "टेस्ट द्या" वर क्लिक करा!',
    'vp.endOfCourseDesc3': 'तुमची कोर्स प्लेलिस्ट पूर्ण केल्याबद्दल अभिनंदन!',
    'vp.moduleAssessment': 'मॉड्यूल मूल्यांकन',
    'vp.testEvaluation': 'टेस्ट मूल्यांकन',
    'vp.openInNewTab': 'नवीन टॅबमध्ये उघडा',
    'vp.completeAllQuestions': 'सबमिट करण्यापूर्वी सर्व प्रश्न पूर्ण करा',
    'vp.poweredByGF': 'Google Forms द्वारे चालवले',
    'vp.enjoyedCourse': 'कोर्स आवडला?',
    'vp.feedbackMsg1': 'आम्हाला आशा आहे तुम्हाला',
    'vp.feedbackMsg2': 'चे',
    'vp.feedbackMsg3': 'व्हिज्युअल लेक्चर्स आवडले. तुम्ही तुमचा अभिप्राय सामायिक करू इच्छिता?',
    'vp.notNow': 'आता नाही',
    'vp.yesNow': 'होय, आता',

    // ── Contact ──
    'contact.backToHome': 'होमवर परत',
    'contact.getInTouch': 'संपर्क साधा',
    'contact.title': 'माइंडस्टिक्स फाउंडेशनशी संपर्क',
    'contact.subtitle': 'दहावी लर्निंग प्लॅटफॉर्म, सिलॅबस मॉड्यूल्स, किंवा तांत्रिक सहाय्याबद्दल प्रश्न आहेत? आम्हाला संपर्क करा.',
    'contact.orgName': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'contact.officeAddress': 'कार्यालय पत्ता',
    'contact.address': '604, ब्लॉक A, अशर बेलेझा, रोड नं. 16, वाघले इस्टेट, ठाणे (पश्चिम): 400604, महाराष्ट्र, भारत.',
    'contact.emailInquiries': 'ईमेल चौकशी',
    'contact.officialWebsite': 'अधिकृत वेबसाइट',
    'contact.sendMessage': 'आम्हाला संदेश पाठवा',
    'contact.messageReceived': 'संदेश प्राप्त!',
    'contact.thankYou': 'तुमच्या अभिप्रायाबद्दल धन्यवाद. आम्ही लवकरच तुमच्याशी संपर्क करू.',
    'contact.yourName': 'तुमचे नाव',
    'contact.emailAddress': 'ईमेल पत्ता',
    'contact.subjectTopic': 'विषय',
    'contact.howCanWeHelp': 'आम्ही तुम्हाला कशी मदत करू शकतो?',
    'contact.sendBtn': 'संदेश पाठवा →',
    'contact.close': 'बंद करा',
    'contact.showPopup': 'पॉपअप दाखवा',

    // ── Footer ──
    'footer.orgName': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट',
    'footer.aboutText': 'माइंडस्टिक्स फाउंडेशन ट्रस्ट ही एक नोंदणीकृत ना-नफा संस्था आहे जी देशभरातील विद्यार्थ्यांसाठी उच्च दर्जाच्या तांत्रिक प्रशिक्षण संसाधनांची उपलब्धता वाढवण्यासाठी समर्पित आहे.',
    'footer.contactOffice': 'NGO कार्यालय संपर्क',
    'footer.copyright': '© {year} माइंडस्टिक्स फाउंडेशन ट्रस्ट. सर्व हक्क राखीव. | Dasvi Platform ही एक मोफत सार्वजनिक व्यावसायिक शिक्षण योजना आहे.',

    // ── TradeCard ──
    'tradeCard.modules': 'मॉड्यूल्स',
    'tradeCard.module': 'मॉड्यूल',
    'tradeCard.lectures': 'लेक्चर्स',
    'tradeCard.lecture': 'लेक्चर',
    'tradeCard.mods': 'मॉड',
    'tradeCard.mod': 'मॉड',
    'tradeCard.lecs': 'लेक',
    'tradeCard.lec': 'लेक',
    'tradeCard.desc.class 9': 'Foundational lessons for 9th Standard students. Includes Mathematics, Science, and English Grammar.',
    'tradeCard.desc.class 10': 'Core subjects for 10th Standard. Prepare for board exams with Maths, Science, and English.',
    'tradeCard.desc.class 12': 'Advanced topics for 12th Standard students including Physics, Mathematics, and language skills.',
    'tradeCard.desc.skill development': 'Tech training and growth programs including MS Word, Excel, and introductory programming.',
    'tradeCard.desc.career guidance': 'Career roadmap, resume building, MCQs, and interview preparation for future success.',
    
    
    
    'tradeCard.desc.default': 'Comprehensive educational resources and lessons.',

    // ── ModuleCard ──
    'moduleCard.description': 'सर्वसमावेशक व्हिडिओ लेक्चर्स, वर्कशीट्स, नोट्स आणि डिजिटल अभ्यास संसाधने',
    'moduleCard.videos': 'व्हिडिओज',
    'moduleCard.video': 'व्हिडिओ',
    'moduleCard.takeTest': 'टेस्ट द्या',

    // ── LessonCard ──
    'lessonCard.playVideo': 'व्हिडिओ प्ले करा',
    'lessonCard.test': 'टेस्ट',

    // ── SemesterCard ──
    'semesterCard.description': 'मानक अभ्यासक्रम मॉड्यूल्स, सिद्धांत स्पष्टीकरण, आणि प्रॅक्टिकल गाइडबुक्स.',
    'semesterCard.modules': 'मॉड्यूल्स',
    'semesterCard.videoLessons': 'व्हिडिओ धडे',

    // ── Breadcrumb ──
    'breadcrumb.back': 'मागे',
    'breadcrumb.home': 'होम',
  },
};

// ─── Language Context ───────────────────────────────────────────────────
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('iti_language');
    return saved || 'en';
  });

  const [hasChosenLanguage, setHasChosenLanguage] = useState(() => {
    return localStorage.getItem('iti_language') !== null;
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('iti_language', lang);
    setHasChosenLanguage(true);
  }, []);

  const t = useCallback((key, replacements = {}) => {
    let text = translations[language]?.[key] || csvTranslations[language]?.[key] || translations.en[key] || key;
    // Simple template replacement: {year} → 2026
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    // Preserve ASCII acronyms: replace common Devanagari transliterations
    const acronymMap = {
      'आईसीटीएसएम': 'ICTSM',
      'एमएमवी': 'MMV'
    };
    Object.entries(acronymMap).forEach(([dev, ascii]) => {
      if (text.includes(dev)) {
        text = text.split(dev).join(ascii);
      }
    });
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, hasChosenLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default translations;
