const fs = require('fs');

const lessons = [];

function addLesson(category, medium, subject, title, desc, link, form, pdf = '') {
  lessons.push([
    '', // Playlist ID
    category,
    medium,
    subject,
    title,
    desc,
    link,
    form,
    pdf,
    '' // youtube_download_link
  ].map(s => String(s).replace(/\|/g, '').replace(/\n/g, ' ')).join('|'));
}

const header = "Playlist ID|Trade|Year|Module|Title|Description|Youtube video link|Google Forms|pdf_drive_id|youtube_download_link";
lessons.push(header);

// 9th Standard
['English', 'Hindi', 'Marathi'].forEach(lang => {
  addLesson('Class 9', `${lang} Medium`, 'Mathematics', `Algebra Basics (${lang})`, 'Learn basic algebra concepts.', 'v=3C_l_pQ12F0', 'https://forms.gle/sample');
  addLesson('Class 9', `${lang} Medium`, 'Science', `Physics Intro (${lang})`, 'Introduction to physics and motion.', 'v=d3zcwGgQf3c', 'https://forms.gle/sample');
  addLesson('Class 9', `${lang} Medium`, 'Science', `Worksheet & Summary (${lang})`, 'Free summarized worksheet for Science Class 9.', 'v=d3zcwGgQf3c', 'https://forms.gle/sample', 'sample_pdf_id_9sci');
});

// 10th Standard
['English', 'Hindi', 'Marathi'].forEach(lang => {
  addLesson('Class 10', `${lang} Medium`, 'Mathematics', `Geometry Basics (${lang})`, 'Learn basic geometry concepts.', 'v=3C_l_pQ12F0', 'https://forms.gle/sample');
  addLesson('Class 10', `${lang} Medium`, 'Science', `Chemistry Intro (${lang})`, 'Introduction to chemistry and atoms.', 'v=d3zcwGgQf3c', 'https://forms.gle/sample');
  addLesson('Class 10', `${lang} Medium`, 'Science', `Worksheet & Summary (${lang})`, 'Free summarized worksheet for Science Class 10.', 'v=d3zcwGgQf3c', 'https://forms.gle/sample', 'sample_pdf_id_10sci');
});

// 12th Standard
['English', 'Hindi', 'Marathi'].forEach(lang => {
  addLesson('Class 12', `${lang} Medium`, 'Physics', `Electromagnetism (${lang})`, 'Advanced physics concepts.', 'v=3C_l_pQ12F0', 'https://forms.gle/sample');
  addLesson('Class 12', `${lang} Medium`, 'Mathematics', `Calculus Intro (${lang})`, 'Introduction to limits and derivatives.', 'v=d3zcwGgQf3c', 'https://forms.gle/sample');
  addLesson('Class 12', `${lang} Medium`, 'Physics', `Worksheet & Summary (${lang})`, 'Free summarized worksheet for Physics Class 12.', 'v=d3zcwGgQf3c', 'https://forms.gle/sample', 'sample_pdf_id_12phy');
});

// English Grammar in Marathi
addLesson('Class 9', 'Marathi Medium', 'English Grammar', 'Tenses Explained in Marathi', 'English grammar lesson which will be in the language of Marathi.', 'v=b_mK98Q2Kgk', 'https://forms.gle/sample');
addLesson('Class 10', 'Marathi Medium', 'English Grammar', 'Tenses Explained in Marathi', 'English grammar lesson which will be in the language of Marathi.', 'v=b_mK98Q2Kgk', 'https://forms.gle/sample');
addLesson('Class 12', 'Marathi Medium', 'English Grammar', 'Tenses Explained in Marathi', 'English grammar lesson which will be in the language of Marathi.', 'v=b_mK98Q2Kgk', 'https://forms.gle/sample');

// Skill Development
addLesson('Skill Development', 'Tech Training', 'Microsoft Word', 'Word Basics', 'Basic tech training in MS Word for creating documents.', 'v=24R66fQJBt0', 'https://forms.gle/sample');
addLesson('Skill Development', 'Tech Training', 'Microsoft Excel', 'Excel Formulas', 'Basic tech training in MS Excel and formulas.', 'v=-BmhxVAzSW8', 'https://forms.gle/sample');
addLesson('Skill Development', 'Tech Training', 'Technical Programs', 'Intro to Programming', 'Basic skill enhancement and programming introduction.', 'v=zfhupxtgV-0', 'https://forms.gle/sample');
addLesson('Skill Development', 'Growth & Enhancement', 'Communication', 'Effective Communication', 'Videos useful for training, growth, and skill enhancement.', 'v=d4AaZ_IME9M', 'https://forms.gle/sample');

// Career Guidance
addLesson('Career Guidance', 'Career Roadmap', 'Resume Building', 'Format for Resumes', 'How to format your resume for job applications.', 'v=vFqCJbQ6dkE', 'https://forms.gle/sample', 'sample_pdf_resume');
addLesson('Career Guidance', 'Career Roadmap', 'Introductions', 'Self Introduction', 'How to introduce yourself in an interview.', 'v=vneBvhWvFwA', 'https://forms.gle/sample');
addLesson('Career Guidance', 'Assessment', 'MCQs', 'Career Options MCQs', 'Multiple choice questions to determine your career roadmap.', 'v=Vd3TSt3UkjE', 'https://forms.gle/sample');

fs.writeFileSync('public/data/lessons.csv', lessons.join('\n'));
console.log('CSV created');
