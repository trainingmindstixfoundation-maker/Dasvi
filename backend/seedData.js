const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(__dirname, '..', 'public', 'data', 'lessons.csv');
  const csvData = fs.readFileSync(csvPath, 'utf8');

  const lines = csvData.split('\n');
  
  // Skip the header (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === '') continue;

    const columns = line.split('|').map(col => col.trim());
    if (columns.length < 7) continue;

    const className = columns[1];
    const mediumName = columns[2];
    const subjectName = columns[3];
    const videoTitle = columns[4];
    const videoDescription = columns[5];
    const videoLink = columns[6];

    if (!className || !mediumName || !subjectName || !videoTitle) continue;

    // Format the URL
    let url = videoLink;
    if (url.startsWith('v=')) {
      url = `https://www.youtube.com/watch?${url}`;
    }

    // Upsert Class
    let classRecord = await prisma.class.findFirst({ where: { name: className } });
    if (!classRecord) {
      classRecord = await prisma.class.create({ data: { name: className } });
    }

    // Upsert Medium
    let mediumRecord = await prisma.medium.findFirst({ 
      where: { name: mediumName, classId: classRecord.id } 
    });
    if (!mediumRecord) {
      mediumRecord = await prisma.medium.create({ 
        data: { name: mediumName, classId: classRecord.id } 
      });
    }

    // Upsert Subject
    let subjectRecord = await prisma.subject.findFirst({ 
      where: { name: subjectName, classId: classRecord.id, mediumId: mediumRecord.id } 
    });
    if (!subjectRecord) {
      subjectRecord = await prisma.subject.create({ 
        data: { name: subjectName, classId: classRecord.id, mediumId: mediumRecord.id } 
      });
    }

    // Create Video if not exists
    let existingVideo = await prisma.video.findFirst({
      where: {
        title: videoTitle,
        classId: classRecord.id,
        mediumId: mediumRecord.id,
        subjectId: subjectRecord.id
      }
    });
    if (!existingVideo) {
      await prisma.video.create({
        data: {
          title: videoTitle,
          description: videoDescription,
          url: url,
          thumbnail: `https://img.youtube.com/vi/${videoLink.replace('v=', '')}/hqdefault.jpg`,
          classId: classRecord.id,
          mediumId: mediumRecord.id,
          subjectId: subjectRecord.id,
        }
      });
      console.log(`Added: ${videoTitle}`);
    } else {
      console.log(`Skipped (already exists): ${videoTitle}`);
    }
  }
}

main()
  .then(() => {
    console.log('Dummy data successfully inserted!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Error inserting dummy data:', e);
    process.exit(1);
  });
