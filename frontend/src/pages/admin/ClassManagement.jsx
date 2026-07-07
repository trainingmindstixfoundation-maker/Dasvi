import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  getClasses, 
  addClass, 
  updateClass, 
  deleteClass,
  getMediums,
  addMedium,
  getSubjects,
  addSubject,
  addVideo
} from '../../services/adminService';
import { Search, Plus, Edit2, Trash2, X, Globe, Image } from 'lucide-react';

export default function ClassManagement() {
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom notification popup state
  const [notification, setNotification] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('en'); // en, mr, hi

  // Wizard state (for creating a new class)
  const [wizardStep, setWizardStep] = useState(1); // 1: Class details, 2: Add Medium, 3: Add Video & Subject
  const [createdClassId, setCreatedClassId] = useState(null);
  const [createdClassName, setCreatedClassName] = useState('');
  const [createdMediumId, setCreatedMediumId] = useState(null);
  const [createdMediumName, setCreatedMediumName] = useState('');

  // Translatable fields for Class
  const [nameEn, setNameEn] = useState('');
  const [nameMr, setNameMr] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descMr, setDescMr] = useState('');
  const [descHi, setDescHi] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  // Per-language cover images
  const [imageEn, setImageEn] = useState('');
  const [imageMr, setImageMr] = useState('');
  const [imageHi, setImageHi] = useState('');

  // Step 2: Medium inputs (multilingual)
  const [mediumLangTab, setMediumLangTab] = useState('en');
  const [mediumNameEn, setMediumNameEn] = useState('');
  const [mediumNameMr, setMediumNameMr] = useState('');
  const [mediumNameHi, setMediumNameHi] = useState('');

  // Step 3: Subject & Video inputs (multilingual)
  const [videoLangTab, setVideoLangTab] = useState('en');
  const [subjectNameEn, setSubjectNameEn] = useState('');
  const [subjectNameMr, setSubjectNameMr] = useState('');
  const [subjectNameHi, setSubjectNameHi] = useState('');
  const [videoTitleEn, setVideoTitleEn] = useState('');
  const [videoTitleMr, setVideoTitleMr] = useState('');
  const [videoTitleHi, setVideoTitleHi] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescEn, setVideoDescEn] = useState('');
  const [videoDescMr, setVideoDescMr] = useState('');
  const [videoDescHi, setVideoDescHi] = useState('');

  useEffect(() => {
    loadClasses();
    if (location.state && location.state.openAdd) {
      handleOpenAddForm();
    }
  }, [location.state]);

  const showNotificationPopup = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      const [classesData, mediumsData, subjectsData] = await Promise.all([
        getClasses(),
        getMediums(),
        getSubjects()
      ]);
      setClasses(classesData);
      setMediums(mediumsData);
      setSubjects(subjectsData);
    } catch (err) {
      showNotificationPopup('error', 'Failed to load class configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setNameEn('');
    setNameMr('');
    setNameHi('');
    setDescEn('');
    setDescMr('');
    setDescHi('');
    setThumbnail('');
    setImageEn('');
    setImageMr('');
    setImageHi('');
    setActiveLangTab('en');

    // Reset wizard steps & states
    setWizardStep(1);
    setCreatedClassId(null);
    setCreatedClassName('');
    setCreatedMediumId(null);
    setCreatedMediumName('');
    setMediumLangTab('en');
    setMediumNameEn(''); setMediumNameMr(''); setMediumNameHi('');
    setVideoLangTab('en');
    setSubjectNameEn(''); setSubjectNameMr(''); setSubjectNameHi('');
    setVideoTitleEn(''); setVideoTitleMr(''); setVideoTitleHi('');
    setVideoUrl('');
    setVideoDescEn(''); setVideoDescMr(''); setVideoDescHi('');

    setShowForm(true);
  };

  const handleOpenEditForm = (cls) => {
    setEditingId(cls.id);
    setNameEn(cls.translations?.en?.name || cls.name || '');
    setNameMr(cls.translations?.mr?.name || '');
    setNameHi(cls.translations?.hi?.name || '');
    setDescEn(cls.translations?.en?.description || cls.description || '');
    setDescMr(cls.translations?.mr?.description || '');
    setDescHi(cls.translations?.hi?.description || '');
    setThumbnail(cls.thumbnail || cls.imageUrl_en || '');
    setImageEn(cls.imageUrl_en || cls.translations?.en?.imageUrl || cls.thumbnail || '');
    setImageMr(cls.imageUrl_mr || cls.translations?.mr?.imageUrl || '');
    setImageHi(cls.imageUrl_hi || cls.translations?.hi?.imageUrl || '');
    setActiveLangTab('en');
    
    // Normal edit flow runs on Step 1 only
    setWizardStep(1);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class? This will also remove associated mediums, subjects, and videos.')) {
      try {
        await deleteClass(id);
        showNotificationPopup('success', 'Class deleted successfully!');
        loadClasses();
      } catch (err) {
        showNotificationPopup('error', 'Failed to delete class.');
      }
    }
  };

  // Step 1 Submission: Class details
  const handleSubmitClass = async (e) => {
    e.preventDefault();
    let finalNameEn = nameEn;
    let finalDescEn = descEn;
    if (!finalNameEn && nameMr) finalNameEn = nameMr;
    if (!finalNameEn && nameHi) finalNameEn = nameHi;
    if (!finalNameEn) {
      showNotificationPopup('error', 'Class name is required!');
      return;
    }
    if (!finalDescEn && descMr) finalDescEn = descMr;
    if (!finalDescEn && descHi) finalDescEn = descHi;

    const defaultImg = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    const payload = {
      name: finalNameEn,
      description: finalDescEn,
      thumbnail: imageEn || thumbnail || defaultImg,
      translations: {
        en: { name: finalNameEn, description: finalDescEn, imageUrl: imageEn || thumbnail || defaultImg },
        mr: { name: nameMr || finalNameEn, description: descMr || finalDescEn, imageUrl: imageMr || imageEn || thumbnail || defaultImg },
        hi: { name: nameHi || finalNameEn, description: descHi || finalDescEn, imageUrl: imageHi || imageEn || thumbnail || defaultImg }
      }
    };

    try {
      if (editingId) {
        await updateClass(editingId, payload);
        showNotificationPopup('success', 'Class details updated successfully!');
        setShowForm(false);
        loadClasses();
      } else {
        const createdClass = await addClass(payload);
        setCreatedClassId(createdClass.id);
        setCreatedClassName(createdClass.name);
        showNotificationPopup('success', 'Class created! Moving to step 2: Add Medium.');
        loadClasses();
        // Move to step 2
        setWizardStep(2);
      }
    } catch (err) {
      showNotificationPopup('error', 'Failed to save class details.');
    }
  };

  // Step 2 Submission: Medium details
  const handleSubmitMedium = async (e) => {
    e.preventDefault();
    const finalEn = mediumNameEn || mediumNameMr || mediumNameHi;
    if (!finalEn) {
      showNotificationPopup('error', 'Medium name is required in at least one language!');
      return;
    }

    try {
      const payload = {
        name: finalEn,
        classId: createdClassId,
        translations: {
          en: { name: finalEn },
          mr: { name: mediumNameMr || finalEn },
          hi: { name: mediumNameHi || finalEn }
        }
      };
      const createdMed = await addMedium(payload);
      setCreatedMediumId(createdMed.id);
      setCreatedMediumName(createdMed.name);
      showNotificationPopup('success', 'Medium added! Moving to step 3: Add Video.');
      loadClasses();
      setWizardStep(3);
    } catch (err) {
      showNotificationPopup('error', 'Failed to save medium details.');
    }
  };

  // Step 3 Submission: Subject & Video details
  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    const finalSubEn = subjectNameEn || subjectNameMr || subjectNameHi;
    const finalVidEn = videoTitleEn || videoTitleMr || videoTitleHi;
    if (!finalSubEn || !finalVidEn || !videoUrl) {
      showNotificationPopup('error', 'Subject Name, Video Title, and Video URL are required!');
      return;
    }

    try {
      const subPayload = {
        name: finalSubEn,
        classId: createdClassId,
        mediumId: createdMediumId,
        translations: {
          en: { name: finalSubEn },
          mr: { name: subjectNameMr || finalSubEn },
          hi: { name: subjectNameHi || finalSubEn }
        }
      };
      const createdSub = await addSubject(subPayload);

      const videoPayload = {
        title: finalVidEn,
        description: videoDescEn || videoDescMr || videoDescHi,
        url: videoUrl,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
        classId: createdClassId,
        mediumId: createdMediumId,
        subjectId: createdSub.id,
        tags: 'wizard',
        translations: {
          en: { title: finalVidEn, description: videoDescEn || '' },
          mr: { title: videoTitleMr || finalVidEn, description: videoDescMr || '' },
          hi: { title: videoTitleHi || finalVidEn, description: videoDescHi || '' }
        }
      };
      await addVideo(videoPayload);

      showNotificationPopup('success', 'Subject and Video successfully linked to Class!');
      setShowForm(false);
      loadClasses();
    } catch (err) {
      showNotificationPopup('error', 'Failed to publish subject/video details.');
    }
  };

  const handleSkipMedium = () => {
    showNotificationPopup('success', 'Class setup completed without adding Medium.');
    setShowForm(false);
    loadClasses();
  };

  const handleSkipVideo = () => {
    showNotificationPopup('success', 'Class & Medium setup completed without adding Video.');
    setShowForm(false);
    loadClasses();
  };

  const filteredClasses = classes.filter(cls => {
    const q = searchQuery.toLowerCase();
    const nameStrEn = (cls.translations?.en?.name || cls.name || '').toLowerCase();
    const nameStrMr = (cls.translations?.mr?.name || '').toLowerCase();
    const nameStrHi = (cls.translations?.hi?.name || '').toLowerCase();
    const descStr = (cls.description || '').toLowerCase();
    return nameStrEn.includes(q) || nameStrMr.includes(q) || nameStrHi.includes(q) || descStr.includes(q);
  });

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
            Classes Management
          </h2>
          <p className="text-muted-custom small m-0">
            Define categories, grades, and trades for curriculum packages
          </p>
        </div>
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
          <span>Add Class</span>
        </button>
      </div>

      {/* Workspace Full Width Layout */}
      <div className="row g-4 flex-grow-1" style={{ overflow: 'hidden', minHeight: 0 }}>
        
        {/* Table List (Full width since form is a popup modal) */}
        <div className="col-12 d-flex flex-column" style={{ height: '100%', minHeight: 0 }}>
          
          {/* Search bar */}
          <div className="mb-3 position-relative">
            <Search size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--brand-secondary)' }} />
            <input
              type="text"
              placeholder="Search classes by name or description..."
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

          {/* Table Container */}
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
            ) : filteredClasses.length > 0 ? (
               <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead className="table-light" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Image</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Class Name</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Mediums</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Subjects</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Description</th>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.map((cls) => (
                      <tr key={cls.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="px-4 py-2.5">
                          <div className="rounded overflow-hidden bg-light" style={{ width: '42px', height: '42px' }}>
                            <img
                              src={cls.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80'}
                              alt=""
                              className="w-100 h-100 object-fit-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2.5 fw-bold text-heading">
                          <div className="d-flex flex-column">
                            <span>{cls.translations?.en?.name || cls.name}</span>
                            <span className="text-muted-custom font-normal" style={{ fontSize: '0.7rem' }}>
                              MR: {cls.translations?.mr?.name || '—'} | HI: {cls.translations?.hi?.name || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          {mediums.filter(m => String(m.classId) === String(cls.id)).length > 0 ? (
                            <div className="fw-semibold" style={{ color: 'var(--text-heading)', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                              {mediums
                                .filter(m => String(m.classId) === String(cls.id))
                                .map(m => {
                                  const name = (m.translations?.en?.name || m.name || '').toLowerCase();
                                  const isEng = name.includes('english');
                                  const isMar = name.includes('marathi');
                                  const isHin = name.includes('hindi');
                                  return isEng ? 'E' : isMar ? 'M' : isHin ? 'H' : (m.translations?.en?.name || m.name || '?')[0].toUpperCase();
                                })
                                .join(', ')}
                            </div>
                          ) : (
                            <span className="text-muted-custom italic" style={{ fontSize: '0.7rem' }}>(No mediums)</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {(() => {
                            const classMeds = mediums.filter(m => String(m.classId) === String(cls.id));
                            const classSubs = subjects.filter(s => classMeds.some(m => String(s.mediumId) === String(m.id)));
                            return classSubs.length > 0 ? (
                              <div className="text-muted-custom" style={{ fontSize: '0.7rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={classSubs.map(s => s.name).join(', ')}>
                                {classSubs.map(s => s.name).join(', ')}
                              </div>
                            ) : (
                              <span className="text-muted-custom italic" style={{ fontSize: '0.7rem' }}>(No subjects)</span>
                            );
                          })()}
                        </td>
                        <td className="px-3 py-2.5 text-muted-custom text-truncate" style={{ maxWidth: '200px' }}>
                          {cls.translations?.en?.description || cls.description || 'No description available.'}
                        </td>
                        <td className="px-4 py-2.5 text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button
                              onClick={() => handleOpenEditForm(cls)}
                              className="btn btn-sm btn-light p-2 rounded-circle"
                              style={{ color: 'var(--brand-secondary)' }}
                              title="Edit Class"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="btn btn-sm btn-light p-2 rounded-circle text-danger"
                              title="Delete Class"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 h-100 text-muted">
                <span>No classes found matching search query.</span>
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
                <div>
                  <h5 className="m-0 fw-extrabold text-heading">
                    {editingId ? 'Edit Class Details' : `Add Class: Step ${wizardStep} of 3`}
                  </h5>
                  {!editingId && (
                    <small className="text-muted-custom">
                      {wizardStep === 1 && "Enter package name, description, and cover image"}
                      {wizardStep === 2 && `Add teaching medium for '${createdClassName}'`}
                      {wizardStep === 3 && `Add first subject and lecture video for '${createdMediumName}'`}
                    </small>
                  )}
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-light btn-sm p-1 rounded-circle border-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Indicator for Wizard */}
              {!editingId && (
                <div className="d-flex align-items-center justify-content-between mb-4 px-2">
                  {[
                    { step: 1, label: 'Class Details' },
                    { step: 2, label: 'Add Medium' },
                    { step: 3, label: 'Add Video' }
                  ].map((s) => (
                    <React.Fragment key={s.step}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: wizardStep >= s.step ? 'var(--brand-primary)' : 'var(--search-bg)',
                            color: wizardStep >= s.step ? '#fff' : 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            border: wizardStep === s.step ? '2px solid var(--brand-secondary)' : 'none'
                          }}
                        >
                          {s.step}
                        </div>
                        <span
                          className="small fw-semibold d-none d-sm-inline"
                          style={{
                            color: wizardStep >= s.step ? 'var(--text-heading)' : 'var(--text-secondary)'
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      {s.step < 3 && (
                        <div
                          className="flex-grow-1 mx-2"
                          style={{
                            height: '2px',
                            backgroundColor: wizardStep > s.step ? 'var(--brand-primary)' : 'var(--border-subtle)'
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Step 1 Form: Class Details (Add or Edit) */}
              {wizardStep === 1 && (
                <form onSubmit={handleSubmitClass} className="d-flex flex-column gap-3 overflow-y-auto pr-1 flex-grow-1" style={{ minHeight: 0 }}>
                  
                  {/* Language Tabs (Only relevant for Class metadata) */}
                  <div className="d-flex p-1 rounded-pill mb-1" style={{ backgroundColor: 'var(--search-bg)' }}>
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

                  {activeLangTab === 'en' && (
                    <>
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Class Name (English)</label>
                        <input
                          type="text"
                          placeholder="e.g. Class 10"
                          value={nameEn}
                          onChange={(e) => setNameEn(e.target.value)}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Description (English)</label>
                        <textarea
                          rows={3}
                          placeholder="Explain class contents, board focus, etc."
                          value={descEn}
                          onChange={(e) => setDescEn(e.target.value)}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                        <label className="form-label small fw-semibold text-heading mb-1 d-flex align-items-center gap-1">
                          <Image size={13} /> Cover Image URL (English)
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/class-en.jpg"
                          value={imageEn}
                          onChange={(e) => setImageEn(e.target.value)}
                          className="form-control rounded-3"
                          style={{ borderColor: 'var(--input-border)' }}
                        />
                        {imageEn && (
                          <div className="mt-2 text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)', border: '1px dashed var(--border-subtle)' }}>
                            <span className="text-muted-custom d-block mb-1" style={{ fontSize: '0.7rem' }}>English Image Preview</span>
                            <img src={imageEn} alt="EN Preview" className="rounded" style={{ height: '70px', width: '120px', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display='none'; }} />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {activeLangTab === 'mr' && (
                    <>
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Class Name (Marathi)</label>
                        <input
                          type="text"
                          placeholder="उदा. इयत्ता १० वी"
                          value={nameMr}
                          onChange={(e) => setNameMr(e.target.value)}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Description (Marathi)</label>
                        <textarea
                          rows={3}
                          placeholder="वर्णन प्रविष्ट करा"
                          value={descMr}
                          onChange={(e) => setDescMr(e.target.value)}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                        <label className="form-label small fw-semibold text-heading mb-1 d-flex align-items-center gap-1">
                          <Image size={13} /> Cover Image URL (Marathi)
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/class-mr.jpg"
                          value={imageMr}
                          onChange={(e) => setImageMr(e.target.value)}
                          className="form-control rounded-3"
                          style={{ borderColor: 'var(--input-border)' }}
                        />
                        {imageMr && (
                          <div className="mt-2 text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)', border: '1px dashed var(--border-subtle)' }}>
                            <span className="text-muted-custom d-block mb-1" style={{ fontSize: '0.7rem' }}>Marathi Image Preview</span>
                            <img src={imageMr} alt="MR Preview" className="rounded" style={{ height: '70px', width: '120px', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display='none'; }} />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {activeLangTab === 'hi' && (
                    <>
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Class Name (Hindi)</label>
                        <input
                          type="text"
                          placeholder="जैसे: कक्षा 10"
                          value={nameHi}
                          onChange={(e) => setNameHi(e.target.value)}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Description (Hindi)</label>
                        <textarea
                          rows={3}
                          placeholder="विवरण दर्ज करें"
                          value={descHi}
                          onChange={(e) => setDescHi(e.target.value)}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                        <label className="form-label small fw-semibold text-heading mb-1 d-flex align-items-center gap-1">
                          <Image size={13} /> Cover Image URL (Hindi)
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/class-hi.jpg"
                          value={imageHi}
                          onChange={(e) => setImageHi(e.target.value)}
                          className="form-control rounded-3"
                          style={{ borderColor: 'var(--input-border)' }}
                        />
                        {imageHi && (
                          <div className="mt-2 text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)', border: '1px dashed var(--border-subtle)' }}>
                            <span className="text-muted-custom d-block mb-1" style={{ fontSize: '0.7rem' }}>Hindi Image Preview</span>
                            <img src={imageHi} alt="HI Preview" className="rounded" style={{ height: '70px', width: '120px', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display='none'; }} />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Actions */}
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
                      {editingId ? 'Save Changes' : 'Create & Next'}
                    </button>
                  </div>

                </form>
              )}

              {/* Step 2 Form: Add Medium */}
              {wizardStep === 2 && (
                <form onSubmit={handleSubmitMedium} className="d-flex flex-column gap-3 overflow-y-auto pr-1 flex-grow-1" style={{ minHeight: 0 }}>
                  <div className="p-3 rounded mb-1" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                    <span className="small text-muted-custom d-block">Configuring package:</span>
                    <strong style={{ color: 'var(--text-heading)' }}>{createdClassName}</strong>
                  </div>

                  {/* Language Tabs */}
                  <div className="d-flex p-1 rounded-pill" style={{ backgroundColor: 'var(--search-bg)' }}>
                    {[{ code: 'en', label: 'English' }, { code: 'mr', label: 'मराठी (Marathi)' }, { code: 'hi', label: 'हिंदी (Hindi)' }].map(tab => (
                      <button key={tab.code} type="button" onClick={() => setMediumLangTab(tab.code)}
                        className="flex-grow-1 btn btn-sm py-2 px-3 rounded-pill border-0 d-flex align-items-center justify-content-center gap-1"
                        style={{ backgroundColor: mediumLangTab === tab.code ? 'var(--bg-secondary)' : 'transparent', color: mediumLangTab === tab.code ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: mediumLangTab === tab.code ? '700' : '500', fontSize: '0.75rem' }}>
                        <Globe size={12} /><span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {mediumLangTab === 'en' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Medium Name (English)</label>
                      <input type="text" placeholder="e.g. English Medium, Semi-English" value={mediumNameEn}
                        onChange={e => setMediumNameEn(e.target.value)} className="form-control rounded-3" autoFocus />
                    </div>
                  )}
                  {mediumLangTab === 'mr' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">माध्यमाचे नाव (मराठी)</label>
                      <input type="text" placeholder="उदा. मराठी माध्यम" value={mediumNameMr}
                        onChange={e => setMediumNameMr(e.target.value)} className="form-control rounded-3" autoFocus />
                    </div>
                  )}
                  {mediumLangTab === 'hi' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">माध्यम का नाम (हिंदी)</label>
                      <input type="text" placeholder="जैसे: हिंदी माध्यम" value={mediumNameHi}
                        onChange={e => setMediumNameHi(e.target.value)} className="form-control rounded-3" autoFocus />
                    </div>
                  )}
                  <small className="text-muted-custom d-block" style={{ marginTop: '-8px' }}>Specify the medium of instruction for curriculum subjects.</small>

                  <div className="d-flex gap-2 mt-auto pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                    <button type="button" onClick={handleSkipMedium} className="flex-grow-1 btn btn-light py-2 rounded-3 small fw-bold">Skip For Now</button>
                    <button type="submit" className="flex-grow-1 btn text-white py-2 rounded-3 small fw-bold border-0"
                      style={{ background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)', boxShadow: 'var(--neon-blue-glow)' }}>Add & Next</button>
                  </div>
                </form>
              )}

              {/* Step 3 Form: Add Subject & Video */}
              {wizardStep === 3 && (
                <form onSubmit={handleSubmitVideo} className="d-flex flex-column gap-3 overflow-y-auto pr-1 flex-grow-1" style={{ minHeight: 0 }}>
                  <div className="p-3 rounded mb-1" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                    <span className="small text-muted-custom d-block">Class / Medium:</span>
                    <strong style={{ color: 'var(--text-heading)' }}>{createdClassName} — {createdMediumName}</strong>
                  </div>

                  {/* Language Tabs */}
                  <div className="d-flex p-1 rounded-pill" style={{ backgroundColor: 'var(--search-bg)' }}>
                    {[{ code: 'en', label: 'English' }, { code: 'mr', label: 'मराठी (Marathi)' }, { code: 'hi', label: 'हिंदी (Hindi)' }].map(tab => (
                      <button key={tab.code} type="button" onClick={() => setVideoLangTab(tab.code)}
                        className="flex-grow-1 btn btn-sm py-2 px-3 rounded-pill border-0 d-flex align-items-center justify-content-center gap-1"
                        style={{ backgroundColor: videoLangTab === tab.code ? 'var(--bg-secondary)' : 'transparent', color: videoLangTab === tab.code ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: videoLangTab === tab.code ? '700' : '500', fontSize: '0.75rem' }}>
                        <Globe size={12} /><span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Subject Name */}
                  {videoLangTab === 'en' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Subject Name (English)</label>
                      <input type="text" placeholder="e.g. Mathematics, Science" value={subjectNameEn}
                        onChange={e => setSubjectNameEn(e.target.value)} className="form-control rounded-3" />
                    </div>
                  )}
                  {videoLangTab === 'mr' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">विषयाचे नाव (मराठी)</label>
                      <input type="text" placeholder="उदा. गणित, विज्ञान" value={subjectNameMr}
                        onChange={e => setSubjectNameMr(e.target.value)} className="form-control rounded-3" />
                    </div>
                  )}
                  {videoLangTab === 'hi' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">विषय का नाम (हिंदी)</label>
                      <input type="text" placeholder="जैसे: गणित, विज्ञान" value={subjectNameHi}
                        onChange={e => setSubjectNameHi(e.target.value)} className="form-control rounded-3" />
                    </div>
                  )}

                  {/* Video Title */}
                  <div className="border-top pt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                    {videoLangTab === 'en' && (
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">Video Title (English)</label>
                        <input type="text" placeholder="e.g. Introduction to Algebra" value={videoTitleEn}
                          onChange={e => setVideoTitleEn(e.target.value)} className="form-control rounded-3" />
                      </div>
                    )}
                    {videoLangTab === 'mr' && (
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">व्हिडिओ शीर्षक (मराठी)</label>
                        <input type="text" placeholder="उदा. बीजगणिताची ओळख" value={videoTitleMr}
                          onChange={e => setVideoTitleMr(e.target.value)} className="form-control rounded-3" />
                      </div>
                    )}
                    {videoLangTab === 'hi' && (
                      <div>
                        <label className="form-label small fw-semibold text-heading mb-1">वीडियो शीर्षक (हिंदी)</label>
                        <input type="text" placeholder="जैसे: बीजगणित का परिचय" value={videoTitleHi}
                          onChange={e => setVideoTitleHi(e.target.value)} className="form-control rounded-3" />
                      </div>
                    )}
                  </div>

                  {/* YouTube URL — always shown */}
                  <div>
                    <label className="form-label small fw-semibold text-heading mb-1">YouTube Video URL</label>
                    <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)} className="form-control rounded-3" required />
                  </div>

                  {/* Video Description */}
                  {videoLangTab === 'en' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">Video Description (English)</label>
                      <textarea rows={2} placeholder="Brief video contents..." value={videoDescEn}
                        onChange={e => setVideoDescEn(e.target.value)} className="form-control rounded-3" />
                    </div>
                  )}
                  {videoLangTab === 'mr' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">व्हिडिओ वर्णन (मराठी)</label>
                      <textarea rows={2} placeholder="व्हिडिओची थोडक्यात माहिती..." value={videoDescMr}
                        onChange={e => setVideoDescMr(e.target.value)} className="form-control rounded-3" />
                    </div>
                  )}
                  {videoLangTab === 'hi' && (
                    <div>
                      <label className="form-label small fw-semibold text-heading mb-1">वीडियो विवरण (हिंदी)</label>
                      <textarea rows={2} placeholder="वीडियो की संक्षिप्त जानकारी..." value={videoDescHi}
                        onChange={e => setVideoDescHi(e.target.value)} className="form-control rounded-3" />
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-auto pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                    <button type="button" onClick={handleSkipVideo} className="flex-grow-1 btn btn-light py-2 rounded-3 small fw-bold">Skip For Now</button>
                    <button type="submit" className="flex-grow-1 btn text-white py-2 rounded-3 small fw-bold border-0"
                      style={{ background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)', boxShadow: 'var(--neon-blue-glow)' }}>Add & Finish</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
