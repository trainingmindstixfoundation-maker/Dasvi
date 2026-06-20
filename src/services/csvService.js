import Papa from 'papaparse';

/**
 * Normalizes different CSV formats (pipe-separated, comma-separated) into a unified react app data model
 */
const normalizeRow = (rawItem, index) => {
  const item = {};
  Object.keys(rawItem).forEach(k => {
    const cleanKey = k.trim();
    const value = typeof rawItem[k] === 'string' ? rawItem[k].trim() : rawItem[k];
    item[cleanKey] = value;
  });

  // Extract trade
  const trade = item.Trade || item.trade || 'COPA';
  
  // Extract semester (Year 1, Semester 1, etc.)
  const semester = item.Year || item.semester || 'Year 1';

  // Extract module
  const moduleVal = item.Module || item.module || 'General';

  // Extract lesson_title
  const lesson_title = item.Title || item.lesson_title || 'Introduction';

  // Extract youtube_video_id from "Youtube video link" or direct "youtube_video_id"
  const videoLink = item['Youtube video link'] || item.youtube_video_id || '';
  let youtube_video_id = '';
  if (videoLink) {
    if (videoLink.includes('v=')) {
      youtube_video_id = videoLink.split('v=')[1].split('&')[0];
    } else if (videoLink.includes('?')) {
      youtube_video_id = videoLink.split('?')[0].trim();
    } else {
      youtube_video_id = videoLink.trim();
    }
  }
  if (!youtube_video_id) {
    youtube_video_id = `lesson-${index}`;
  }

  // Extract youtube_download_link
  const youtube_download_link = item.youtube_download_link || `https://www.youtube.com/watch?v=${youtube_video_id}`;

  // Extract pdf_drive_id
  const pdf_drive_id = item.pdf_drive_id || '1A2B3C4D5E6F_OSI';

  // Extract description
  const description = item.Description || item.description || 'Comprehensive training session covering core vocational syllabus.';

  // Extract thumbnail
  const thumbnail = item.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`;

  // Extract duration
  const duration = item.duration || '15 Min';

  // Extract google forms link
  const google_forms = item['Google Forms'] || item.google_forms || '';

  return {
    id: `${youtube_video_id}_${index}`,
    trade,
    semester,
    module: moduleVal,
    lesson_title,
    youtube_video_id,
    youtube_download_link,
    pdf_drive_id,
    description,
    thumbnail,
    duration,
    google_forms
  };
};

/**
 * Loads and parses the default static CSV from public/data/lessons.csv
 */
export const loadDefaultLessons = () => {
  return fetch('http://localhost:5000/api/videos')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch API');
      return res.json();
    })
    .then(data => {
      return data.map((v, index) => {
        let youtube_video_id = '';
        if (v.url) {
          if (v.url.includes('v=')) {
            youtube_video_id = v.url.split('v=')[1].split('&')[0];
          } else if (v.url.includes('youtu.be/')) {
            youtube_video_id = v.url.split('youtu.be/')[1].split('?')[0];
          } else {
            youtube_video_id = v.url.split('?')[0].trim();
          }
        }
        if (!youtube_video_id) youtube_video_id = `lesson-${index}`;
        return {
          id: v.id.toString(),
          trade: v.class?.name || 'Class',
          semester: v.medium?.name || 'Medium',
          module: v.subject?.name || 'Subject',
          lesson_title: v.title || 'Lesson',
          youtube_video_id,
          youtube_download_link: v.url || `https://www.youtube.com/watch?v=${youtube_video_id}`,
          pdf_drive_id: '1A2B3C4D5E6F_OSI',
          description: v.description || '',
          thumbnail: v.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`,
          duration: '15 Min',
          google_forms: ''
        };
      });
    })
    .catch(err => {
      console.warn("Failed to fetch from API, falling back to CSV:", err);
      return new Promise((resolve, reject) => {
        Papa.parse('/data/lessons.csv', {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            let data = results.data;
            if (data.length > 0 && Object.keys(data[0]).length <= 1) {
              Papa.parse('/data/lessons.csv', {
                download: true,
                header: true,
                skipEmptyLines: true,
                delimiter: '|',
                complete: (res) => {
                  resolve(res.data.map((item, index) => normalizeRow(item, index)));
                },
                error: reject
              });
            } else {
              resolve(data.map((item, index) => normalizeRow(item, index)));
            }
          },
          error: reject
        });
      });
    });
};

/**
 * Parses a manually uploaded CSV file using PapaParse
 */
export const parseUploadedCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let data = results.data;
        if (data.length > 0 && Object.keys(data[0]).length <= 1) {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: '|',
            complete: (res) => {
              const enrichedData = res.data.map((item, index) => normalizeRow(item, index));
              resolve(enrichedData);
            },
            error: reject
          });
        } else {
          const enrichedData = data.map((item, index) => normalizeRow(item, index));
          resolve(enrichedData);
        }
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};

// -------------------------------------------------------------
// FILTERING & QUERY SELECTORS
// -------------------------------------------------------------

/**
 * Gets unique list of trades present in dataset
 */
export const getTrades = (lessons) => {
  if (!Array.isArray(lessons)) return [];
  const trades = lessons.map(item => item.trade).filter(Boolean);
  return [...new Set(trades)];
};

export const resolveTradeName = (lessons, tradeName) => {
  if (!Array.isArray(lessons) || !tradeName) return tradeName || '';
  const found = lessons.find(item => item.trade && item.trade.toLowerCase() === tradeName.toLowerCase());
  return found ? found.trade : tradeName;
};

export const resolveSemesterName = (lessons, tradeName, semesterName) => {
  if (!Array.isArray(lessons) || !tradeName || !semesterName) return semesterName || '';
  const found = lessons.find(item =>
    item.trade && item.semester &&
    item.trade.toLowerCase() === tradeName.toLowerCase() &&
    item.semester.toLowerCase() === semesterName.toLowerCase()
  );
  return found ? found.semester : semesterName;
};

export const resolveModuleName = (lessons, tradeName, semesterName, moduleName) => {
  if (!Array.isArray(lessons) || !tradeName || !semesterName || !moduleName) return moduleName || '';
  const found = lessons.find(item =>
    item.trade && item.semester && item.module &&
    item.trade.toLowerCase() === tradeName.toLowerCase() &&
    item.semester.toLowerCase() === semesterName.toLowerCase() &&
    item.module.toLowerCase() === moduleName.toLowerCase()
  );
  return found ? found.module : moduleName;
};

/**
 * Gets semesters under a specific trade
 */
export const getSemesters = (lessons, tradeName) => {
  if (!Array.isArray(lessons) || !tradeName) return [];
  const filtered = lessons.filter(item => 
    item.trade.toLowerCase() === tradeName.toLowerCase()
  );
  const semesters = filtered.map(item => item.semester).filter(Boolean);
  return [...new Set(semesters)].sort();
};

/**
 * Gets modules under a specific trade and semester
 */
export const getModules = (lessons, tradeName, semesterName) => {
  if (!Array.isArray(lessons) || !tradeName || !semesterName) return [];
  const filtered = lessons.filter(item => 
    item.trade.toLowerCase() === tradeName.toLowerCase() &&
    item.semester.toLowerCase() === semesterName.toLowerCase()
  );
  const modules = filtered.map(item => item.module).filter(Boolean);
  return [...new Set(modules)];
};

/**
 * Gets lessons matching specific trade, semester and module
 */
export const getLessons = (lessons, tradeName, semesterName, moduleName) => {
  if (!Array.isArray(lessons)) return [];
  return lessons.filter(item => 
    (!tradeName || item.trade.toLowerCase() === tradeName.toLowerCase()) &&
    (!semesterName || item.semester.toLowerCase() === semesterName.toLowerCase()) &&
    (!moduleName || item.module.toLowerCase() === moduleName.toLowerCase())
  );
};

/**
 * Gets a specific lesson by its dynamic ID
 */
export const getLessonById = (lessons, lessonId) => {
  if (!Array.isArray(lessons) || !lessonId) return null;
  return lessons.find(item => item.id === lessonId) || null;
};

/**
 * Advanced search matching trade, module, or title
 */
export const searchLessons = (lessons, query) => {
  if (!Array.isArray(lessons) || !query) return lessons;
  const cleanQuery = query.toLowerCase().trim();
  
  return lessons.filter(item => 
    (item.lesson_title && item.lesson_title.toLowerCase().includes(cleanQuery)) ||
    (item.trade && item.trade.toLowerCase().includes(cleanQuery)) ||
    (item.module && item.module.toLowerCase().includes(cleanQuery)) ||
    (item.semester && item.semester.toLowerCase().includes(cleanQuery)) ||
    (item.description && item.description.toLowerCase().includes(cleanQuery))
  );
};
/**
 * Gets the Google Form URL for a module (by finding the first non-empty Google Form link in the module's lessons)
 */
export const getModuleGoogleForm = (lessons, tradeName, semesterName, moduleName) => {
  if (!Array.isArray(lessons) || !tradeName || !semesterName || !moduleName) return '';
  const moduleLessons = getLessons(lessons, tradeName, semesterName, moduleName);
  const found = moduleLessons.find(item => item.google_forms && item.google_forms.trim() !== '');
  return found ? found.google_forms : '';
};

/**
 * Gets the ordered playlist of all lessons for a specific course (trade and semester)
 */
export const getCoursePlaylist = (lessons, tradeName, semesterName) => {
  if (!Array.isArray(lessons) || !tradeName || !semesterName) return [];
  return lessons.filter(item => 
    item.trade.toLowerCase() === tradeName.toLowerCase() &&
    item.semester.toLowerCase() === semesterName.toLowerCase()
  );
};
