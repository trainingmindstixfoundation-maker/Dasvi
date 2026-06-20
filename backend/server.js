const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware for auth
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const payload = { userId: admin.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const totalClasses = await prisma.class.count();
    const totalMediums = await prisma.medium.count();
    const totalSubjects = await prisma.subject.count();
    const totalVideos = await prisma.video.count();
    
    const recentVideos = await prisma.video.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { class: true, medium: true, subject: true }
    });

    // Content Overview: group by medium
    const videosByMedium = await prisma.video.groupBy({
      by: ['mediumId'],
      _count: { id: true }
    });
    const mediums = await prisma.medium.findMany();
    const contentOverview = videosByMedium.map(v => {
      const med = mediums.find(m => m.id === v.mediumId);
      return {
        name: med ? med.name : 'Unknown',
        count: v._count.id
      };
    });

    // Top Subjects: group by subject
    const videosBySubject = await prisma.video.groupBy({
      by: ['subjectId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 4
    });
    const subjects = await prisma.subject.findMany();
    const topSubjects = videosBySubject.map(v => {
      const sub = subjects.find(s => s.id === v.subjectId);
      return {
        name: sub ? sub.name : 'Unknown',
        videos: v._count.id,
        percent: totalVideos > 0 ? ((v._count.id / totalVideos) * 100).toFixed(1) : 0
      };
    });

    // Content Growth: Real data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const videosForGrowth = await prisma.video.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true }
    });
    const subjectsForGrowth = await prisma.subject.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true }
    });

    const priorVideosCount = await prisma.video.count({
      where: { createdAt: { lt: sixMonthsAgo } }
    });
    const priorSubjectsCount = await prisma.subject.count({
      where: { createdAt: { lt: sixMonthsAgo } }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    const videoCounts = [0, 0, 0, 0, 0, 0];
    const subjectCounts = [0, 0, 0, 0, 0, 0];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      labels.push(monthNames[d.getMonth()]);
    }

    videosForGrowth.forEach(v => {
      const d = new Date(v.createdAt);
      const now = new Date();
      const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
      const idx = 5 - monthDiff;
      if (idx >= 0 && idx < 6) videoCounts[idx]++;
    });

    subjectsForGrowth.forEach(s => {
      const d = new Date(s.createdAt);
      const now = new Date();
      const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
      const idx = 5 - monthDiff;
      if (idx >= 0 && idx < 6) subjectCounts[idx]++;
    });

    // Make cumulative
    videoCounts[0] += priorVideosCount;
    subjectCounts[0] += priorSubjectsCount;
    for (let i = 1; i < 6; i++) {
      videoCounts[i] += videoCounts[i-1];
      subjectCounts[i] += subjectCounts[i-1];
    }

    const contentGrowth = {
      labels,
      videos: videoCounts,
      subjects: subjectCounts
    };
    res.json({ 
      totalClasses, 
      totalMediums,
      totalSubjects, 
      totalVideos, 
      recentVideos,
      contentOverview,
      topSubjects,
      contentGrowth
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Classes Routes
app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.class.findMany({ orderBy: { id: 'asc' } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/classes', authMiddleware, async (req, res) => {
  try {
    const newClass = await prisma.class.create({ data: req.body });
    res.json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/classes/:id', authMiddleware, async (req, res) => {
  try {
    const updatedClass = await prisma.class.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/classes/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.class.delete({ where: { id: Number(req.params.id) } });
    res.json({ msg: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Medium Routes
app.get('/api/mediums', async (req, res) => {
  try {
    const mediums = await prisma.medium.findMany({
      include: { class: true },
      orderBy: { id: 'asc' }
    });
    res.json(mediums);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/mediums', authMiddleware, async (req, res) => {
  try {
    const { name, classId } = req.body;
    const newMedium = await prisma.medium.create({
      data: { name, classId: Number(classId) }
    });
    res.json(newMedium);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/mediums/:id', authMiddleware, async (req, res) => {
  try {
    const { name, classId } = req.body;
    const updatedMedium = await prisma.medium.update({
      where: { id: Number(req.params.id) },
      data: { name, classId: Number(classId) }
    });
    res.json(updatedMedium);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/mediums/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.medium.delete({ where: { id: Number(req.params.id) } });
    res.json({ msg: 'Medium deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Subject Routes
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: { class: true, medium: true },
      orderBy: { id: 'asc' }
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const { name, classId, mediumId } = req.body;
    const newSubject = await prisma.subject.create({
      data: { name, classId: Number(classId), mediumId: Number(mediumId) }
    });
    res.json(newSubject);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/subjects/:id', authMiddleware, async (req, res) => {
  try {
    const { name, classId, mediumId } = req.body;
    const updatedSubject = await prisma.subject.update({
      where: { id: Number(req.params.id) },
      data: { name, classId: Number(classId), mediumId: Number(mediumId) }
    });
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/subjects/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.subject.delete({ where: { id: Number(req.params.id) } });
    res.json({ msg: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Video Routes
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: { class: true, medium: true, subject: true },
      orderBy: { id: 'desc' }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/videos', authMiddleware, async (req, res) => {
  try {
    const { title, description, url, thumbnail, tags, classId, mediumId, subjectId } = req.body;
    const newVideo = await prisma.video.create({
      data: { 
        title, description, url, thumbnail, tags, 
        classId: Number(classId), 
        mediumId: Number(mediumId), 
        subjectId: Number(subjectId) 
      }
    });
    res.json(newVideo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/videos/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, url, thumbnail, tags, classId, mediumId, subjectId } = req.body;
    const updatedVideo = await prisma.video.update({
      where: { id: Number(req.params.id) },
      data: { 
        title, description, url, thumbnail, tags, 
        classId: Number(classId), 
        mediumId: Number(mediumId), 
        subjectId: Number(subjectId) 
      }
    });
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/videos/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.video.delete({ where: { id: Number(req.params.id) } });
    res.json({ msg: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk Upload Endpoint (Simplified using CSV parsing later or directly accepting an array)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csv-parser');

app.post('/api/videos/bulk', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: '|', mapHeaders: ({ header }) => header.trim() }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          const className = row.Trade ? row.Trade.trim() : (row.Class ? row.Class.trim() : null);
          const mediumName = row.Year ? row.Year.trim() : (row.Medium ? row.Medium.trim() : null);
          const subjectName = row.Module ? row.Module.trim() : (row.Subject ? row.Subject.trim() : null);
          const title = row.Title ? row.Title.trim() : (row['Video Title'] ? row['Video Title'].trim() : null);
          const url = row['Youtube video link'] ? row['Youtube video link'].trim() : (row.URL ? row.URL.trim() : '');
          const description = row.Description ? row.Description.trim() : '';
          
          if (!className || !mediumName || !subjectName || !title) continue;

          let cls = await prisma.class.findFirst({ where: { name: className } });
          if (!cls) cls = await prisma.class.create({ data: { name: className } });

          let med = await prisma.medium.findFirst({ where: { name: mediumName, classId: cls.id } });
          if (!med) med = await prisma.medium.create({ data: { name: mediumName, classId: cls.id } });

          let sub = await prisma.subject.findFirst({ where: { name: subjectName, classId: cls.id, mediumId: med.id } });
          if (!sub) sub = await prisma.subject.create({ data: { name: subjectName, classId: cls.id, mediumId: med.id } });
          
          await prisma.video.create({
            data: {
              title,
              description,
              url,
              classId: cls.id,
              mediumId: med.id,
              subjectId: sub.id
            }
          });
        }
        fs.unlinkSync(req.file.path);
        res.json({ msg: 'Bulk upload completed successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error processing CSV' });
      }
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
