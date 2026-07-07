import React, { useEffect, useState, useRef } from 'react';
import { getTests, addTest, updateTest, deleteTest, getClasses, getMediums, getSubjects, getVideos, bulkUploadTestsJSON } from '../../services/adminService';
import CustomSelect from '../../components/ui/CustomSelect';
import { Search, Plus, Edit2, Trash2, X, Globe, FileText, Link, HelpCircle, Upload, FileSpreadsheet, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function TestQuizManagement() {
  const [tests, setTests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('en'); // en, mr, hi

  // Fields
  const [titleEn, setTitleEn] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [classId, setClassId] = useState('');
  const [mediumId, setMediumId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  
  const [testType, setTestType] = useState('subject'); // subject, video
  const [videoId, setVideoId] = useState('');
  const [optionType, setOptionType] = useState('pdf'); // pdf, google_form, mcq
  
  const [pdfUrlEn, setPdfUrlEn] = useState('');
  const [pdfUrlMr, setPdfUrlMr] = useState('');
  const [pdfUrlHi, setPdfUrlHi] = useState('');
  
  const [googleFormUrlEn, setGoogleFormUrlEn] = useState('');
  const [googleFormUrlMr, setGoogleFormUrlMr] = useState('');
  const [googleFormUrlHi, setGoogleFormUrlHi] = useState('');
  
  // MCQ Questions array: { question: {en, mr, hi}, options: {en: [], mr: [], hi: []}, correctIndex: 0 }
  const [questions, setQuestions] = useState([]);

  const fileInputRef = useRef(null);

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
        Title: 'Math Assessment 1', Title_MR: 'गणित चाचणी 1', Title_HI: 'गणित परीक्षा 1',
        Option_Type: 'pdf',
        PDF_URL: 'https://example.com/test.pdf', PDF_URL_MR: '', PDF_URL_HI: '',
        Form_URL: '', Form_URL_MR: '', Form_URL_HI: ''
      },
      {
        Class: 'Class 10', Class_MR: '', Class_HI: '',
        Medium: 'English Medium', Medium_MR: '', Medium_HI: '',
        Subject: 'Science', Subject_MR: '', Subject_HI: '',
        Title: 'Science Quiz', Title_MR: '', Title_HI: '',
        Option_Type: 'google_form',
        PDF_URL: '', PDF_URL_MR: '', PDF_URL_HI: '',
        Form_URL: 'https://forms.gle/xyz', Form_URL_MR: '', Form_URL_HI: ''
      }
    ];
    // Sheet 2: Guidelines
    const guideData = [
      { Column: 'Class', Required: 'YES', 'Example Value': 'Class 9', Notes: 'Must exactly match the class name in the system (English name)' },
      { Column: 'Class_MR', Required: 'NO', 'Example Value': 'इयत्ता ९ वी', Notes: 'Class name in Marathi' },
      { Column: 'Class_HI', Required: 'NO', 'Example Value': 'कक्षा 9', Notes: 'Class name in Hindi' },
      { Column: 'Medium', Required: 'YES', 'Example Value': 'English Medium', Notes: 'Must exactly match the medium name in the system' },
      { Column: 'Subject', Required: 'YES', 'Example Value': 'Mathematics', Notes: 'Must exactly match the subject name in the system' },
      { Column: 'Title', Required: 'YES', 'Example Value': 'Math Assessment 1', Notes: 'Test title in English' },
      { Column: 'Option_Type', Required: 'YES', 'Example Value': 'pdf OR google_form', Notes: 'Type of the test' },
      { Column: 'PDF_URL', Required: 'NO', 'Example Value': 'https://...', Notes: 'URL of the PDF (Required if Option_Type is pdf)' },
      { Column: 'Form_URL', Required: 'NO', 'Example Value': 'https://...', Notes: 'URL of the Google Form (Required if Option_Type is google_form)' },
      { Column: '', Required: '', 'Example Value': '', Notes: '' },
      { Column: '⚠️ IMPORTANT RULES', Required: '', 'Example Value': '', Notes: '' },
      { Column: '1. Class, Medium, Subject must EXACTLY match English names in the system.', Required: '', 'Example Value': '', Notes: '' }
    ];
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(templateData);
    const ws2 = XLSX.utils.json_to_sheet(guideData);
    ws1['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 18 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 45 }, { wch: 35 }, { wch: 35 }, { wch: 35 }];
    ws2['!cols'] = [{ wch: 65 }, { wch: 10 }, { wch: 40 }, { wch: 55 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Test Import Template');
    XLSX.utils.book_append_sheet(wb, ws2, 'Guidelines');
    XLSX.writeFile(wb, 'Dasvi_Test_Import_Template.xlsx');
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
    
    e.target.value = '';
  };

  const processParsedRows = async (rows) => {
    const mappedTests = rows.map(row => {
      const className = row.Class || row.class || '';
      const classMr = row.Class_MR || row.class_mr || '';
      const classHi = row.Class_HI || row.class_hi || '';
      const mediumName = row.Medium || row.medium || '';
      const mediumMr = row.Medium_MR || row.medium_mr || '';
      const mediumHi = row.Medium_HI || row.medium_hi || '';
      const subjectName = row.Subject || row.subject || '';
      const subjectMr = row.Subject_MR || row.subject_mr || '';
      const subjectHi = row.Subject_HI || row.subject_hi || '';
      const titleEn = row.Title || row.title || '';
      const titleMr = row.Title_MR || row.title_mr || '';
      const titleHi = row.Title_HI || row.title_hi || '';
      const optionType = (row.Option_Type || row.option_type || 'pdf').toLowerCase();
      const pdfUrlEn = row.PDF_URL || row.pdf_url || '';
      const pdfUrlMr = row.PDF_URL_MR || row.pdf_url_mr || '';
      const pdfUrlHi = row.PDF_URL_HI || row.pdf_url_hi || '';
      const googleFormUrlEn = row.Form_URL || row.form_url || '';
      const googleFormUrlMr = row.Form_URL_MR || row.form_url_mr || '';
      const googleFormUrlHi = row.Form_URL_HI || row.form_url_hi || '';

      return {
        className, classMr, classHi,
        mediumName, mediumMr, mediumHi,
        subjectName, subjectMr, subjectHi,
        titleEn, titleMr, titleHi,
        optionType,
        pdfUrlEn, pdfUrlMr, pdfUrlHi,
        googleFormUrlEn, googleFormUrlMr, googleFormUrlHi
      };
    }).filter(t => t.className && t.mediumName && t.subjectName && t.titleEn);

    if (mappedTests.length === 0) {
      showNotificationPopup('error', 'No valid rows found. Check columns for Class, Medium, Subject, and Title.');
      return;
    }

    try {
      setLoading(true);
      const res = await bulkUploadTestsJSON(mappedTests);
      showNotificationPopup('success', res.msg || 'Import completed successfully!');
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to import file content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotificationPopup = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [testsData, classesData, mediumsData, subjectsData, videosData] = await Promise.all([
        getTests(),
        getClasses(),
        getMediums(),
        getSubjects(),
        getVideos()
      ]);
      setTests(testsData);
      setClasses(classesData);
      setMediums(mediumsData);
      setSubjects(subjectsData);
      setVideos(videosData);
    } catch (err) {
      showNotificationPopup('error', 'Failed to fetch test/quiz database.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleMr('');
    setTitleHi('');
    const firstClass = classes[0]?.id || '';
    setClassId(firstClass);
    
    const filteredMeds = mediums.filter(m => String(m.classId) === String(firstClass));
    const firstMed = filteredMeds[0]?.id || '';
    setMediumId(firstMed);

    const filteredSubs = subjects.filter(s => String(s.mediumId) === String(firstMed));
    setSubjectId(filteredSubs[0]?.id || '');
    
    setTestType('subject');
    setVideoId('');
    setOptionType('pdf');
    setPdfUrlEn('');
    setPdfUrlMr('');
    setPdfUrlHi('');
    setGoogleFormUrlEn('');
    setGoogleFormUrlMr('');
    setGoogleFormUrlHi('');
    setQuestions([]);
    setActiveLangTab('en');
    setShowForm(true);
  };

  const handleOpenEditForm = (tst) => {
    setEditingId(tst.id);
    setTitleEn(tst.translations?.en?.title || tst.title || '');
    setTitleMr(tst.translations?.mr?.title || '');
    setTitleHi(tst.translations?.hi?.title || '');
    setClassId(tst.classId || '');
    setMediumId(tst.mediumId || '');
    setSubjectId(tst.subjectId || '');
    setTestType(tst.type || 'subject');
    setVideoId(tst.videoId || '');
    setOptionType(tst.optionType || 'pdf');
    setPdfUrlEn(tst.translations?.en?.pdfUrl || tst.pdfUrl || '');
    setPdfUrlMr(tst.translations?.mr?.pdfUrl || '');
    setPdfUrlHi(tst.translations?.hi?.pdfUrl || '');
    setGoogleFormUrlEn(tst.translations?.en?.googleFormUrl || tst.googleFormUrl || '');
    setGoogleFormUrlMr(tst.translations?.mr?.googleFormUrl || '');
    setGoogleFormUrlHi(tst.translations?.hi?.googleFormUrl || '');
    setQuestions(tst.questions || []);
    setActiveLangTab('en');
    setShowForm(true);
  };

  // Selection handlers
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

  // MCQ manual generation methods
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: { en: '', mr: '', hi: '' },
      options: {
        en: ['', '', '', ''],
        mr: ['', '', '', ''],
        hi: ['', '', '', '']
      },
      correctIndex: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (idx) => {
    const updated = [...questions];
    updated.splice(idx, 1);
    setQuestions(updated);
  };

  const handleQuestionTextChange = (qIdx, lang, value) => {
    const updated = [...questions];
    updated[qIdx].question[lang] = value;
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIdx, lang, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[lang][optIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectIndexChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].correctIndex = Number(value);
    setQuestions(updated);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await deleteTest(id);
        showNotificationPopup('success', 'Test deleted successfully!');
        loadData();
      } catch (err) {
        showNotificationPopup('error', 'Failed to delete test.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn) {
      showNotificationPopup('error', 'English Title is required!');
      return;
    }
    if (testType === 'video' && !videoId) {
      showNotificationPopup('error', 'Please select a Video lecture link!');
      return;
    }
    if (optionType === 'pdf' && !pdfUrlEn) {
      showNotificationPopup('error', 'Please enter a valid English PDF resource URL!');
      return;
    }
    if (optionType === 'google_form' && !googleFormUrlEn) {
      showNotificationPopup('error', 'Please enter an English Google Form URL!');
      return;
    }
    if (optionType === 'mcq' && questions.length === 0) {
      showNotificationPopup('error', 'Please generate at least 1 manual MCQ question!');
      return;
    }

    const payload = {
      title: titleEn,
      classId: classId,
      mediumId: mediumId,
      subjectId: subjectId,
      type: testType,
      videoId: testType === 'video' ? videoId : null,
      optionType,
      pdfUrl: optionType === 'pdf' ? pdfUrlEn : '',
      googleFormUrl: optionType === 'google_form' ? googleFormUrlEn : '',
      questions: optionType === 'mcq' ? questions : [],
      translations: {
        en: {
          title: titleEn,
          pdfUrl: optionType === 'pdf' ? pdfUrlEn : '',
          googleFormUrl: optionType === 'google_form' ? googleFormUrlEn : ''
        },
        mr: {
          title: titleMr ? titleMr.trim() : '',
          pdfUrl: optionType === 'pdf' ? (pdfUrlMr ? pdfUrlMr.trim() : '') : '',
          googleFormUrl: optionType === 'google_form' ? (googleFormUrlMr ? googleFormUrlMr.trim() : '') : ''
        },
        hi: {
          title: titleHi ? titleHi.trim() : '',
          pdfUrl: optionType === 'pdf' ? (pdfUrlHi ? pdfUrlHi.trim() : '') : '',
          googleFormUrl: optionType === 'google_form' ? (googleFormUrlHi ? googleFormUrlHi.trim() : '') : ''
        }
      }
    };

    try {
      if (editingId) {
        await updateTest(editingId, payload);
        showNotificationPopup('success', 'Test details updated successfully!');
      } else {
        await addTest(payload);
        showNotificationPopup('success', 'Test created successfully!');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to save test details.');
    }
  };

  // Filter video dropdown based on Class/Medium/Subject selection
  const getFilteredVideoOptions = () => {
    return videos
      .filter(v => String(v.classId) === String(classId) && String(v.mediumId) === String(mediumId) && String(v.subjectId) === String(subjectId))
      .map(v => ({ value: v.id, label: v.translations?.en?.title || v.title }));
  };

  const filteredTests = tests.filter(t => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (t.title || '').toLowerCase().includes(q);
    const cls = classes.find(c => String(c.id) === String(t.classId));
    const sub = subjects.find(s => String(s.id) === String(t.subjectId));
    const clsMatch = cls ? (cls.translations?.en?.name || cls.name || '').toLowerCase().includes(q) : false;
    const subMatch = sub ? (sub.translations?.en?.name || sub.name || '').toLowerCase().includes(q) : false;
    return titleMatch || clsMatch || subMatch;
  });

  const classSelectOptions = classes.map(c => ({ value: c.id, label: c.translations?.en?.name || c.name }));
  const mediumSelectOptions = mediums.filter(m => String(m.classId) === String(classId)).map(m => ({ value: m.id, label: m.translations?.en?.name || m.name }));
  const subjectSelectOptions = subjects.filter(s => String(s.mediumId) === String(mediumId)).map(s => ({ value: s.id, label: s.translations?.en?.name || s.name }));
  const videoSelectOptions = getFilteredVideoOptions();

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
            Tests & Quizzes
          </h2>
          <p className="text-muted-custom small m-0">
            Publish assessment material including PDFs, external forms, and manual MCQs
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
            onClick={triggerFileSelect}
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
            <span>Import</span>
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
            <span>Create Test</span>
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="row g-4 flex-grow-1" style={{ overflow: 'hidden', minHeight: 0 }}>
        
        {/* Table of Tests (Full width) */}
        <div className="col-12 d-flex flex-column" style={{ height: '100%', minHeight: 0 }}>
          
          {/* Search */}
          <div className="mb-3 position-relative">
            <Search size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--brand-secondary)' }} />
            <input
              type="text"
              placeholder="Search tests by title, standard grade, subject..."
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

          {/* Table */}
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
            ) : filteredTests.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead className="table-light" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Test Title</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Type</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Option</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Syllabus Scope</th>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((tst) => {
                      const cls = classes.find(c => String(c.id) === String(tst.classId));
                      const sub = subjects.find(s => String(s.id) === String(tst.subjectId));
                      return (
                        <tr key={tst.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td className="px-4 py-2.5 fw-bold text-heading">{tst.title}</td>
                          <td className="px-3 py-2.5">
                            <span className={`badge px-2.5 py-1 rounded small ${tst.type === 'video' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info'}`} style={{ fontSize: '0.7rem' }}>
                              {tst.type === 'video' ? 'Video-based' : 'Subject-based'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="d-inline-flex align-items-center gap-1 text-muted-custom small" style={{ fontSize: '0.7rem' }}>
                              {tst.optionType === 'pdf' && <><FileText size={12} className="text-danger" /><span>PDF File</span></>}
                              {tst.optionType === 'google_form' && <><Link size={12} className="text-primary" /><span>Google Form</span></>}
                              {tst.optionType === 'mcq' && <><HelpCircle size={12} className="text-success" /><span>{tst.questions?.length || 0} MCQs</span></>}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="badge px-2 py-0.5 rounded bg-light text-dark small" style={{ fontSize: '0.7rem' }}>
                              {cls ? (cls.translations?.en?.name || cls.name) : 'Unknown Class'} • {sub ? (sub.translations?.en?.name || sub.name) : 'Unknown Subject'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-end">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <button
                                onClick={() => handleOpenEditForm(tst)}
                                className="btn btn-sm btn-light p-2 rounded-circle"
                                style={{ color: 'var(--brand-secondary)' }}
                                title="Edit Test"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(tst.id)}
                                className="btn btn-sm btn-light p-2 rounded-circle text-danger"
                                title="Delete Test"
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
                <span>No tests configured. Click Create Test on the top right.</span>
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
                maxWidth: '650px',
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
                  {editingId ? 'Edit Test Details' : 'Create Assessment'}
                </h5>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-light btn-sm p-1 rounded-circle border-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 overflow-y-auto pr-1 flex-grow-1" style={{ minHeight: 0 }}>
                
                {/* Language tabs */}
                <div className="d-flex p-1 rounded-pill" style={{ backgroundColor: 'var(--search-bg)' }}>
                  {[
                    { code: 'en', label: 'English (Default)' },
                    { code: 'mr', label: 'मराठी (Marathi)' },
                    { code: 'hi', label: 'हिंदी (Hindi)' }
                  ].map((t) => (
                    <button
                      key={t.code}
                      type="button"
                      onClick={() => setActiveLangTab(t.code)}
                      className="flex-grow-1 btn btn-sm py-1.5 rounded-pill border-0"
                      style={{
                        backgroundColor: activeLangTab === t.code ? 'var(--bg-secondary)' : 'transparent',
                        color: activeLangTab === t.code ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <label className="form-label small fw-semibold text-heading mb-1">
                    Test Title ({activeLangTab.toUpperCase()})
                  </label>
                  {activeLangTab === 'en' ? (
                    <input
                      type="text"
                      placeholder="e.g. Geometry Chapter 1 Quiz"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="form-control rounded-3"
                      required
                    />
                  ) : activeLangTab === 'mr' ? (
                    <input
                      type="text"
                      placeholder="उदा. भूमिती धडा १ परीक्षा (पर्यायी)"
                      value={titleMr}
                      onChange={(e) => setTitleMr(e.target.value)}
                      className="form-control rounded-3"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="उदा. ज्यामिति अध्याय 1 प्रश्नोत्तरी (वैकल्पिक)"
                      value={titleHi}
                      onChange={(e) => setTitleHi(e.target.value)}
                      className="form-control rounded-3"
                    />
                  )}
                </div>

                {/* Scope dropdowns */}
                <div className="row g-2">
                  <div className="col-12">
                    <CustomSelect
                      label="Assigned Class"
                      options={classSelectOptions}
                      value={classId}
                      onChange={handleClassChange}
                      placeholder="Select Class"
                      showSearch={false}
                    />
                  </div>
                  <div className="col-6">
                    <CustomSelect
                      label="Assigned Medium"
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
                      label="Assigned Subject"
                      options={subjectSelectOptions}
                      value={subjectId}
                      onChange={setSubjectId}
                      placeholder="Select Subject"
                      disabled={!mediumId || subjectSelectOptions.length === 0}
                      showSearch={false}
                    />
                  </div>
                </div>

                {/* Conditional test scope type */}
                <div className="row g-2 border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="col-6">
                    <CustomSelect
                      label="Test Evaluation Scope"
                      options={[
                        { value: 'subject', label: 'Subject / Chapter based' },
                        { value: 'video', label: 'Video Lecture based' }
                      ]}
                      value={testType}
                      onChange={setTestType}
                      showSearch={false}
                    />
                  </div>

                  <div className="col-6">
                    <CustomSelect
                      label="Linked Video Lecture"
                      options={videoSelectOptions}
                      value={videoId}
                      onChange={setVideoId}
                      placeholder={testType === 'video' ? "Choose Video" : "Scope: Subject"}
                      disabled={testType !== 'video' || videoSelectOptions.length === 0}
                      showSearch={true}
                    />
                  </div>
                </div>

                {/* Quiz Option Type */}
                <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <label className="form-label small fw-semibold text-heading mb-1.5">Quiz Mode</label>
                  <div className="d-flex gap-2">
                    {[
                      { code: 'pdf', label: 'Upload PDF Worksheet' },
                      { code: 'google_form', label: 'Google Form Link' },
                      { code: 'mcq', label: 'Manual MCQs' }
                    ].map((mode) => (
                      <button
                        key={mode.code}
                        type="button"
                        onClick={() => setOptionType(mode.code)}
                        className="flex-grow-1 btn btn-sm py-2 px-2.5 rounded-3 border transition-colors"
                        style={{
                          backgroundColor: optionType === mode.code ? 'var(--brand-accent)' : 'transparent',
                          color: optionType === mode.code ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          borderColor: optionType === mode.code ? 'var(--brand-primary)' : 'var(--input-border)',
                          fontWeight: '600',
                          fontSize: '0.75rem'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Fields based on Option Type */}
                <div className="p-3 rounded bg-light border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                  
                  {optionType === 'pdf' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">
                        Worksheet PDF URL ({activeLangTab.toUpperCase()})
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white text-danger font-semibold">PDF</span>
                        {activeLangTab === 'en' ? (
                          <input
                            type="url"
                            placeholder="https://example.com/worksheets/science1_en.pdf"
                            value={pdfUrlEn}
                            onChange={(e) => setPdfUrlEn(e.target.value)}
                            className="form-control"
                            required
                          />
                        ) : activeLangTab === 'mr' ? (
                          <input
                            type="url"
                            placeholder="https://example.com/worksheets/science1_mr.pdf (optional)"
                            value={pdfUrlMr}
                            onChange={(e) => setPdfUrlMr(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          <input
                            type="url"
                            placeholder="https://example.com/worksheets/science1_hi.pdf (optional)"
                            value={pdfUrlHi}
                            onChange={(e) => setPdfUrlHi(e.target.value)}
                            className="form-control"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {optionType === 'google_form' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">
                        Google Form URL ({activeLangTab.toUpperCase()})
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white text-primary font-semibold">Form</span>
                        {activeLangTab === 'en' ? (
                          <input
                            type="url"
                            placeholder="https://docs.google.com/forms/d/e/...en"
                            value={googleFormUrlEn}
                            onChange={(e) => setGoogleFormUrlEn(e.target.value)}
                            className="form-control"
                            required
                          />
                        ) : activeLangTab === 'mr' ? (
                          <input
                            type="url"
                            placeholder="https://docs.google.com/forms/d/e/...mr (optional)"
                            value={googleFormUrlMr}
                            onChange={(e) => setGoogleFormUrlMr(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          <input
                            type="url"
                            placeholder="https://docs.google.com/forms/d/e/...hi (optional)"
                            value={googleFormUrlHi}
                            onChange={(e) => setGoogleFormUrlHi(e.target.value)}
                            className="form-control"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {optionType === 'mcq' && (
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="small fw-bold text-heading">MCQ Questions ({questions.length})</span>
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1.5"
                          style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}
                        >
                          <Plus size={14} />
                          <span>Add Question</span>
                        </button>
                      </div>



                      {/* Questions List */}
                      <div className="d-flex flex-column gap-3 overflow-y-auto" style={{ maxHeight: '250px' }}>
                        {questions.map((q, qIdx) => (
                          <div key={q.id} className="p-3 bg-white rounded border border-light shadow-sm position-relative d-flex flex-column gap-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            
                            {/* Question Title & Delete */}
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span className="small font-bold text-muted-custom">Q{qIdx + 1} ({activeLangTab.toUpperCase()})</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(qIdx)}
                                className="btn btn-sm p-1 border-0 text-danger"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Question Text */}
                            <div>
                              <input
                                type="text"
                                placeholder={`Enter question text in ${activeLangTab}`}
                                value={q.question[activeLangTab] || ''}
                                onChange={(e) => handleQuestionTextChange(qIdx, activeLangTab, e.target.value)}
                                className="form-control form-control-sm"
                                required
                              />
                            </div>

                            {/* Option list */}
                            <div className="d-flex flex-column gap-1.5 mt-1">
                              {[0, 1, 2, 3].map((optIdx) => (
                                <div key={optIdx} className="input-group input-group-sm">
                                  <span className="input-group-text bg-light text-muted" style={{ fontSize: '0.75rem' }}>
                                    Opt {optIdx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    placeholder={`Option ${optIdx + 1} in ${activeLangTab}`}
                                    value={q.options[activeLangTab]?.[optIdx] || ''}
                                    onChange={(e) => handleOptionTextChange(qIdx, activeLangTab, optIdx, e.target.value)}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Correct Index Choice */}
                            <div className="mt-2">
                              <CustomSelect
                                label="Correct Option"
                                options={[
                                  { value: 0, label: 'Option 1' },
                                  { value: 1, label: 'Option 2' },
                                  { value: 2, label: 'Option 3' },
                                  { value: 3, label: 'Option 4' }
                                ]}
                                value={q.correctIndex}
                                onChange={(val) => handleCorrectIndexChange(qIdx, val)}
                                showSearch={false}
                              />
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>

                {/* Footer Buttons */}
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
                    {editingId ? 'Save Changes' : 'Create Test'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
