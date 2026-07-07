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

// Formatting Helper Functions to compile flat database fields to standard JSON outputs
function formatClass(cls) {
  if (!cls) return null;
  const translations = {
    en: { name: cls.name_en || '', description: cls.description_en || '', imageUrl: cls.imageUrl_en || cls.imageUrl || '' },
    mr: { name: cls.name_mr || '', description: cls.description_mr || '', imageUrl: cls.imageUrl_mr || cls.imageUrl || '' },
    hi: { name: cls.name_hi || '', description: cls.description_hi || '', imageUrl: cls.imageUrl_hi || cls.imageUrl || '' }
  };
  return {
    id: cls.id,
    name: cls.name_en || '',
    name_en: cls.name_en || '',
    name_mr: cls.name_mr || '',
    name_hi: cls.name_hi || '',
    description: cls.description_en || '',
    description_en: cls.description_en || '',
    description_mr: cls.description_mr || '',
    description_hi: cls.description_hi || '',
    thumbnail: cls.imageUrl || '',
    imageUrl_en: cls.imageUrl_en || '',
    imageUrl_mr: cls.imageUrl_mr || '',
    imageUrl_hi: cls.imageUrl_hi || '',
    translations,
    createdAt: cls.createdAt
  };
}

function formatMedium(med) {
  if (!med) return null;
  const translations = {
    en: { name: med.name_en || '' },
    mr: { name: med.name_mr || '' },
    hi: { name: med.name_hi || '' }
  };
  return {
    id: med.id,
    name: med.name_en || '',
    name_en: med.name_en || '',
    name_mr: med.name_mr || '',
    name_hi: med.name_hi || '',
    classId: med.classId,
    translations,
    class: med.class ? formatClass(med.class) : null,
    createdAt: med.createdAt
  };
}

function formatSubject(sub) {
  if (!sub) return null;
  const translations = {
    en: { name: sub.name_en || '' },
    mr: { name: sub.name_mr || '' },
    hi: { name: sub.name_hi || '' }
  };
  return {
    id: sub.id,
    name: sub.name_en || '',
    name_en: sub.name_en || '',
    name_mr: sub.name_mr || '',
    name_hi: sub.name_hi || '',
    classId: sub.classId,
    mediumId: sub.mediumId,
    translations,
    class: sub.class ? formatClass(sub.class) : null,
    medium: sub.medium ? formatMedium(sub.medium) : null,
    createdAt: sub.createdAt
  };
}

function formatVideo(vid) {
  if (!vid) return null;
  const translations = {
    en: { title: vid.title_en || '', description: vid.description_en || '' },
    mr: { title: vid.title_mr || '', description: vid.description_mr || '' },
    hi: { title: vid.title_hi || '', description: vid.description_hi || '' }
  };
  return {
    id: vid.id,
    title: vid.title_en || '',
    title_en: vid.title_en || '',
    title_mr: vid.title_mr || '',
    title_hi: vid.title_hi || '',
    description: vid.description_en || '',
    description_en: vid.description_en || '',
    description_mr: vid.description_mr || '',
    description_hi: vid.description_hi || '',
    url: vid.videoUrl,
    thumbnail: vid.thumbnail || '',
    subjectId: vid.subjectId,
    classId: vid.subject?.classId || '',
    mediumId: vid.subject?.mediumId || '',
    translations,
    class: vid.subject?.class ? formatClass(vid.subject.class) : null,
    medium: vid.subject?.medium ? formatMedium(vid.subject.medium) : null,
    subject: vid.subject ? formatSubject(vid.subject) : null,
    createdAt: vid.createdAt
  };
}

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
    
    const recentVideosRaw = await prisma.video.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        subject: {
          include: {
            class: true,
            medium: true
          }
        }
      }
    });
    const recentVideos = recentVideosRaw.map(formatVideo);

    // Pie Chart language stats: only the 3 languages English, Hindi, and Marathi based on Medium
    const allVideos = await prisma.video.findMany({
      include: {
        subject: {
          include: {
            medium: true
          }
        }
      }
    });

    const languageCounts = { English: 0, Marathi: 0, Hindi: 0 };
    allVideos.forEach(v => {
      const medName = v.subject?.medium?.name_en;
      if (medName) {
        const lowerMed = medName.toLowerCase();
        if (lowerMed.includes('english')) {
          languageCounts.English++;
        } else if (lowerMed.includes('marathi')) {
          languageCounts.Marathi++;
        } else if (lowerMed.includes('hindi')) {
          languageCounts.Hindi++;
        }
      }
    });

    const contentOverview = [
      { name: 'English', count: languageCounts.English },
      { name: 'Hindi', count: languageCounts.Hindi },
      { name: 'Marathi', count: languageCounts.Marathi }
    ];

    // Top Subjects
    const videosBySubject = await prisma.video.groupBy({
      by: ['subjectId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 4
    });

    const topSubjects = await Promise.all(videosBySubject.map(async v => {
      const sub = await prisma.subject.findUnique({
        where: { id: v.subjectId }
      });
      const name = sub?.name_en || 'Unknown';
      return {
        name,
        videos: v._count.id,
        percent: totalVideos > 0 ? ((v._count.id / totalVideos) * 100).toFixed(1) : 0
      };
    }));

    // --- NEW Comprehensive Content Growth Calculation (Daily, Weekly, Monthly, Yearly) ---
    const now = new Date();
    
    // Helper to format dates
    const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const formatDay = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
    const formatMonth = (date) => date.toLocaleDateString('en-US', { month: 'short' });
    const formatYear = (date) => date.getFullYear().toString();
    
    const contentGrowth = {
      daily: { labels: [], videos: [] },
      weekly: { labels: [], videos: [] },
      monthly: { labels: [], videos: [] },
      yearly: { labels: [], videos: [] }
    };

    // Daily (Last 7 days)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      contentGrowth.daily.labels.push(formatDay(d));
      let count = 0;
      allVideos.forEach(v => {
        const vd = new Date(v.createdAt);
        if (vd.getDate() === d.getDate() && vd.getMonth() === d.getMonth() && vd.getFullYear() === d.getFullYear()) {
          count++;
        }
      });
      contentGrowth.daily.videos.push(count);
    }

    // Weekly (Last 4 weeks)
    for (let i = 3; i >= 0; i--) {
      const dStart = new Date(now);
      dStart.setDate(dStart.getDate() - (i * 7) - 6);
      const dEnd = new Date(now);
      dEnd.setDate(dEnd.getDate() - (i * 7));
      contentGrowth.weekly.labels.push(`Wk ${4-i}`);
      let count = 0;
      allVideos.forEach(v => {
        const vd = new Date(v.createdAt);
        if (vd >= dStart && vd <= dEnd) count++;
      });
      contentGrowth.weekly.videos.push(count);
    }

    // Monthly (Last 6 months)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      contentGrowth.monthly.labels.push(formatMonth(d));
      let count = 0;
      allVideos.forEach(v => {
        const vd = new Date(v.createdAt);
        if (vd.getMonth() === d.getMonth() && vd.getFullYear() === d.getFullYear()) {
          count++;
        }
      });
      contentGrowth.monthly.videos.push(count);
    }

    // Yearly (Last 5 years)
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - i);
      contentGrowth.yearly.labels.push(formatYear(d));
      let count = 0;
      allVideos.forEach(v => {
        const vd = new Date(v.createdAt);
        if (vd.getFullYear() === d.getFullYear()) {
          count++;
        }
      });
      contentGrowth.yearly.videos.push(count);
    }

    // Cumulative (Monthly, as required for legacy backwards compat)
    const growthHistory = contentGrowth.monthly.labels.map((label, idx) => ({
      month: label,
      videos: contentGrowth.monthly.videos[idx],
      subjects: 0
    }));

    res.json({
      stats: {
        totalClasses,
        totalMediums,
        totalSubjects,
        totalVideos
      },
      recentVideos,
      contentOverview,
      topSubjects,
      growthHistory,
      contentGrowth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Classes Routes
app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(classes.map(formatClass));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/classes', authMiddleware, async (req, res) => {
  try {
    const { name_en, name_mr, name_hi, description_en, description_mr, description_hi, thumbnail, translations } = req.body;
    const newClass = await prisma.class.create({
      data: {
        name_en: name_en || translations?.en?.name || '',
        name_mr: name_mr || translations?.mr?.name || '',
        name_hi: name_hi || translations?.hi?.name || '',
        description_en: description_en || translations?.en?.description || '',
        description_mr: description_mr || translations?.mr?.description || '',
        description_hi: description_hi || translations?.hi?.description || '',
        imageUrl: thumbnail || translations?.en?.imageUrl || '',
        imageUrl_en: translations?.en?.imageUrl || '',
        imageUrl_mr: translations?.mr?.imageUrl || '',
        imageUrl_hi: translations?.hi?.imageUrl || ''
      }
    });
    res.json(formatClass(newClass));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/classes/:id', authMiddleware, async (req, res) => {
  try {
    const { name_en, name_mr, name_hi, description_en, description_mr, description_hi, thumbnail, translations } = req.body;
    const classId = req.params.id;
    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name_en: name_en || translations?.en?.name || '',
        name_mr: name_mr || translations?.mr?.name || '',
        name_hi: name_hi || translations?.hi?.name || '',
        description_en: description_en || translations?.en?.description || '',
        description_mr: description_mr || translations?.mr?.description || '',
        description_hi: description_hi || translations?.hi?.description || '',
        imageUrl: thumbnail || translations?.en?.imageUrl || '',
        imageUrl_en: translations?.en?.imageUrl || '',
        imageUrl_mr: translations?.mr?.imageUrl || '',
        imageUrl_hi: translations?.hi?.imageUrl || ''
      }
    });
    res.json(formatClass(updatedClass));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/classes/:id', authMiddleware, async (req, res) => {
  try {
    const classId = req.params.id;
    await prisma.class.delete({ where: { id: classId } });
    res.json({ msg: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Medium Routes
app.get('/api/mediums', async (req, res) => {
  try {
    const mediums = await prisma.medium.findMany({
      include: { class: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(mediums.map(formatMedium));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/mediums', authMiddleware, async (req, res) => {
  try {
    const { name_en, name_mr, name_hi, classId, translations } = req.body;
    const newMedium = await prisma.medium.create({
      data: {
        classId,
        name_en: name_en || translations?.en?.name || '',
        name_mr: name_mr || translations?.mr?.name || '',
        name_hi: name_hi || translations?.hi?.name || ''
      },
      include: { class: true }
    });
    res.json(formatMedium(newMedium));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/mediums/:id', authMiddleware, async (req, res) => {
  try {
    const { name_en, name_mr, name_hi, classId, translations } = req.body;
    const mediumId = req.params.id;
    const updatedMedium = await prisma.medium.update({
      where: { id: mediumId },
      data: {
        classId,
        name_en: name_en || translations?.en?.name || '',
        name_mr: name_mr || translations?.mr?.name || '',
        name_hi: name_hi || translations?.hi?.name || ''
      },
      include: { class: true }
    });
    res.json(formatMedium(updatedMedium));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/mediums/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.medium.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Medium deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Subject Routes
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        class: true,
        medium: true
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(subjects.map(formatSubject));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const { name_en, name_mr, name_hi, classId, mediumId, translations } = req.body;
    const newSubject = await prisma.subject.create({
      data: {
        classId,
        mediumId,
        name_en: name_en || translations?.en?.name || '',
        name_mr: name_mr || translations?.mr?.name || '',
        name_hi: name_hi || translations?.hi?.name || ''
      },
      include: {
        class: true,
        medium: true
      }
    });
    res.json(formatSubject(newSubject));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/subjects/:id', authMiddleware, async (req, res) => {
  try {
    const { name_en, name_mr, name_hi, classId, mediumId, translations } = req.body;
    const subjectId = req.params.id;
    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: {
        classId,
        mediumId,
        name_en: name_en || translations?.en?.name || '',
        name_mr: name_mr || translations?.mr?.name || '',
        name_hi: name_hi || translations?.hi?.name || ''
      },
      include: {
        class: true,
        medium: true
      }
    });
    res.json(formatSubject(updatedSubject));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/subjects/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.subject.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Video Routes
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        subject: {
          include: {
            class: true,
            medium: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(videos.map(formatVideo));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/videos', authMiddleware, async (req, res) => {
  try {
    const { title_en, title_mr, title_hi, description_en, description_mr, description_hi, url, thumbnail, subjectId, translations } = req.body;
    const newVideo = await prisma.video.create({
      data: {
        subjectId,
        videoUrl: url,
        thumbnail: thumbnail || '',
        duration: 15,
        title_en: title_en || translations?.en?.title || '',
        title_mr: title_mr || translations?.mr?.title || '',
        title_hi: title_hi || translations?.hi?.title || '',
        description_en: description_en || translations?.en?.description || '',
        description_mr: description_mr || translations?.mr?.description || '',
        description_hi: description_hi || translations?.hi?.description || ''
      },
      include: {
        subject: {
          include: {
            class: true,
            medium: true
          }
        }
      }
    });
    res.json(formatVideo(newVideo));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/videos/:id', authMiddleware, async (req, res) => {
  try {
    const { title_en, title_mr, title_hi, description_en, description_mr, description_hi, url, thumbnail, subjectId, translations } = req.body;
    const videoId = req.params.id;
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        subjectId,
        videoUrl: url,
        thumbnail: thumbnail || '',
        title_en: title_en || translations?.en?.title || '',
        title_mr: title_mr || translations?.mr?.title || '',
        title_hi: title_hi || translations?.hi?.title || '',
        description_en: description_en || translations?.en?.description || '',
        description_mr: description_mr || translations?.mr?.description || '',
        description_hi: description_hi || translations?.hi?.description || ''
      },
      include: {
        subject: {
          include: {
            class: true,
            medium: true
          }
        }
      }
    });
    res.json(formatVideo(updatedVideo));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/videos/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.video.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Tests Routes
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
      include: {
        questions: {
          include: {
            options: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    const formattedTests = tests.map(t => {
      const translations = {
        en: { title: t.title_en || '', pdfUrl: t.pdf_url_en || '', googleFormUrl: t.google_form_url_en || '' },
        mr: { title: t.title_mr || '', pdfUrl: t.pdf_url_mr || '', googleFormUrl: t.google_form_url_mr || '' },
        hi: { title: t.title_hi || '', pdfUrl: t.pdf_url_hi || '', googleFormUrl: t.google_form_url_hi || '' }
      };

      return {
        id: t.id,
        title: t.title_en || '',
        title_en: t.title_en || '',
        title_mr: t.title_mr || '',
        title_hi: t.title_hi || '',
        classId: t.classId,
        mediumId: t.mediumId,
        subjectId: t.subjectId,
        videoId: t.videoId,
        type: t.videoId ? 'video' : 'subject',
        optionType: t.pdf_url_en ? 'pdf' : t.google_form_url_en ? 'google_form' : 'mcq',
        pdfUrl: t.pdf_url_en || '',
        pdf_url_en: t.pdf_url_en || '',
        pdf_url_mr: t.pdf_url_mr || '',
        pdf_url_hi: t.pdf_url_hi || '',
        googleFormUrl: t.google_form_url_en || '',
        google_form_url_en: t.google_form_url_en || '',
        google_form_url_mr: t.google_form_url_mr || '',
        google_form_url_hi: t.google_form_url_hi || '',
        translations,
        questions: t.questions.map(q => {
          const optEn = [];
          const optMr = [];
          const optHi = [];
          let correctIndex = 0;
          
          q.options.forEach((opt, idx) => {
            optEn.push(opt.option_text_en || '');
            optMr.push(opt.option_text_mr || '');
            optHi.push(opt.option_text_hi || '');
            if (opt.isCorrect) {
              correctIndex = idx;
            }
          });

          return {
            id: q.id,
            question: { en: q.question_text_en || '', mr: q.question_text_mr || '', hi: q.question_text_hi || '' },
            options: { en: optEn, mr: optMr, hi: optHi },
            correctIndex
          };
        })
      };
    });
    res.json(formattedTests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tests', authMiddleware, async (req, res) => {
  try {
    const { title_en, title_mr, title_hi, classId, mediumId, subjectId, videoId, pdf_url_en, pdf_url_mr, pdf_url_hi, google_form_url_en, google_form_url_mr, google_form_url_hi, questions, optionType, translations } = req.body;
    const newTest = await prisma.test.create({
      data: {
        title_en: title_en || translations?.en?.title || '',
        title_mr: title_mr || translations?.mr?.title || '',
        title_hi: title_hi || translations?.hi?.title || '',
        classId: classId || null,
        mediumId: mediumId || null,
        subjectId: subjectId || null,
        videoId: videoId || null,
        pdf_url_en: optionType === 'pdf' ? (pdf_url_en || translations?.en?.pdfUrl || '') : null,
        pdf_url_mr: optionType === 'pdf' ? (pdf_url_mr || translations?.mr?.pdfUrl || '') : null,
        pdf_url_hi: optionType === 'pdf' ? (pdf_url_hi || translations?.hi?.pdfUrl || '') : null,
        google_form_url_en: optionType === 'google_form' ? (google_form_url_en || translations?.en?.googleFormUrl || '') : null,
        google_form_url_mr: optionType === 'google_form' ? (google_form_url_mr || translations?.mr?.googleFormUrl || '') : null,
        google_form_url_hi: optionType === 'google_form' ? (google_form_url_hi || translations?.hi?.googleFormUrl || '') : null,
      }
    });

    if (optionType === 'mcq' && Array.isArray(questions)) {
      for (const q of questions) {
        const createdQuestion = await prisma.question.create({
          data: {
            testId: newTest.id,
            question_text_en: q.question?.en || '',
            question_text_mr: q.question?.mr || '',
            question_text_hi: q.question?.hi || ''
          }
        });
        const optionsEn = q.options?.en || [];
        const optionsMr = q.options?.mr || [];
        const optionsHi = q.options?.hi || [];
        const correctIdx = q.correctIndex || 0;
        
        const maxLen = Math.max(optionsEn.length, optionsMr.length, optionsHi.length);
        for (let idx = 0; idx < maxLen; idx++) {
          await prisma.option.create({
            data: {
              questionId: createdQuestion.id,
              isCorrect: idx === correctIdx,
              option_text_en: optionsEn[idx] || '',
              option_text_mr: optionsMr[idx] || '',
              option_text_hi: optionsHi[idx] || ''
            }
          });
        }
      }
    }

    res.json({ msg: 'Test created successfully', id: newTest.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tests/:id', authMiddleware, async (req, res) => {
  try {
    const testId = req.params.id;
    const { title_en, title_mr, title_hi, classId, mediumId, subjectId, videoId, pdf_url_en, pdf_url_mr, pdf_url_hi, google_form_url_en, google_form_url_mr, google_form_url_hi, questions, optionType, translations } = req.body;
    
    await prisma.test.update({
      where: { id: testId },
      data: {
        title_en: title_en || translations?.en?.title || '',
        title_mr: title_mr || translations?.mr?.title || '',
        title_hi: title_hi || translations?.hi?.title || '',
        classId: classId || null,
        mediumId: mediumId || null,
        subjectId: subjectId || null,
        videoId: videoId || null,
        pdf_url_en: optionType === 'pdf' ? (pdf_url_en || translations?.en?.pdfUrl || '') : null,
        pdf_url_mr: optionType === 'pdf' ? (pdf_url_mr || translations?.mr?.pdfUrl || '') : null,
        pdf_url_hi: optionType === 'pdf' ? (pdf_url_hi || translations?.hi?.pdfUrl || '') : null,
        google_form_url_en: optionType === 'google_form' ? (google_form_url_en || translations?.en?.googleFormUrl || '') : null,
        google_form_url_mr: optionType === 'google_form' ? (google_form_url_mr || translations?.mr?.googleFormUrl || '') : null,
        google_form_url_hi: optionType === 'google_form' ? (google_form_url_hi || translations?.hi?.googleFormUrl || '') : null,
      }
    });

    await prisma.question.deleteMany({ where: { testId } });

    if (optionType === 'mcq' && Array.isArray(questions)) {
      for (const q of questions) {
        const createdQuestion = await prisma.question.create({
          data: {
            testId,
            question_text_en: q.question?.en || '',
            question_text_mr: q.question?.mr || '',
            question_text_hi: q.question?.hi || ''
          }
        });
        const optionsEn = q.options?.en || [];
        const optionsMr = q.options?.mr || [];
        const optionsHi = q.options?.hi || [];
        const correctIdx = q.correctIndex || 0;
        
        const maxLen = Math.max(optionsEn.length, optionsMr.length, optionsHi.length);
        for (let idx = 0; idx < maxLen; idx++) {
          await prisma.option.create({
            data: {
              questionId: createdQuestion.id,
              isCorrect: idx === correctIdx,
              option_text_en: optionsEn[idx] || '',
              option_text_mr: optionsMr[idx] || '',
              option_text_hi: optionsHi[idx] || ''
            }
          });
        }
      }
    }

    res.json({ msg: 'Test updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tests/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.test.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tests/bulk-json', authMiddleware, async (req, res) => {
  const { tests } = req.body;
  if (!Array.isArray(tests)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array of tests.' });
  }

  try {
    for (const item of tests) {
      const className = item.className ? String(item.className).trim() : null;
      const classMr = item.classMr ? String(item.classMr).trim() : null;
      const classHi = item.classHi ? String(item.classHi).trim() : null;
      const mediumName = item.mediumName ? String(item.mediumName).trim() : null;
      const mediumMr = item.mediumMr ? String(item.mediumMr).trim() : null;
      const mediumHi = item.mediumHi ? String(item.mediumHi).trim() : null;
      const subjectName = item.subjectName ? String(item.subjectName).trim() : null;
      const subjectMr = item.subjectMr ? String(item.subjectMr).trim() : null;
      const subjectHi = item.subjectHi ? String(item.subjectHi).trim() : null;
      
      const titleEn = item.titleEn ? String(item.titleEn).trim() : null;
      const titleMr = item.titleMr ? String(item.titleMr).trim() : null;
      const titleHi = item.titleHi ? String(item.titleHi).trim() : null;
      const optionType = item.optionType ? String(item.optionType).trim() : 'pdf';
      const pdfUrlEn = item.pdfUrlEn ? String(item.pdfUrlEn).trim() : null;
      const pdfUrlMr = item.pdfUrlMr ? String(item.pdfUrlMr).trim() : null;
      const pdfUrlHi = item.pdfUrlHi ? String(item.pdfUrlHi).trim() : null;
      const googleFormUrlEn = item.googleFormUrlEn ? String(item.googleFormUrlEn).trim() : null;
      const googleFormUrlMr = item.googleFormUrlMr ? String(item.googleFormUrlMr).trim() : null;
      const googleFormUrlHi = item.googleFormUrlHi ? String(item.googleFormUrlHi).trim() : null;

      if (!className || !mediumName || !subjectName || !titleEn) continue;

      let cls = await prisma.class.findFirst({
        where: { name_en: { equals: className, mode: 'insensitive' } }
      });
      if (!cls) {
        cls = await prisma.class.create({
          data: {
            name_en: className,
            name_mr: classMr || className,
            name_hi: classHi || className,
            description_en: '',
            description_mr: '',
            description_hi: '',
            imageUrl: ''
          }
        });
      }

      let med = await prisma.medium.findFirst({
        where: { classId: cls.id, name_en: { equals: mediumName, mode: 'insensitive' } }
      });
      if (!med) {
        med = await prisma.medium.create({
          data: {
            classId: cls.id,
            name_en: mediumName,
            name_mr: mediumMr || mediumName,
            name_hi: mediumHi || mediumName
          }
        });
      }

      let sub = await prisma.subject.findFirst({
        where: { classId: cls.id, mediumId: med.id, name_en: { equals: subjectName, mode: 'insensitive' } }
      });
      if (!sub) {
        sub = await prisma.subject.create({
          data: {
            classId: cls.id,
            mediumId: med.id,
            name_en: subjectName,
            name_mr: subjectMr || subjectName,
            name_hi: subjectHi || subjectName
          }
        });
      }

      let existingTest = await prisma.test.findFirst({
        where: {
          subjectId: sub.id,
          title_en: titleEn
        }
      });

      if (!existingTest) {
        await prisma.test.create({
          data: {
            classId: cls.id,
            mediumId: med.id,
            subjectId: sub.id,
            title_en: titleEn,
            title_mr: titleMr || titleEn,
            title_hi: titleHi || titleEn,
            pdf_url_en: optionType === 'pdf' ? pdfUrlEn : null,
            pdf_url_mr: optionType === 'pdf' ? pdfUrlMr : null,
            pdf_url_hi: optionType === 'pdf' ? pdfUrlHi : null,
            google_form_url_en: optionType === 'google_form' ? googleFormUrlEn : null,
            google_form_url_mr: optionType === 'google_form' ? googleFormUrlMr : null,
            google_form_url_hi: optionType === 'google_form' ? googleFormUrlHi : null,
          }
        });
      } else {
        const updateData = {};
        if (titleMr && titleMr !== titleEn && existingTest.title_mr !== titleMr) updateData.title_mr = titleMr;
        if (titleHi && titleHi !== titleEn && existingTest.title_hi !== titleHi) updateData.title_hi = titleHi;
        if (pdfUrlMr && existingTest.pdf_url_mr !== pdfUrlMr) updateData.pdf_url_mr = pdfUrlMr;
        if (pdfUrlHi && existingTest.pdf_url_hi !== pdfUrlHi) updateData.pdf_url_hi = pdfUrlHi;
        if (googleFormUrlMr && existingTest.google_form_url_mr !== googleFormUrlMr) updateData.google_form_url_mr = googleFormUrlMr;
        if (googleFormUrlHi && existingTest.google_form_url_hi !== googleFormUrlHi) updateData.google_form_url_hi = googleFormUrlHi;
        if (Object.keys(updateData).length > 0) {
          await prisma.test.update({ where: { id: existingTest.id }, data: updateData });
        }
      }
    }
    res.json({ msg: 'Bulk import of Test data completed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing bulk JSON test import' });
  }
});

// Reports Endpoint
app.get('/api/reports', authMiddleware, async (req, res) => {
  try {
    const { classId, mediumId, subjectId, date } = req.query;

    const where = {};
    if (classId) {
      where.subject = { classId };
    }
    if (mediumId) {
      where.subject = { ...where.subject, mediumId };
    }
    if (subjectId) {
      where.subjectId = subjectId;
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0,0,0,0);
      const endDate = new Date(date);
      endDate.setHours(23,59,59,999);
      where.createdAt = { gte: startDate, lte: endDate };
    }

    const videos = await prisma.video.findMany({
      where,
      include: {
        subject: {
          include: {
            class: true,
            medium: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedList = videos.map(v => {
      const clsName = v.subject?.class?.name_en || 'Unknown';
      const medName = v.subject?.medium?.name_en || 'Unknown';
      const subName = v.subject?.name_en || 'Unknown';
      const title = v.title_en || 'Unknown';
      return {
        id: v.id,
        title,
        class: clsName,
        medium: medName,
        subject: subName,
        createdAt: v.createdAt
      };
    });

    const dateCounts = {};
    formattedList.forEach(v => {
      const dateStr = new Date(v.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    const uploadTrends = Object.entries(dateCounts).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalVideos: formattedList.length,
      videosList: formattedList,
      uploadTrends
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Feedback Routes
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching feedbacks' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { title, name, email, rating, formUrl, message } = req.body;
    const newFeedback = await prisma.feedback.create({
      data: {
        title: title || null,
        name: name || null,
        email: email || null,
        rating: rating || null,
        formUrl: formUrl || null,
        message: message || null,
      }
    });
    res.json(newFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating feedback' });
  }
});

app.delete('/api/feedbacks/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.feedback.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Feedback deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting feedback' });
  }
});

// Bulk Upload Endpoint
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const csv = require('csv-parser');
const fs = require('fs');

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

          let cls = await prisma.class.findFirst({
            where: { name_en: { equals: className, mode: 'insensitive' } }
          });
          if (!cls) {
            cls = await prisma.class.create({
              data: {
                name_en: className,
                name_mr: className,
                name_hi: className,
                description_en: '',
                description_mr: '',
                description_hi: '',
                imageUrl: ''
              }
            });
          }

          let med = await prisma.medium.findFirst({
            where: { 
              classId: cls.id, 
              name_en: { equals: mediumName, mode: 'insensitive' } 
            }
          });
          if (!med) {
            med = await prisma.medium.create({
              data: {
                classId: cls.id,
                name_en: mediumName,
                name_mr: mediumName,
                name_hi: mediumName
              }
            });
          }

          let sub = await prisma.subject.findFirst({
            where: { 
              classId: cls.id, 
              mediumId: med.id, 
              name_en: { equals: subjectName, mode: 'insensitive' } 
            }
          });
          if (!sub) {
            sub = await prisma.subject.create({
              data: {
                classId: cls.id,
                mediumId: med.id,
                name_en: subjectName,
                name_mr: subjectName,
                name_hi: subjectName
              }
            });
          }
          
          let existingVideo = await prisma.video.findFirst({
            where: { subjectId: sub.id, title_en: title }
          });

          if (!existingVideo) {
            await prisma.video.create({
              data: {
                subjectId: sub.id,
                videoUrl: url,
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                title_en: title,
                title_mr: title,
                title_hi: title,
                description_en: description,
                description_mr: description,
                description_hi: description
              }
            });
          }
        }
        fs.unlinkSync(req.file.path);
        res.json({ msg: 'Bulk upload completed successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error processing CSV' });
      }
    });
});

app.post('/api/videos/bulk-json', authMiddleware, async (req, res) => {
  const { videos } = req.body;
  if (!Array.isArray(videos)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array of videos.' });
  }

  try {
    for (const item of videos) {
      const className = item.className ? String(item.className).trim() : null;
      const classMr = item.classMr ? String(item.classMr).trim() : null;
      const classHi = item.classHi ? String(item.classHi).trim() : null;
      const mediumName = item.mediumName ? String(item.mediumName).trim() : null;
      const mediumMr = item.mediumMr ? String(item.mediumMr).trim() : null;
      const mediumHi = item.mediumHi ? String(item.mediumHi).trim() : null;
      const subjectName = item.subjectName ? String(item.subjectName).trim() : null;
      const subjectMr = item.subjectMr ? String(item.subjectMr).trim() : null;
      const subjectHi = item.subjectHi ? String(item.subjectHi).trim() : null;
      const title = item.title ? String(item.title).trim() : null;
      const titleMr = item.titleMr ? String(item.titleMr).trim() : null;
      const titleHi = item.titleHi ? String(item.titleHi).trim() : null;
      const url = item.url ? String(item.url).trim() : '';
      const coverUrl = item.coverUrl ? String(item.coverUrl).trim() : '';
      const description = item.description ? String(item.description).trim() : '';
      const descriptionMr = item.descriptionMr ? String(item.descriptionMr).trim() : null;
      const descriptionHi = item.descriptionHi ? String(item.descriptionHi).trim() : null;

      if (!className || !mediumName || !subjectName || !title) continue;

      let cls = await prisma.class.findFirst({
        where: { name_en: { equals: className, mode: 'insensitive' } }
      });
      if (!cls) {
        cls = await prisma.class.create({
          data: {
            name_en: className,
            name_mr: classMr || className,
            name_hi: classHi || className,
            description_en: '',
            description_mr: '',
            description_hi: '',
            imageUrl: ''
          }
        });
      } else {
        const updateData = {};
        if (classMr && classMr !== className && cls.name_mr !== classMr) updateData.name_mr = classMr;
        if (classHi && classHi !== className && cls.name_hi !== classHi) updateData.name_hi = classHi;
        if (Object.keys(updateData).length > 0) {
          cls = await prisma.class.update({ where: { id: cls.id }, data: updateData });
        }
      }

      let med = await prisma.medium.findFirst({
        where: { 
          classId: cls.id, 
          name_en: { equals: mediumName, mode: 'insensitive' } 
        }
      });
      if (!med) {
        med = await prisma.medium.create({
          data: {
            classId: cls.id,
            name_en: mediumName,
            name_mr: mediumMr || mediumName,
            name_hi: mediumHi || mediumName
          }
        });
      } else {
        const updateData = {};
        if (mediumMr && mediumMr !== mediumName && med.name_mr !== mediumMr) updateData.name_mr = mediumMr;
        if (mediumHi && mediumHi !== mediumName && med.name_hi !== mediumHi) updateData.name_hi = mediumHi;
        if (Object.keys(updateData).length > 0) {
          med = await prisma.medium.update({ where: { id: med.id }, data: updateData });
        }
      }

      let sub = await prisma.subject.findFirst({
        where: { 
          classId: cls.id, 
          mediumId: med.id, 
          name_en: { equals: subjectName, mode: 'insensitive' } 
        }
      });
      if (!sub) {
        sub = await prisma.subject.create({
          data: {
            classId: cls.id,
            mediumId: med.id,
            name_en: subjectName,
            name_mr: subjectMr || subjectName,
            name_hi: subjectHi || subjectName
          }
        });
      } else {
        const updateData = {};
        if (subjectMr && subjectMr !== subjectName && sub.name_mr !== subjectMr) updateData.name_mr = subjectMr;
        if (subjectHi && subjectHi !== subjectName && sub.name_hi !== subjectHi) updateData.name_hi = subjectHi;
        if (Object.keys(updateData).length > 0) {
          sub = await prisma.subject.update({ where: { id: sub.id }, data: updateData });
        }
      }

      let existingVideo = await prisma.video.findFirst({
        where: {
          subjectId: sub.id,
          title_en: title
        }
      });

      if (!existingVideo) {
        await prisma.video.create({
          data: {
            subjectId: sub.id,
            videoUrl: url,
            thumbnail: coverUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
            title_en: title,
            title_mr: titleMr || title,
            title_hi: titleHi || title,
            description_en: description,
            description_mr: descriptionMr || description,
            description_hi: descriptionHi || description
          }
        });
      } else {
        const updateData = {};
        if (titleMr && titleMr !== title && existingVideo.title_mr !== titleMr) updateData.title_mr = titleMr;
        if (titleHi && titleHi !== title && existingVideo.title_hi !== titleHi) updateData.title_hi = titleHi;
        if (descriptionMr && existingVideo.description_mr !== descriptionMr) updateData.description_mr = descriptionMr;
        if (descriptionHi && existingVideo.description_hi !== descriptionHi) updateData.description_hi = descriptionHi;
        if (coverUrl && existingVideo.thumbnail !== coverUrl) updateData.thumbnail = coverUrl;
        
        if (Object.keys(updateData).length > 0) {
          await prisma.video.update({ where: { id: existingVideo.id }, data: updateData });
        }
      }
    }
    res.json({ msg: 'Bulk import of Excel/CSV data completed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing bulk JSON import' });
  }
});

// Visitor Routes
app.post('/api/visitors', async (req, res) => {
  try {
    const { full_name, email, phone, iti_institute, visitor_token, ip_address, user_agent } = req.body;

    // Validate full_name: Alpha only, min 3 words, space separated
    if (!full_name || !/^[A-Za-z]+(?:\s+[A-Za-z]+){2,}$/.test(full_name.trim())) {
      return res.status(400).json({ error: 'Name must contain First Name + Middle Name + Surname (only alphabets, min 3 words).' });
    }

    // Validate phone: Indian mobile number 10 digits starting with 6-9
    if (!phone || !/^[6-9]\d{9}$/.test(String(phone).trim())) {
      return res.status(400).json({ error: 'Phone must be a valid 10-digit Indian mobile number starting with 6-9.' });
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Validate institute
    if (!iti_institute || iti_institute.trim() === '') {
      return res.status(400).json({ error: 'Please enter your ITI Institute name.' });
    }

    const token = visitor_token || require('crypto').randomUUID();
    const clientIp = ip_address || req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const clientAgent = user_agent || req.get('user-agent') || 'Unknown';

    // Check if visitor with this token or email or phone already exists
    let visitor = null;
    if (visitor_token) {
      visitor = await prisma.visitor.findUnique({ where: { visitorToken: visitor_token } });
    }
    if (!visitor) {
      visitor = await prisma.visitor.findFirst({
        where: {
          OR: [
            { email: email.trim() },
            { phone: String(phone).trim() }
          ]
        }
      });
    }

    if (visitor) {
      // Update existing visitor
      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          fullName: full_name.trim(),
          email: email.trim(),
          phone: String(phone).trim(),
          itiInstitute: iti_institute.trim(),
          lastVisit: new Date(),
          totalVisits: { increment: 1 },
          ipAddress: clientIp,
          userAgent: clientAgent
        }
      });
      return res.json({ success: true, visitor_token: visitor.visitorToken, visitor });
    }

    // Create new visitor
    const newVisitor = await prisma.visitor.create({
      data: {
        fullName: full_name.trim(),
        email: email.trim(),
        phone: String(phone).trim(),
        itiInstitute: iti_institute.trim(),
        visitorToken: token,
        ipAddress: clientIp,
        userAgent: clientAgent
      }
    });

    res.json({ success: true, visitor_token: newVisitor.visitorToken, visitor: newVisitor });
  } catch (error) {
    console.error('Error saving visitor:', error);
    res.status(500).json({ error: 'Server error saving visitor data.' });
  }
});

app.get('/api/visitors/check/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.json({ valid: false });

    const visitor = await prisma.visitor.findUnique({
      where: { visitorToken: token }
    });

    if (!visitor) {
      return res.json({ valid: false });
    }

    // Update last visit and increment total visits
    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitor.id },
      data: {
        lastVisit: new Date(),
        totalVisits: { increment: 1 }
      }
    });

    res.json({ valid: true, visitor: updatedVisitor });
  } catch (error) {
    console.error('Error checking visitor token:', error);
    res.status(500).json({ valid: false, error: 'Server error' });
  }
});

app.post('/api/visitors/activity', async (req, res) => {
  try {
    const { visitor_token, activity_type, resource_id, duration } = req.body;
    if (!visitor_token) return res.status(400).json({ error: 'Visitor token required' });

    const visitor = await prisma.visitor.findUnique({
      where: { visitorToken: visitor_token }
    });

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    await prisma.visitorActivity.create({
      data: {
        visitorId: visitor.id,
        activityType: activity_type || 'PAGE_VISIT',
        resourceId: String(resource_id || ''),
        duration: parseInt(duration || 0, 10)
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording visitor activity:', error);
    res.status(500).json({ error: 'Server error recording activity' });
  }
});

app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      include: {
        _count: {
          select: { activities: true }
        }
      },
      orderBy: { lastVisit: 'desc' }
    });
    res.json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/visitors/:id/activities', async (req, res) => {
  try {
    const activities = await prisma.visitorActivity.findMany({
      where: { visitorId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching visitor activities:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

