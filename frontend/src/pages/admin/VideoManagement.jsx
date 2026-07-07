import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getVideos, getSubjects, getMediums, getClasses, addVideo, updateVideo, deleteVideo, bulkUploadJSON } from '../../services/adminService';
import CustomSelect from '../../components/ui/CustomSelect';
import { Search, Plus, Edit2, Trash2, X, Globe, Video as VideoIcon, Image, Upload, FileSpreadsheet, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import FileUploadProgressFill from '../../components/application/file-upload/FileUploadProgressFill';
import { autoTranslateFields } from '../../services/autoTranslate';

const YoutubeIconCustom = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.525 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function VideoManagement() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('en'); // en, mr, hi
  const [translating, setTranslating] = useState(false);

  // Fields
  const [titleEn, setTitleEn] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descMr, setDescMr] = useState('');
  const [descHi, setDescHi] = useState('');
  
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  
  const [classId, setClassId] = useState('');
  const [mediumId, setMediumId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [tags, setTags] = useState('');
  const fileInputRef = useRef(null);

  const showNotificationPopup = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const downloadTemplate = () => {
    // Sheet 1: Template with sample multilingual data
    const templateData = [
      {
        Class: 'Class 9', Class_MR: 'इयत्ता ९ वी', Class_HI: 'कक्षा 9',
        Medium: 'English Medium', Medium_MR: 'इंग्रजी माध्यम', Medium_HI: 'अंग्रेजी माध्यम',
        Subject: 'Mathematics', Subject_MR: 'गणित', Subject_HI: 'गणित',
        Title: 'Introduction to Algebra', Title_MR: 'बीजगणिताची ओळख', Title_HI: 'बीजगणित का परिचय',
        Cover_URL: '', Youtube_URL: 'https://www.youtube.com/watch?v=EXAMPLE1',
        Description: 'Basic algebra concepts', Description_MR: 'मूलभूत बीजगणित', Description_HI: 'मूल बीजगणित',
        Tags: 'Algebra, Math', Tags_MR: 'बीजगणित, गणित', Tags_HI: 'बीजगणित, गणित'
      },
      {
        Class: 'Class 9', Class_MR: 'इयत्ता ९ वी', Class_HI: 'कक्षा 9',
        Medium: 'Marathi Medium', Medium_MR: 'मराठी माध्यम', Medium_HI: 'मराठी माध्यम',
        Subject: 'Science', Subject_MR: 'विज्ञान', Subject_HI: 'विज्ञान',
        Title: 'Introduction to Science', Title_MR: 'विज्ञानाची ओळख', Title_HI: 'विज्ञान का परिचय',
        Cover_URL: '', Youtube_URL: 'https://www.youtube.com/watch?v=EXAMPLE2',
        Description: 'Science overview', Description_MR: 'विज्ञानाची माहिती', Description_HI: 'विज्ञान का विवरण',
        Tags: 'Science', Tags_MR: 'विज्ञान', Tags_HI: 'विज्ञान'
      },
      {
        Class: 'Class 10', Class_MR: 'इयत्ता १० वी', Class_HI: 'कक्षा 10',
        Medium: 'Hindi Medium', Medium_MR: 'हिंदी माध्यम', Medium_HI: 'हिंदी माध्यम',
        Subject: 'History', Subject_MR: 'इतिहास', Subject_HI: 'इतिहास',
        Title: 'History Chapter 1', Title_MR: 'इतिहास अध्याय 1', Title_HI: 'इतिहास अध्याय 1',
        Cover_URL: '', Youtube_URL: 'https://www.youtube.com/watch?v=EXAMPLE3',
        Description: 'Chapter 1 of History', Description_MR: 'इतिहास अध्याय 1', Description_HI: 'इतिहास अध्याय 1',
        Tags: 'History', Tags_MR: 'इतिहास', Tags_HI: 'इतिहास'
      }
    ];
    // Sheet 2: Guidelines
    const guideData = [
      { Column: 'Class', Required: 'YES', 'Example Value': 'Class 9 / Class 10 / Class 12 / Career Guidance', Notes: 'Must exactly match the class name in the system (English name)' },
      { Column: 'Class_MR', Required: 'NO', 'Example Value': 'इयत्ता ९ वी', Notes: 'Class name in Marathi (used if creating a new Class)' },
      { Column: 'Class_HI', Required: 'NO', 'Example Value': 'कक्षा 9', Notes: 'Class name in Hindi (used if creating a new Class)' },
      { Column: 'Medium', Required: 'YES', 'Example Value': 'English Medium / Marathi Medium / Hindi Medium', Notes: 'Must exactly match the medium name in the system (English name)' },
      { Column: 'Medium_MR', Required: 'NO', 'Example Value': 'इंग्रजी माध्यम', Notes: 'Medium name in Marathi (used if creating a new Medium)' },
      { Column: 'Medium_HI', Required: 'NO', 'Example Value': 'अंग्रेजी माध्यम', Notes: 'Medium name in Hindi (used if creating a new Medium)' },
      { Column: 'Subject', Required: 'YES', 'Example Value': 'Mathematics / Science / History', Notes: 'Must exactly match the subject name in the system (English name)' },
      { Column: 'Subject_MR', Required: 'NO', 'Example Value': 'गणित', Notes: 'Subject name in Marathi (used if creating a new Subject)' },
      { Column: 'Subject_HI', Required: 'NO', 'Example Value': 'गणित', Notes: 'Subject name in Hindi (used if creating a new Subject)' },
      { Column: 'Title', Required: 'YES', 'Example Value': 'Introduction to Algebra', Notes: 'Video title in English' },
      { Column: 'Title_MR', Required: 'NO', 'Example Value': 'बीजगणिताची ओळख', Notes: 'Video title in Marathi' },
      { Column: 'Title_HI', Required: 'NO', 'Example Value': 'बीजगणित का परिचय', Notes: 'Video title in Hindi' },
      { Column: 'Cover_URL', Required: 'NO', 'Example Value': 'https://example.com/cover.jpg', Notes: 'Thumbnail URL for the video' },
      { Column: 'Youtube_URL', Required: 'YES', 'Example Value': 'https://www.youtube.com/watch?v=...', Notes: 'YouTube link or other video URL' },
      { Column: 'Description', Required: 'NO', 'Example Value': 'Brief overview of topics covered', Notes: 'Video description in English' },
      { Column: 'Description_MR', Required: 'NO', 'Example Value': 'वीडिओचे वर्णन', Notes: 'Video description in Marathi' },
      { Column: 'Description_HI', Required: 'NO', 'Example Value': 'वीडियो विवरण', Notes: 'Video description in Hindi' },
      { Column: 'Tags', Required: 'NO', 'Example Value': 'Algebra, Math', Notes: 'Comma-separated tags (English)' },
      { Column: 'Tags_MR', Required: 'NO', 'Example Value': 'बीजगणित, गणित', Notes: 'Comma-separated tags (Marathi)' },
      { Column: 'Tags_HI', Required: 'NO', 'Example Value': 'बीजगणित, गणित', Notes: 'Comma-separated tags (Hindi)' },
      { Column: '', Required: '', 'Example Value': '', Notes: '' },
      { Column: '⚠️ IMPORTANT RULES', Required: '', 'Example Value': '', Notes: '' },
      { Column: '1. Class, Medium, Subject must EXACTLY match English names in the system.', Required: '', 'Example Value': '', Notes: '' },
      { Column: '2. Rows with missing Class / Medium / Subject / Title will be skipped.', Required: '', 'Example Value': '', Notes: '' },
      { Column: '3. Save as .xlsx (Excel) or .csv with UTF-8 encoding for Marathi/Hindi text.', Required: '', 'Example Value': '', Notes: '' },
    ];
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(templateData);
    const ws2 = XLSX.utils.json_to_sheet(guideData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Video Import Template');
    XLSX.utils.book_append_sheet(wb, ws2, 'Guidelines');
    XLSX.writeFile(wb, 'Dasvi_Video_Import_Template.xlsx');
    showNotificationPopup('success', 'Template downloaded! Fill in all columns and import using Import Excel/CSV.');
  };

  const handleExcelImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          let rows = results.data;
          if (rows.length > 0 && Object.keys(rows[0]).length <= 1) {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              delimiter: '|',
              complete: async (res) => {
                await processParsedRows(res.data);
              }
            });
          } else {
            await processParsedRows(rows);
          }
        },
        error: (err) => {
          showNotificationPopup('error', 'Failed to parse CSV: ' + err.message);
        }
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          await processParsedRows(jsonData);
        } catch (err) {
          showNotificationPopup('error', 'Failed to parse Excel file: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showNotificationPopup('error', 'Unsupported file format. Please select an Excel (.xlsx, .xls) or CSV (.csv) file.');
    }
    
    // reset file input
    e.target.value = '';
  };

  const processParsedRows = async (rows) => {
    const mappedVideos = rows.map(row => {
      const className = row.Class || row.class || row.Trade || row.trade || '';
      const classMr = row.Class_MR || row.class_mr || '';
      const classHi = row.Class_HI || row.class_hi || '';
      const mediumName = row.Medium || row.medium || row.Year || row.year || '';
      const mediumMr = row.Medium_MR || row.medium_mr || '';
      const mediumHi = row.Medium_HI || row.medium_hi || '';
      const subjectName = row.Subject || row.subject || row.Module || row.module || '';
      const subjectMr = row.Subject_MR || row.subject_mr || '';
      const subjectHi = row.Subject_HI || row.subject_hi || '';
      const title = row.Title || row.title || row['Video Title'] || row.video_title || row['Lesson Title'] || row.lesson_title || '';
      const titleMr = row.Title_MR || row.title_mr || row['Title MR'] || '';
      const titleHi = row.Title_HI || row.title_hi || row['Title HI'] || '';
      const url = row.Youtube_URL || row.youtube_url || row.URL || row.url || row['Youtube video link'] || row.youtube_video_id || row.youtube_download_link || '';
      const coverUrl = row.Cover_URL || row.cover_url || '';
      const description = row.Description || row.description || row.desc || '';
      const descriptionMr = row.Description_MR || row.description_mr || row['Description MR'] || '';
      const descriptionHi = row.Description_HI || row.description_hi || row['Description HI'] || '';
      const tags = row.Tags || row.tags || '';
      const tagsMr = row.Tags_MR || row.tags_mr || '';
      const tagsHi = row.Tags_HI || row.tags_hi || '';

      return {
        className, classMr, classHi,
        mediumName, mediumMr, mediumHi,
        subjectName, subjectMr, subjectHi,
        title, titleMr, titleHi,
        url, coverUrl,
        description, descriptionMr, descriptionHi,
        tags, tagsMr, tagsHi
      };
    }).filter(v => v.className && v.mediumName && v.subjectName && v.title);

    if (mappedVideos.length === 0) {
      showNotificationPopup('error', 'No valid rows found. Check columns for Class, Medium, Subject, Title, and URL.');
      return;
    }

    try {
      setLoading(true);
      const res = await bulkUploadJSON(mappedVideos);
      showNotificationPopup('success', res.msg || 'Import completed successfully!');
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to import file content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadWithProgress = (file, onProgress, onSuccess, onError) => {
    try {
      onProgress(20, "Reading spreadsheet file...");
      const extension = file.name.split('.').pop().toLowerCase();

      const parseAndUploadRows = async (rows) => {
        onProgress(50, "Mapping and validating video records...");
        const mappedVideos = rows.map(row => {
          const className = row.Class || row.class || row.Trade || row.trade || '';
          const classMr = row.Class_MR || row.class_mr || '';
          const classHi = row.Class_HI || row.class_hi || '';
          const mediumName = row.Medium || row.medium || row.Year || row.year || '';
          const mediumMr = row.Medium_MR || row.medium_mr || '';
          const mediumHi = row.Medium_HI || row.medium_hi || '';
          const subjectName = row.Subject || row.subject || row.Module || row.module || '';
          const subjectMr = row.Subject_MR || row.subject_mr || '';
          const subjectHi = row.Subject_HI || row.subject_hi || '';
          const title = row.Title || row.title || row['Video Title'] || row.video_title || row['Lesson Title'] || row.lesson_title || '';
          const titleMr = row.Title_MR || row.title_mr || row['Title MR'] || '';
          const titleHi = row.Title_HI || row.title_hi || row['Title HI'] || '';
          const url = row.Youtube_URL || row.youtube_url || row.URL || row.url || row['Youtube video link'] || row.youtube_video_id || row.youtube_download_link || '';
          const coverUrl = row.Cover_URL || row.cover_url || '';
          const description = row.Description || row.description || row.desc || '';
          const descriptionMr = row.Description_MR || row.description_mr || row['Description MR'] || '';
          const descriptionHi = row.Description_HI || row.description_hi || row['Description HI'] || '';
          const tags = row.Tags || row.tags || '';
          const tagsMr = row.Tags_MR || row.tags_mr || '';
          const tagsHi = row.Tags_HI || row.tags_hi || '';

          return {
            className, classMr, classHi,
            mediumName, mediumMr, mediumHi,
            subjectName, subjectMr, subjectHi,
            title, titleMr, titleHi,
            url, coverUrl,
            description, descriptionMr, descriptionHi,
            tags, tagsMr, tagsHi
          };
        }).filter(v => v.className && v.mediumName && v.subjectName && v.title);

        if (mappedVideos.length === 0) {
          onError("No valid records found. Check columns for Class, Medium, Subject, Title, and URL.");
          return;
        }

        onProgress(75, `Uploading ${mappedVideos.length} video records to server...`);
        try {
          const res = await bulkUploadJSON(mappedVideos);
          onProgress(100, `Successfully imported ${mappedVideos.length} video lectures!`);
          if (onSuccess) onSuccess(`Successfully imported ${mappedVideos.length} video lectures!`);
          showNotificationPopup('success', res.msg || `Successfully imported ${mappedVideos.length} video lectures!`);
          loadData();
        } catch (err) {
          onError("Upload error: " + err.message);
          showNotificationPopup('error', "Failed to save records: " + err.message);
        }
      };

      if (extension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            let rows = results.data;
            if (rows.length > 0 && Object.keys(rows[0]).length <= 1) {
              Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: '|',
                complete: async (res) => {
                  await parseAndUploadRows(res.data);
                }
              });
            } else {
              await parseAndUploadRows(rows);
            }
          },
          error: (err) => {
            onError("Failed to parse CSV: " + err.message);
          }
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            await parseAndUploadRows(jsonData);
          } catch (err) {
            onError("Failed to parse Excel file: " + err.message);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        onError("Unsupported file format. Please select Excel (.xlsx, .xls) or CSV (.csv).");
      }
    } catch (e) {
      onError("Unexpected error: " + e.message);
    }
  };

  useEffect(() => {
    loadData();
    if (location.state && location.state.openAdd) {
      handleOpenAddForm();
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [videosData, subjectsData, mediumsData, classesData] = await Promise.all([
        getVideos(),
        getSubjects(),
        getMediums(),
        getClasses()
      ]);
      setVideos(videosData);
      setSubjects(subjectsData);
      setMediums(mediumsData);
      setClasses(classesData);
    } catch (err) {
      showNotificationPopup('error', 'Failed to fetch videos from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleMr('');
    setTitleHi('');
    setDescEn('');
    setDescMr('');
    setDescHi('');
    setVideoUrl('');
    setThumbnail('');
    setTags('');
    
    // Seed initial selections
    const firstClass = classes[0]?.id || '';
    setClassId(firstClass);
    
    const filteredMeds = mediums.filter(m => String(m.classId) === String(firstClass));
    const firstMed = filteredMeds[0]?.id || '';
    setMediumId(firstMed);

    const filteredSubs = subjects.filter(s => String(s.mediumId) === String(firstMed));
    setSubjectId(filteredSubs[0]?.id || '');
    
    setActiveLangTab('en');
    setShowForm(true);
  };

  const handleOpenEditForm = (vid) => {
    setEditingId(vid.id);
    setTitleEn(vid.translations?.en?.title || vid.title || '');
    setTitleMr(vid.translations?.mr?.title || '');
    setTitleHi(vid.translations?.hi?.title || '');
    setDescEn(vid.translations?.en?.description || vid.description || '');
    setDescMr(vid.translations?.mr?.description || '');
    setDescHi(vid.translations?.hi?.description || '');
    setVideoUrl(vid.url || '');
    setThumbnail(vid.thumbnail || '');
    setTags(vid.tags || '');
    setClassId(vid.classId || '');
    setMediumId(vid.mediumId || '');
    setSubjectId(vid.subjectId || '');
    setActiveLangTab('en');
    setShowForm(true);
  };

  // Helper to extract Youtube Video ID
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Auto-generate thumbnail when YouTube URL is entered
  const handleUrlChange = (val) => {
    setVideoUrl(val);
    const ytId = getYoutubeId(val);
    if (ytId) {
      setThumbnail(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
    }
  };

  // Auto-translate helpers
  const handleTitleEnBlur = async () => {
    if (titleEn && (!titleMr || !titleHi)) {
      setTranslating(true);
      try {
        const { mr, hi } = await autoTranslateFields(titleEn);
        if (!titleMr && mr) setTitleMr(mr);
        if (!titleHi && hi) setTitleHi(hi);
      } finally {
        setTranslating(false);
      }
    }
  };

  const handleDescEnBlur = async () => {
    if (descEn && (!descMr || !descHi)) {
      setTranslating(true);
      try {
        const { mr, hi } = await autoTranslateFields(descEn);
        if (!descMr && mr) setDescMr(mr);
        if (!descHi && hi) setDescHi(hi);
      } finally {
        setTranslating(false);
      }
    }
  };

  const handleAutoTranslateAll = async () => {
    if (!titleEn && !descEn) {
      showNotificationPopup('error', 'Please enter English title or description first.');
      return;
    }
    setTranslating(true);
    try {
      if (titleEn) {
        const { mr, hi } = await autoTranslateFields(titleEn);
        setTitleMr(mr);
        setTitleHi(hi);
      }
      if (descEn) {
        const { mr, hi } = await autoTranslateFields(descEn);
        setDescMr(mr);
        setDescHi(hi);
      }
      showNotificationPopup('success', '✨ Hindi and Marathi translations generated successfully!');
    } catch (err) {
      showNotificationPopup('error', 'Failed to generate translations.');
    } finally {
      setTranslating(false);
    }
  };

  // Chain selection triggers
  const handleClassChange = (newClassId) => {
    setClassId(newClassId);
    const filteredMeds = mediums.filter(m => String(m.classId) === String(newClassId));
    if (filteredMeds.length > 0) {
      setMediumId(filteredMeds[0].id);
      const filteredSubs = subjects.filter(s => String(s.mediumId) === String(filteredMeds[0].id));
      setSubjectId(filteredSubs[0]?.id || '');
    } else {
      setMediumId('');
      setSubjectId('');
    }
  };

  const handleMediumChange = (newMediumId) => {
    setMediumId(newMediumId);
    const filteredSubs = subjects.filter(s => String(s.mediumId) === String(newMediumId));
    setSubjectId(filteredSubs[0]?.id || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video lecture?')) {
      try {
        await deleteVideo(id);
        showNotificationPopup('success', 'Video deleted successfully!');
        loadData();
      } catch (err) {
        showNotificationPopup('error', 'Failed to delete video.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn) {
      showNotificationPopup('error', 'English title is required!');
      return;
    }
    if (!videoUrl) {
      showNotificationPopup('error', 'Video URL or link is required!');
      return;
    }
    if (!subjectId) {
      showNotificationPopup('error', 'Please select a Subject category!');
      return;
    }

    const payload = {
      title: titleEn,
      description: descEn,
      url: videoUrl,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      classId: classId,
      mediumId: mediumId,
      subjectId: subjectId,
      tags,
      translations: {
        en: { title: titleEn, description: descEn },
        mr: { title: titleMr || titleEn, description: descMr || descEn },
        hi: { title: titleHi || titleEn, description: descHi || descEn }
      }
    };

    try {
      if (editingId) {
        await updateVideo(editingId, payload);
        showNotificationPopup('success', 'Video details updated successfully!');
      } else {
        await addVideo(payload);
        showNotificationPopup('success', 'Video created successfully!');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to save video details.');
    }
  };

  const filteredVideos = videos.filter(vid => {
    const q = searchQuery.toLowerCase();
    const titleStrEn = (vid.translations?.en?.title || vid.title || '').toLowerCase();
    const titleStrMr = (vid.translations?.mr?.title || '').toLowerCase();
    const titleStrHi = (vid.translations?.hi?.title || '').toLowerCase();
    const descStr = (vid.description || '').toLowerCase();

    const cls = classes.find(c => String(c.id) === String(vid.classId));
    const med = mediums.find(m => String(m.id) === String(vid.mediumId));
    const sub = subjects.find(s => String(s.id) === String(vid.subjectId));

    const clsName = cls ? (cls.translations?.en?.name || cls.name || '').toLowerCase() : '';
    const medName = med ? (med.translations?.en?.name || med.name || '').toLowerCase() : '';
    const subName = sub ? (sub.translations?.en?.name || sub.name || '').toLowerCase() : '';

    return titleStrEn.includes(q) || titleStrMr.includes(q) || titleStrHi.includes(q) || descStr.includes(q) || clsName.includes(q) || medName.includes(q) || subName.includes(q);
  });

  // Smart name resolver with auto-mapping for common medium terms
  const getDisplayName = (item, lang, type = 'generic') => {
    const stored = lang === 'mr' ? item.translations?.mr?.name : lang === 'hi' ? item.translations?.hi?.name : null;
    const enName = item.translations?.en?.name || item.name || '';
    if (stored && stored !== enName) return stored;
    if (type === 'medium') {
      const key = enName.toLowerCase().trim();
      if (lang === 'mr') {
        if (key === 'english medium' || key === 'english') return 'इंग्रजी माध्यम';
        if (key === 'marathi medium' || key === 'marathi') return 'मराठी माध्यम';
        if (key === 'hindi medium' || key === 'hindi') return 'हिंदी माध्यम';
        if (key === 'semi english' || key === 'semi-english') return 'अर्ध इंग्रजी';
      }
      if (lang === 'hi') {
        if (key === 'english medium' || key === 'english') return 'अंग्रेजी माध्यम';
        if (key === 'marathi medium' || key === 'marathi') return 'मराठी माध्यम';
        if (key === 'hindi medium' || key === 'hindi') return 'हिंदी माध्यम';
        if (key === 'semi english' || key === 'semi-english') return 'अर्ध अंग्रेजी';
      }
    }
    return enName;
  };
  const classSelectOptions = classes.map(c => ({ value: c.id, label: getDisplayName(c, activeLangTab) }));
  const mediumSelectOptions = mediums.filter(m => String(m.classId) === String(classId)).map(m => ({ value: m.id, label: getDisplayName(m, activeLangTab, 'medium') }));
  const subjectSelectOptions = subjects.filter(s => String(s.mediumId) === String(mediumId)).map(s => ({ value: s.id, label: getDisplayName(s, activeLangTab) }));

  return (
    <div className="position-relative h-100 d-flex flex-column gap-4 animate-fade-in" style={{ overflow: 'hidden' }}>
      
      {/* Custom Notification Popup */}
      {notification && (
        <div
          className="position-fixed top-0 end-0 mt-4 me-4 p-3 rounded-3 shadow-lg d-flex align-items-center gap-3 animate-fade-in"
          style={{
            zIndex: 9999,
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderLeft: notification.type === 'success' ? '4px solid #10b981' : '4px solid #ef4444',
            borderTop: '1px solid var(--border-subtle)',
            borderRight: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            minWidth: '320px',
            maxWidth: '420px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease'
          }}
        >
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: notification.type === 'success' ? '#10b981' : '#ef4444'
            }}
          >
            {notification.type === 'success' ? '✓' : '✗'}
          </div>
          <div className="small fw-semibold flex-grow-1" style={{ color: 'var(--text-heading)' }}>
            {notification.message}
          </div>
          <button
            onClick={() => setNotification(null)}
            className="btn btn-sm p-0 border-0 flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="m-0 fw-extrabold" style={{ color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
            Videos Management
          </h2>
          <p className="text-muted-custom small m-0">
            Publish educational videos and link them to respective standard subjects
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelImport}
            style={{ display: 'none' }}
            accept=".xlsx,.xls,.csv"
          />
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn d-flex align-items-center gap-1 px-2 py-1.5 rounded-3 transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            <FileSpreadsheet size={15} className="text-success" />
            <span>Import XLSX</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="btn d-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-3 transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            <FileDown size={15} className="text-info" />
            <span>Template</span>
          </button>

          <button
            onClick={handleOpenAddForm}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-white border-0 fw-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
              boxShadow: 'var(--neon-blue-glow)',
              fontSize: '0.9rem'
            }}
          >
            <Plus size={16} />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="row g-4 flex-grow-1" style={{ overflow: 'hidden', minHeight: 0 }}>
        
        {/* Table List (Full width) */}
        <div className="col-12 d-flex flex-column" style={{ height: '100%', minHeight: 0 }}>
          
          {/* Search bar */}
          <div className="mb-3 position-relative">
            <Search size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--brand-secondary)' }} />
            <input
              type="text"
              placeholder="Search videos by title, tags, class, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control ps-5 py-2.5"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                paddingLeft: '2.75rem',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--brand-secondary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            />
          </div>

          {/* Table list */}
          <div
            className="border rounded-3 flex-grow-1 overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--glass-shadow)',
              minHeight: '200px'
            }}
          >
            {loading ? (
              <div className="d-flex align-items-center justify-content-center py-5 h-100">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead className="table-light" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Video Thumbnail</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Title</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Category Hierarchy</th>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVideos.map((vid) => {
                      const cls = classes.find(c => String(c.id) === String(vid.classId) || String(c.id) === String(vid.subject?.classId));
                      const med = mediums.find(m => String(m.id) === String(vid.mediumId) || String(m.id) === String(vid.subject?.mediumId));
                      const sub = subjects.find(s => String(s.id) === String(vid.subjectId));
                      return (
                        <tr key={vid.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td className="px-4 py-2.5">
                            <div className="rounded overflow-hidden bg-dark position-relative" style={{ width: '72px', height: '42px' }}>
                              <img
                                src={vid.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                className="w-100 h-100 object-fit-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80';
                                }}
                              />
                              <div className="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 rounded-circle p-1 d-flex align-items-center justify-content-center">
                                <VideoIcon size={10} />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 fw-bold text-heading">
                            <div className="d-flex flex-column text-truncate" style={{ maxWidth: '220px' }}>
                              <span className="text-truncate">{vid.translations?.en?.title || vid.title}</span>
                              <span className="text-muted-custom font-normal text-truncate" style={{ fontSize: '0.68rem' }}>
                                URL: {vid.url}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="d-flex flex-column gap-1">
                              <span className="badge px-2 py-0.5 rounded text-start w-fit bg-primary-subtle text-primary" style={{ fontSize: '0.65rem', width: 'fit-content' }}>
                                Class: {cls ? (cls.translations?.en?.name || cls.name) : 'Unknown Class'}
                              </span>
                              <span className="badge px-2 py-0.5 rounded text-start w-fit bg-success-subtle text-success" style={{ fontSize: '0.65rem', width: 'fit-content' }}>
                                Medium: {med ? (med.translations?.en?.name || med.name) : 'Unknown Medium'}
                              </span>
                              <span className="badge px-2 py-0.5 rounded text-start w-fit bg-warning-subtle text-warning" style={{ fontSize: '0.65rem', width: 'fit-content' }}>
                                Subject: {sub ? (sub.translations?.en?.name || sub.name) : 'Unknown Subject'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-end">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <button
                                onClick={() => handleOpenEditForm(vid)}
                                className="btn btn-sm btn-light p-2 rounded-circle"
                                style={{ color: 'var(--brand-secondary)' }}
                                title="Edit Video"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(vid.id)}
                                className="btn btn-sm btn-light p-2 rounded-circle text-danger"
                                title="Delete Video"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 h-100 text-muted">
                <span>No video lectures published. Click Upload Video to add files or links.</span>
              </div>
            )}
          </div>
        </div>



        {/* Centered Popup Form Modal with Blurred Background */}
        {showForm && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
            style={{
              backgroundColor: 'rgba(15, 12, 30, 0.4)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1050,
              padding: '20px'
            }}
          >
            <div
              className="animate-zoom-in w-100 rounded-4 p-4 border d-flex flex-column"
              style={{
                maxWidth: '600px',
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                maxHeight: '90vh',
                overflow: 'hidden'
              }}
            >
              {/* Form Header */}
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <h5 className="m-0 fw-extrabold text-heading">
                  {editingId ? 'Edit Video Details' : 'Upload Video Lecture'}
                </h5>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-light btn-sm p-1 rounded-circle border-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Language Navigation Tabs */}
              <div className="d-flex p-1 rounded-pill mb-3" style={{ backgroundColor: 'var(--search-bg)' }}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'mr', label: 'मराठी (Marathi)' },
                  { code: 'hi', label: 'हिंदी (Hindi)' }
                ].map((tab) => (
                  <button
                    key={tab.code}
                    type="button"
                    onClick={() => setActiveLangTab(tab.code)}
                    className="flex-grow-1 btn btn-sm py-2 px-3 rounded-pill border-0 d-flex align-items-center justify-content-center gap-1.5"
                    style={{
                      backgroundColor: activeLangTab === tab.code ? 'var(--bg-secondary)' : 'transparent',
                      color: activeLangTab === tab.code ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      fontWeight: activeLangTab === tab.code ? '700' : '500',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Globe size={12} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 overflow-y-auto pr-1 flex-grow-1" style={{ minHeight: 0 }}>
                
                {/* Chained Selection Dropdowns */}
                <div className="row g-2">
                  <div className="col-12">
                    <CustomSelect
                      label="Class"
                      options={classSelectOptions}
                      value={classId}
                      onChange={handleClassChange}
                      placeholder="Select Class"
                      showSearch={false}
                    />
                  </div>
                  <div className="col-6">
                    <CustomSelect
                      label="Medium"
                      options={mediumSelectOptions}
                      value={mediumId}
                      onChange={handleMediumChange}
                      placeholder="Select Medium"
                      disabled={!classId || mediumSelectOptions.length === 0}
                      showSearch={false}
                    />
                  </div>
                  <div className="col-6">
                    <CustomSelect
                      label="Subject"
                      options={subjectSelectOptions}
                      value={subjectId}
                      onChange={setSubjectId}
                      placeholder="Select Subject"
                      disabled={!mediumId || subjectSelectOptions.length === 0}
                      showSearch={false}
                    />
                  </div>
                </div>

                {/* Translatable Fields */}
                {activeLangTab === 'en' && (
                  <>
                    <div className="d-flex align-items-center justify-content-between p-2.5 rounded-3" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px dashed var(--brand-secondary)' }}>
                      <div className="d-flex align-items-center gap-2 small" style={{ color: 'var(--brand-primary)' }}>
                        <span style={{ fontSize: '1.1rem' }}>✨</span>
                        <span className="fw-semibold">Auto-generate Marathi & Hindi text</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoTranslateAll}
                        disabled={translating || (!titleEn && !descEn)}
                        className="btn btn-sm px-3 py-1.5 rounded-pill text-white fw-bold d-flex align-items-center gap-1.5 transition-all"
                        style={{
                          background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
                          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                          fontSize: '0.75rem',
                          opacity: (!titleEn && !descEn) ? 0.6 : 1
                        }}
                      >
                        {translating ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status" style={{ width: '12px', height: '12px' }} />
                            <span>Translating...</span>
                          </>
                        ) : (
                          <>
                            <span>Auto-Translate Now</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Video Title (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Intro to Trigonometry"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        onBlur={handleTitleEnBlur}
                        className="form-control rounded-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Description (English)</label>
                      <textarea
                        rows={3}
                        placeholder="Write a brief overview of topics discussed in this video..."
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        onBlur={handleDescEnBlur}
                        className="form-control rounded-3"
                      />
                    </div>
                  </>
                )}

                {activeLangTab === 'mr' && (
                  <>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span className="small text-success fw-semibold">💡 You can change or edit the auto-generated Marathi text below</span>
                    </div>
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Video Title (Marathi)</label>
                      <input
                        type="text"
                        placeholder="उदा. त्रिकोणमितीची ओळख"
                        value={titleMr}
                        onChange={(e) => setTitleMr(e.target.value)}
                        className="form-control rounded-3"
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Description (Marathi)</label>
                      <textarea
                        rows={3}
                        placeholder="व्हिडिओचे वर्णन प्रविष्ट करा"
                        value={descMr}
                        onChange={(e) => setDescMr(e.target.value)}
                        className="form-control rounded-3"
                      />
                    </div>
                  </>
                )}

                {activeLangTab === 'hi' && (
                  <>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <span className="small text-warning fw-semibold">💡 You can change or edit the auto-generated Hindi text below</span>
                    </div>
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Video Title (Hindi)</label>
                      <input
                        type="text"
                        placeholder="जैसे: त्रिकोणमिति का परिचय"
                        value={titleHi}
                        onChange={(e) => setTitleHi(e.target.value)}
                        className="form-control rounded-3"
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Description (Hindi)</label>
                      <textarea
                        rows={3}
                        placeholder="वीडियो का विवरण दर्ज करें"
                        value={descHi}
                        onChange={(e) => setDescHi(e.target.value)}
                        className="form-control rounded-3"
                      />
                    </div>
                  </>
                )}

                {/* Video Resource Details */}
                <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <label className="form-label small fw-semibold text-heading mb-1">Video Link or YouTube URL</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted small" style={{ borderColor: 'var(--input-border)' }}>
                        <YoutubeIconCustom size={16} className="text-danger" />
                      </span>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className="form-control"
                        style={{ borderColor: 'var(--input-border)' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <label className="form-label small fw-semibold text-heading mb-1">Thumbnail Cover URL (Auto-Generated or Manual)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted small" style={{ borderColor: 'var(--input-border)' }}>
                        <Image size={16} />
                      </span>
                      <input
                        type="url"
                        placeholder="Thumbnail image URL"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="form-control"
                        style={{ borderColor: 'var(--input-border)' }}
                      />
                    </div>
                  </div>

                  {thumbnail && (
                    <div className="mt-2.5 text-center p-2 rounded bg-light" style={{ border: '1px dashed var(--border-subtle)', backgroundColor: 'var(--bg-primary)' }}>
                      <span className="text-muted-custom d-block mb-1" style={{ fontSize: '0.65rem' }}>Autoloaded Thumbnail Preview</span>
                      <img
                        src={thumbnail}
                        alt="Preview"
                        className="rounded"
                        style={{ height: '80px', width: '135px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-2.5">
                    <label className="form-label small fw-semibold text-heading mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. math, geometry, trigonometry"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="form-control rounded-3"
                    />
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="d-flex gap-2.5 mt-auto pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-grow-1 btn btn-light py-2 rounded-3 small fw-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow-1 btn text-white py-2 rounded-3 small fw-bold border-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
                      boxShadow: 'var(--neon-blue-glow)'
                    }}
                  >
                    {editingId ? 'Save Changes' : 'Upload Video'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Upload XLSX / CSV Modal */}
        {showUploadModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
            style={{
              backgroundColor: 'rgba(15, 12, 30, 0.4)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1050,
              padding: '20px'
            }}
          >
            <div
              className="animate-zoom-in w-100 rounded-4 p-4 border d-flex flex-column"
              style={{
                maxWidth: '650px',
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                maxHeight: '90vh',
                overflow: 'hidden'
              }}
            >
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div>
                  <h5 className="m-0 fw-extrabold text-heading">Upload Video Lectures (XLSX / CSV)</h5>
                  <p className="small text-muted m-0 mt-0.5">Batch import spreadsheet files with live validation and progress feedback</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-light btn-sm p-1 rounded-circle border-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-grow-1 pr-1" style={{ minHeight: 0 }}>
                <FileUploadProgressFill
                  onUploadFile={handleFileUploadWithProgress}
                  accept=".xlsx,.xls,.csv"
                  title="Click or drag and drop spreadsheet files"
                  subtitle="Excel (.xlsx, .xls) or CSV (.csv) files up to 10 MB"
                />
              </div>

              <div className="d-flex justify-content-end mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn px-4 py-2 rounded-3 small fw-bold"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
