const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process for flat multilingual schema...');

  // 1. Clean Database in order of dependencies
  await prisma.feedback.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.test.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.medium.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log('Database cleaned.');

  // 2. Seed Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@dasvi.com',
      password: hashedPassword,
    }
  });
  console.log('Admin user seeded:', admin.email);

  // 3. Seed Classes, Mediums, Subjects, and Videos from CSV
  const csvPath = path.join(__dirname, '..', 'public', 'data', 'lessons.csv');
  if (!fs.existsSync(csvPath)) {
    console.log('No public/data/lessons.csv file found to seed data.');
    return;
  }

  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split('\n');

  let addedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === '') continue;

    const columns = line.split('|').map(col => col.trim());
    if (columns.length < 7) continue;

    const className = columns[1];
    const mediumName = columns[2];
    const subjectName = columns[3];
    const videoTitle = columns[4];
    const videoDescription = columns[5] || 'Comprehensive learning module.';
    const videoLink = columns[6];

    if (!className || !mediumName || !subjectName || !videoTitle) continue;

    let url = videoLink;
    if (url.startsWith('v=')) {
      url = `https://www.youtube.com/watch?${url}`;
    }

    // A. Resolve Class Names & Upsert Class
    let name_en = className;
    let name_mr = className;
    let name_hi = className;
    if (className === 'Class 9') {
      name_mr = 'इयत्ता ९ वी';
      name_hi = 'कक्षा 9';
    } else if (className === 'Class 10') {
      name_mr = 'इयत्ता १० वी';
      name_hi = 'कक्षा 10';
    } else if (className === 'Class 12') {
      name_mr = 'इयत्ता १२ वी';
      name_hi = 'कक्षा 12';
    }

    let classRecord = await prisma.class.findFirst({
      where: { name_en: className }
    });

    if (!classRecord) {
      classRecord = await prisma.class.create({
        data: {
          name_en,
          name_mr,
          name_hi,
          description_en: `${className} standard curriculum.`,
          description_mr: `${name_mr} अभ्यासक्रम.`,
          description_hi: `${name_hi} पाठ्यक्रम.`,
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
        }
      });
    }

    // B. Resolve Medium Names & Upsert Medium
    let med_en = mediumName;
    let med_mr = mediumName;
    let med_hi = mediumName;
    if (mediumName === 'English') {
      med_mr = 'इंग्रजी';
      med_hi = 'अंग्रेजी';
    } else if (mediumName === 'Marathi') {
      med_mr = 'मराठी';
      med_hi = 'मराठी';
    } else if (mediumName === 'Hindi') {
      med_mr = 'हिंदी';
      med_hi = 'हिंदी';
    }

    let mediumRecord = await prisma.medium.findFirst({
      where: {
        classId: classRecord.id,
        name_en: mediumName
      }
    });

    if (!mediumRecord) {
      mediumRecord = await prisma.medium.create({
        data: {
          classId: classRecord.id,
          name_en: med_en,
          name_mr: med_mr,
          name_hi: med_hi
        }
      });
    }

    // C. Resolve Subject Names & Upsert Subject
    let sub_en = subjectName;
    let sub_mr = subjectName;
    let sub_hi = subjectName;
    if (subjectName === 'Mathematics') {
      sub_mr = 'गणित';
      sub_hi = 'गणित';
    } else if (subjectName === 'Science') {
      sub_mr = 'विज्ञान';
      sub_hi = 'विज्ञान';
    } else if (subjectName === 'English Grammar') {
      sub_mr = 'इंग्रजी व्याकरण';
      sub_hi = 'अंग्रेजी व्याकरण';
    }

    let subjectRecord = await prisma.subject.findFirst({
      where: {
        classId: classRecord.id,
        mediumId: mediumRecord.id,
        name_en: subjectName
      }
    });

    if (!subjectRecord) {
      subjectRecord = await prisma.subject.create({
        data: {
          classId: classRecord.id,
          mediumId: mediumRecord.id,
          name_en: sub_en,
          name_mr: sub_mr,
          name_hi: sub_hi
        }
      });
    }

    // D. Create Video
    let videoRecord = await prisma.video.findFirst({
      where: {
        subjectId: subjectRecord.id,
        title_en: videoTitle
      }
    });

    if (!videoRecord) {
      let youtubeId = '';
      if (columns[6].includes('v=')) {
        youtubeId = columns[6].split('v=')[1].split('&')[0];
      } else {
        youtubeId = columns[6].trim();
      }
      const thumbUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';

      await prisma.video.create({
        data: {
          subjectId: subjectRecord.id,
          videoUrl: url,
          thumbnail: thumbUrl,
          duration: 15,
          title_en: videoTitle,
          title_mr: `MR - ${videoTitle}`,
          title_hi: `HI - ${videoTitle}`,
          description_en: videoDescription,
          description_mr: `MR - ${videoDescription}`,
          description_hi: `HI - ${videoDescription}`
        }
      });
      addedCount++;
    }
  }

  // 4. Seed a default Test
  const defaultClass = await prisma.class.findFirst();
  const defaultMedium = await prisma.medium.findFirst();
  const defaultSubject = await prisma.subject.findFirst();
  const defaultVideo = await prisma.video.findFirst();

  if (defaultClass && defaultMedium && defaultSubject) {
    const test = await prisma.test.create({
      data: {
        classId: defaultClass.id,
        mediumId: defaultMedium.id,
        subjectId: defaultSubject.id,
        videoId: defaultVideo ? defaultVideo.id : null,
        title_en: 'Algebra Unit Test',
        title_mr: 'गणित घटक चाचणी',
        title_hi: 'बीजगणित इकाई परीक्षा',
        pdf_url_en: 'https://example.com/algebra_en.pdf',
        pdf_url_mr: 'https://example.com/algebra_mr.pdf',
        pdf_url_hi: 'https://example.com/algebra_hi.pdf',
        google_form_url_en: 'https://docs.google.com/forms/d/algebra_en',
        google_form_url_mr: 'https://docs.google.com/forms/d/algebra_mr',
        google_form_url_hi: 'https://docs.google.com/forms/d/algebra_hi',
        questions: {
          create: [
            {
              question_text_en: 'Solve for x: 2x + 5 = 15',
              question_text_mr: 'x ची किंमत काढा: 2x + 5 = 15',
              question_text_hi: 'x के लिए हल करें: 2x + 5 = 15',
              options: {
                create: [
                  {
                    isCorrect: true,
                    option_text_en: 'x = 5',
                    option_text_mr: 'x = 5',
                    option_text_hi: 'x = 5'
                  },
                  {
                    isCorrect: false,
                    option_text_en: 'x = 10',
                    option_text_mr: 'x = 10',
                    option_text_hi: 'x = 10'
                  }
                ]
              }
            }
          ]
        }
      }
    });
    console.log('Seeded a default MCQ test:', test.title_en);
  }

  console.log(`Seeding completed successfully! Added ${addedCount} videos.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
