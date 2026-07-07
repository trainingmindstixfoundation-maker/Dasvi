const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking for BSCIT class...");
    
    // 1. Create or Find Class
    let bscitClass = await prisma.class.findFirst({
      where: { name: 'BSCIT' }
    });
    
    if (!bscitClass) {
      bscitClass = await prisma.class.create({
        data: {
          name: 'BSCIT',
          description: 'Bachelor of Science in Information Technology'
        }
      });
      console.log("Created Class: BSCIT");
    } else {
      console.log("Class BSCIT already exists with ID:", bscitClass.id);
    }

    // 2. Create or Find Medium
    let medium = await prisma.medium.findFirst({
      where: { name: 'English Medium', classId: bscitClass.id }
    });

    if (!medium) {
      medium = await prisma.medium.create({
        data: {
          name: 'English Medium',
          classId: bscitClass.id
        }
      });
      console.log("Created Medium: English Medium for BSCIT");
    } else {
      console.log("Medium already exists with ID:", medium.id);
    }

    // 3. Create or Find Subjects (Chapters)
    const subjectsToCreate = [
      {
        name: 'Database Management Systems',
        videos: [
          {
            title: 'Introduction to SQL',
            description: 'Learn the fundamentals of SQL queries and relational databases.',
            url: 'https://www.youtube.com/watch?v=HXTtUSQz7Z4',
            thumbnail: 'https://img.youtube.com/vi/HXTtUSQz7Z4/hqdefault.jpg'
          },
          {
            title: 'Relational Database Design',
            description: 'Understand normalization, primary keys, foreign keys, and ER diagrams.',
            url: 'https://www.youtube.com/watch?v=JyS6U5Q1L5Q',
            thumbnail: 'https://img.youtube.com/vi/JyS6U5Q1L5Q/hqdefault.jpg'
          }
        ]
      },
      {
        name: 'Web Programming',
        videos: [
          {
            title: 'HTML & CSS Crash Course',
            description: 'Start building websites from scratch with HTML5 and CSS3 styling.',
            url: 'https://www.youtube.com/watch?v=mU6anWqZJcc',
            thumbnail: 'https://img.youtube.com/vi/mU6anWqZJcc/hqdefault.jpg'
          },
          {
            title: 'JavaScript Basics',
            description: 'Learn variables, loops, functions, and DOM manipulation in JS.',
            url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
            thumbnail: 'https://img.youtube.com/vi/hdI2bqOjy3c/hqdefault.jpg'
          }
        ]
      }
    ];

    for (const subInfo of subjectsToCreate) {
      let subject = await prisma.subject.findFirst({
        where: { name: subInfo.name, classId: bscitClass.id, mediumId: medium.id }
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            name: subInfo.name,
            classId: bscitClass.id,
            mediumId: medium.id
          }
        });
        console.log(`Created Subject: ${subInfo.name}`);
      } else {
        console.log(`Subject ${subInfo.name} already exists with ID: ${subject.id}`);
      }

      // Add videos
      for (const videoInfo of subInfo.videos) {
        const video = await prisma.video.findFirst({
          where: { title: videoInfo.title, subjectId: subject.id }
        });

        if (!video) {
          await prisma.video.create({
            data: {
              title: videoInfo.title,
              description: videoInfo.description,
              url: videoInfo.url,
              thumbnail: videoInfo.thumbnail,
              classId: bscitClass.id,
              mediumId: medium.id,
              subjectId: subject.id
            }
          });
          console.log(`  Added Video: ${videoInfo.title}`);
        } else {
          console.log(`  Video ${videoInfo.title} already exists`);
        }
      }
    }

    console.log("BSCIT Class and Chapter integration completed successfully!");
  } catch (error) {
    console.error("Failed to seed BSCIT:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
