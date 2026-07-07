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

let dbCache = null;

export const clearLessonsCache = () => {
  dbCache = null;
};

export const getLocalizedLessons = (rawData, language = 'en') => {
  if (!rawData) return [];
  const { classes, mediums, subjects, videos } = rawData;
  const lang = (language || 'en').toLowerCase();

  // 1. Filter classes that have a name in the selected language
  const activeClasses = (classes || []).filter(c => {
    const name = c[`name_${lang}`] || (c.translations?.[lang]?.name);
    return name && name.trim() !== '';
  });

  // 2. Filter mediums that have a name in the selected language and belong to active classes
  const activeMediums = (mediums || []).filter(m => {
    const name = m[`name_${lang}`] || (m.translations?.[lang]?.name);
    const belongs = activeClasses.some(c => c.id === m.classId);
    return name && name.trim() !== '' && belongs;
  });

  // 3. Filter subjects that have a name in the selected language and belong to active class & medium
  const activeSubjects = (subjects || []).filter(s => {
    const name = s[`name_${lang}`] || (s.translations?.[lang]?.name);
    const belongsClass = activeClasses.some(c => c.id === s.classId);
    const belongsMed = activeMediums.some(m => m.id === s.mediumId);
    return name && name.trim() !== '' && belongsClass && belongsMed;
  });

  // 4. Filter videos that have a title in the selected language and belong to active subjects
  const activeVideos = (videos || []).filter(v => {
    const title = v[`title_${lang}`] || (v.translations?.[lang]?.title);
    const belongsSub = activeSubjects.some(s => s.id === v.subjectId);
    return title && title.trim() !== '' && belongsSub;
  });

  // 5. Map active videos to lesson items
  const lessonItems = activeVideos.map((v, index) => {
    let youtube_video_id = '';
    const url = v.url || v.videoUrl || '';
    if (url) {
      if (url.includes('v=')) {
        youtube_video_id = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        youtube_video_id = url.split('youtu.be/')[1].split('?')[0];
      } else {
        youtube_video_id = url.split('?')[0].trim();
      }
    }
    if (!youtube_video_id) youtube_video_id = `lesson-${index}`;

    const parentSubject = activeSubjects.find(s => s.id === v.subjectId);
    const parentMedium = activeMediums.find(m => m.id === parentSubject?.mediumId);
    const parentClass = activeClasses.find(c => c.id === parentSubject?.classId);

    const classTranslatedName = parentClass[`name_${lang}`] || parentClass.translations?.[lang]?.name || parentClass.name || 'Class';
    const mediumTranslatedName = parentMedium[`name_${lang}`] || parentMedium.translations?.[lang]?.name || parentMedium.name || 'Medium';
    const subjectTranslatedName = parentSubject[`name_${lang}`] || parentSubject.translations?.[lang]?.name || parentSubject.name || 'Subject';
    const videoTranslatedTitle = v[`title_${lang}`] || v.translations?.[lang]?.title || v.title || 'Lesson';
    const videoTranslatedDesc = v[`description_${lang}`] || v.translations?.[lang]?.description || v.description || '';
    const classTranslatedDesc = parentClass[`description_${lang}`] || parentClass.translations?.[lang]?.description || parentClass.description || '';
    const classTranslatedImage = parentClass[`imageUrl_${lang}`] || parentClass.translations?.[lang]?.imageUrl || parentClass.imageUrl || parentClass.thumbnail || '';

    return {
      id: v.id.toString(),
      trade: classTranslatedName,
      semester: mediumTranslatedName,
      module: subjectTranslatedName,
      lesson_title: videoTranslatedTitle,
      youtube_video_id,
      youtube_download_link: url || `https://www.youtube.com/watch?v=${youtube_video_id}`,
      pdf_drive_id: '1A2B3C4D5E6F_OSI',
      description: videoTranslatedDesc,
      thumbnail: v.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`,
      duration: '15 Min',
      google_forms: '',
      placeholder: false,
      classDescription: classTranslatedDesc,
      classTranslations: parentClass.translations || null,
      classThumbnail: classTranslatedImage || '',
      mediumTranslations: parentMedium.translations || null,
      subjectTranslations: parentSubject.translations || null,
      videoTranslations: v.translations || null,
      rawClass: parentClass,
      rawMedium: parentMedium,
      rawSubject: parentSubject,
      rawVideo: v
    };
  });

  // 6. Generate placeholders for subjects/mediums/classes that are active in this language but have no videos
  activeClasses.forEach(c => {
    const classTranslatedName = c[`name_${lang}`] || c.translations?.[lang]?.name || c.name || 'Class';
    const classTranslatedDesc = c[`description_${lang}`] || c.translations?.[lang]?.description || c.description || '';
    const classTranslatedImage = c[`imageUrl_${lang}`] || c.translations?.[lang]?.imageUrl || c.imageUrl || '';

    const classRepresented = lessonItems.some(item => item.trade.toLowerCase() === classTranslatedName.toLowerCase());
    if (!classRepresented) {
      const classMeds = activeMediums.filter(m => m.classId === c.id);
      if (classMeds.length === 0) {
        lessonItems.push({
          id: `placeholder-class-${c.id}`,
          trade: classTranslatedName,
          semester: '',
          module: '',
          lesson_title: '',
          youtube_video_id: '',
          youtube_download_link: '',
          pdf_drive_id: '',
          description: classTranslatedDesc,
          thumbnail: classTranslatedImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
          duration: '',
          google_forms: '',
          placeholder: true,
          classDescription: classTranslatedDesc,
          classTranslations: c.translations || null,
          classThumbnail: classTranslatedImage || '',
          mediumTranslations: null,
          subjectTranslations: null,
          videoTranslations: null,
          rawClass: c
        });
      } else {
        classMeds.forEach(m => {
          const mediumTranslatedName = m[`name_${lang}`] || m.translations?.[lang]?.name || m.name || 'Medium';
          const medRepresented = lessonItems.some(item =>
            item.trade.toLowerCase() === classTranslatedName.toLowerCase() &&
            item.semester.toLowerCase() === mediumTranslatedName.toLowerCase()
          );
          if (!medRepresented) {
            const medSubs = activeSubjects.filter(s => s.mediumId === m.id);
            if (medSubs.length === 0) {
              lessonItems.push({
                id: `placeholder-medium-${m.id}`,
                trade: classTranslatedName,
                semester: mediumTranslatedName,
                module: '',
                lesson_title: '',
                youtube_video_id: '',
                youtube_download_link: '',
                pdf_drive_id: '',
                description: '',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                duration: '',
                google_forms: '',
                placeholder: true,
                classDescription: classTranslatedDesc,
                classTranslations: c.translations || null,
                classThumbnail: classTranslatedImage || '',
                mediumTranslations: m.translations || null,
                subjectTranslations: null,
                videoTranslations: null,
                rawClass: c,
                rawMedium: m
              });
            } else {
              medSubs.forEach(s => {
                const subjectTranslatedName = s[`name_${lang}`] || s.translations?.[lang]?.name || s.name || 'Subject';
                const subRepresented = lessonItems.some(item =>
                  item.trade.toLowerCase() === classTranslatedName.toLowerCase() &&
                  item.semester.toLowerCase() === mediumTranslatedName.toLowerCase() &&
                  item.module.toLowerCase() === subjectTranslatedName.toLowerCase()
                );
                if (!subRepresented) {
                  lessonItems.push({
                    id: `placeholder-subject-${s.id}`,
                    trade: classTranslatedName,
                    semester: mediumTranslatedName,
                    module: subjectTranslatedName,
                    lesson_title: '',
                    youtube_video_id: '',
                    youtube_download_link: '',
                    pdf_drive_id: '',
                    description: '',
                    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                    duration: '',
                    google_forms: '',
                    placeholder: true,
                    classDescription: classTranslatedDesc,
                    classTranslations: c.translations || null,
                    classThumbnail: classTranslatedImage || '',
                    mediumTranslations: m.translations || null,
                    subjectTranslations: s.translations || null,
                    videoTranslations: null,
                    rawClass: c,
                    rawMedium: m,
                    rawSubject: s
                  });
                }
              });
            }
          }
        });
      }
    } else {
      const classMeds = activeMediums.filter(m => m.classId === c.id);
      classMeds.forEach(m => {
        const mediumTranslatedName = m[`name_${lang}`] || m.translations?.[lang]?.name || m.name || 'Medium';
        const medRepresented = lessonItems.some(item =>
          item.trade.toLowerCase() === classTranslatedName.toLowerCase() &&
          item.semester.toLowerCase() === mediumTranslatedName.toLowerCase()
        );
        if (!medRepresented) {
          const medSubs = activeSubjects.filter(s => s.mediumId === m.id);
          if (medSubs.length === 0) {
            lessonItems.push({
              id: `placeholder-medium-${m.id}`,
              trade: classTranslatedName,
              semester: mediumTranslatedName,
              module: '',
              lesson_title: '',
              youtube_video_id: '',
              youtube_download_link: '',
              pdf_drive_id: '',
              description: '',
              thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
              duration: '',
              google_forms: '',
              placeholder: true,
              classDescription: classTranslatedDesc,
              classTranslations: c.translations || null,
              classThumbnail: classTranslatedImage || '',
              mediumTranslations: m.translations || null,
              subjectTranslations: null,
              videoTranslations: null,
              rawClass: c,
              rawMedium: m
            });
          } else {
            medSubs.forEach(s => {
              const subjectTranslatedName = s[`name_${lang}`] || s.translations?.[lang]?.name || s.name || 'Subject';
              const subRepresented = lessonItems.some(item =>
                item.trade.toLowerCase() === classTranslatedName.toLowerCase() &&
                item.semester.toLowerCase() === mediumTranslatedName.toLowerCase() &&
                item.module.toLowerCase() === subjectTranslatedName.toLowerCase()
              );
              if (!subRepresented) {
                lessonItems.push({
                  id: `placeholder-subject-${s.id}`,
                  trade: classTranslatedName,
                  semester: mediumTranslatedName,
                  module: subjectTranslatedName,
                  lesson_title: '',
                  youtube_video_id: '',
                  youtube_download_link: '',
                  pdf_drive_id: '',
                  description: '',
                  thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                  duration: '',
                  google_forms: '',
                  placeholder: true,
                  classDescription: classTranslatedDesc,
                  classTranslations: c.translations || null,
                  classThumbnail: classTranslatedImage || '',
                  mediumTranslations: m.translations || null,
                  subjectTranslations: s.translations || null,
                  videoTranslations: null,
                  rawClass: c,
                  rawMedium: m,
                  rawSubject: s
                });
              }
            });
          }
        } else {
          const medSubs = activeSubjects.filter(s => s.mediumId === m.id);
          medSubs.forEach(s => {
            const subjectTranslatedName = s[`name_${lang}`] || s.translations?.[lang]?.name || s.name || 'Subject';
            const subRepresented = lessonItems.some(item =>
              item.trade.toLowerCase() === classTranslatedName.toLowerCase() &&
              item.semester.toLowerCase() === mediumTranslatedName.toLowerCase() &&
              item.module.toLowerCase() === subjectTranslatedName.toLowerCase()
            );
            if (!subRepresented) {
              lessonItems.push({
                id: `placeholder-subject-${s.id}`,
                trade: classTranslatedName,
                semester: mediumTranslatedName,
                module: subjectTranslatedName,
                lesson_title: '',
                youtube_video_id: '',
                youtube_download_link: '',
                pdf_drive_id: '',
                description: '',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                duration: '',
                google_forms: '',
                placeholder: true,
                classDescription: classTranslatedDesc,
                classTranslations: c.translations || null,
                classThumbnail: classTranslatedImage || '',
                mediumTranslations: m.translations || null,
                subjectTranslations: s.translations || null,
                videoTranslations: null,
                rawClass: c,
                rawMedium: m,
                rawSubject: s
              });
            }
          });
        }
      });
    }
  });

  return lessonItems;
};

export const loadDefaultLessons = async (language = 'en') => {
  if (!dbCache) {
    const [classes, mediums, subjects, videos] = await Promise.all([
      fetch('http://localhost:5000/api/classes').then(res => {
        if (!res.ok) throw new Error('Failed to fetch classes');
        return res.json();
      }),
      fetch('http://localhost:5000/api/mediums').then(res => {
        if (!res.ok) throw new Error('Failed to fetch mediums');
        return res.json();
      }),
      fetch('http://localhost:5000/api/subjects').then(res => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        return res.json();
      }),
      fetch('http://localhost:5000/api/videos').then(res => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
    ]);
    dbCache = { classes, mediums, subjects, videos };
  }
  return getLocalizedLessons(dbCache, language);
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
    !item.placeholder &&
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
