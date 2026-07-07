import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSubjects, getMediums, getClasses, addSubject, updateSubject, deleteSubject } from '../../services/adminService';
import CustomSelect from '../../components/ui/CustomSelect';
import { Search, Plus, Edit2, Trash2, X, Globe } from 'lucide-react';
import { autoTranslateFields } from '../../services/autoTranslate';

export default function SubjectManagement() {
  const location = useLocation();
  const [subjects, setSubjects] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('en'); // en, mr, hi
  const [translating, setTranslating] = useState(false);

  // Fields
  const [nameEn, setNameEn] = useState('');
  const [nameMr, setNameMr] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [classId, setClassId] = useState('');
  const [mediumId, setMediumId] = useState('');

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsData, mediumsData, classesData] = await Promise.all([
        getSubjects(),
        getMediums(),
        getClasses()
      ]);
      setSubjects(subjectsData);
      setMediums(mediumsData);
      setClasses(classesData);
    } catch (err) {
      showNotificationPopup('error', 'Failed to fetch subjects data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setNameEn('');
    setNameMr('');
    setNameHi('');
    
    const firstClass = classes[0]?.id || '';
    setClassId(firstClass);
    
    // Filter mediums for first class
    const filteredMeds = mediums.filter(m => String(m.classId) === String(firstClass));
    setMediumId(filteredMeds[0]?.id || '');
    
    setActiveLangTab('en');
    setShowForm(true);
  };

  const handleOpenEditForm = (sub) => {
    setEditingId(sub.id);
    setNameEn(sub.translations?.en?.name || sub.name || '');
    setNameMr(sub.translations?.mr?.name || '');
    setNameHi(sub.translations?.hi?.name || '');
    setClassId(sub.classId || '');
    setMediumId(sub.mediumId || '');
    setActiveLangTab('en');
    setShowForm(true);
  };

  // Auto-translate helpers
  const handleNameEnBlur = async () => {
    if (nameEn && (!nameMr || !nameHi)) {
      setTranslating(true);
      try {
        const { mr, hi } = await autoTranslateFields(nameEn);
        if (!nameMr && mr) setNameMr(mr);
        if (!nameHi && hi) setNameHi(hi);
      } finally {
        setTranslating(false);
      }
    }
  };

  const handleAutoTranslate = async () => {
    if (!nameEn) {
      showNotificationPopup('error', 'Please enter English subject name first.');
      return;
    }
    setTranslating(true);
    try {
      const { mr, hi } = await autoTranslateFields(nameEn);
      setNameMr(mr);
      setNameHi(hi);
      showNotificationPopup('success', '✨ Hindi and Marathi translations generated successfully!');
    } catch (err) {
      showNotificationPopup('error', 'Failed to generate translations.');
    } finally {
      setTranslating(false);
    }
  };

  // Smart medium name resolver: uses stored translations, falls back to auto-mapping for common terms
  const getMediumDisplayName = (med, lang) => {
    const stored = lang === 'mr' ? med.translations?.mr?.name : lang === 'hi' ? med.translations?.hi?.name : null;
    const enName = med.translations?.en?.name || med.name || '';
    // If stored translation is distinct from English, use it
    if (stored && stored !== enName) return stored;
    // Auto-map common medium terms
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
    return enName;
  };

  // Filter medium dropdown options based on selected class
  const getFilteredMediumOptions = () => {
    if (!classId) return [];
    return mediums
      .filter(m => String(m.classId) === String(classId))
      .map(m => ({
        value: m.id,
        label: getMediumDisplayName(m, activeLangTab)
      }));
  };

  // Automatically update selected medium if it doesn't belong to the newly selected class
  const handleClassChange = (newClassId) => {
    setClassId(newClassId);
    const availableMeds = mediums.filter(m => String(m.classId) === String(newClassId));
    if (availableMeds.length > 0) {
      // Check if current medium is in the new class, otherwise select first available
      const exists = availableMeds.some(m => String(m.id) === String(mediumId));
      if (!exists) {
        setMediumId(availableMeds[0].id);
      }
    } else {
      setMediumId('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject? All videos under this subject will be deleted.')) {
      try {
        await deleteSubject(id);
        showNotificationPopup('success', 'Subject deleted successfully!');
        loadData();
      } catch (err) {
        showNotificationPopup('error', 'Failed to delete subject.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameEn) {
      showNotificationPopup('error', 'English name is required as a fallback!');
      return;
    }
    if (!classId) {
      showNotificationPopup('error', 'Please select a Class!');
      return;
    }
    if (!mediumId) {
      showNotificationPopup('error', 'Please select a Medium!');
      return;
    }

    const payload = {
      name: nameEn,
      classId: classId,
      mediumId: mediumId,
      translations: {
        en: { name: nameEn },
        mr: { name: nameMr || nameEn },
        hi: { name: nameHi || nameEn }
      }
    };

    try {
      if (editingId) {
        await updateSubject(editingId, payload);
        showNotificationPopup('success', 'Subject details updated successfully!');
      } else {
        await addSubject(payload);
        showNotificationPopup('success', 'Subject created successfully!');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to save subject details.');
    }
  };

  const filteredSubjects = subjects.filter(sub => {
    const q = searchQuery.toLowerCase();
    const nameStrEn = (sub.translations?.en?.name || sub.name || '').toLowerCase();
    const nameStrMr = (sub.translations?.mr?.name || '').toLowerCase();
    const nameStrHi = (sub.translations?.hi?.name || '').toLowerCase();

    const cls = classes.find(c => String(c.id) === String(sub.classId));
    const med = mediums.find(m => String(m.id) === String(sub.mediumId));

    const clsNameStr = cls ? (cls.translations?.en?.name || cls.name || '').toLowerCase() : '';
    const medNameStr = med ? (med.translations?.en?.name || med.name || '').toLowerCase() : '';

    return nameStrEn.includes(q) || nameStrMr.includes(q) || nameStrHi.includes(q) || clsNameStr.includes(q) || medNameStr.includes(q);
  });

  const classSelectOptions = classes.map(c => ({
    value: c.id,
    label: activeLangTab === 'mr'
      ? (c.translations?.mr?.name || c.translations?.en?.name || c.name)
      : activeLangTab === 'hi'
      ? (c.translations?.hi?.name || c.translations?.en?.name || c.name)
      : (c.translations?.en?.name || c.name)
  }));

  const filteredMediumOptions = getFilteredMediumOptions();

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
            Subjects Management
          </h2>
          <p className="text-muted-custom small m-0">
            Organize modules, topics, and lectures into syllabus groups
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
          <span>Add Subject</span>
        </button>
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
              placeholder="Search subjects by name, class or medium..."
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
            ) : filteredSubjects.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead className="table-light" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>ID</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Subject Name</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Class</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Medium</th>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.map((sub, index) => {
                      const cls = classes.find(c => String(c.id) === String(sub.classId));
                      const med = mediums.find(m => String(m.id) === String(sub.mediumId));
                      return (
                        <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td className="px-4 py-2.5 small text-muted">{index + 1}</td>
                          <td className="px-3 py-2.5 fw-bold text-heading">
                            <div className="d-flex flex-column">
                              <span>{sub.translations?.en?.name || sub.name}</span>
                              <span className="text-muted-custom font-normal" style={{ fontSize: '0.7rem' }}>
                                MR: {sub.translations?.mr?.name || '—'} | HI: {sub.translations?.hi?.name || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="badge px-2 py-1 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', fontSize: '0.7rem' }}>
                              {cls ? (cls.translations?.en?.name || cls.name) : 'Unknown Class'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="badge px-2 py-1 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981', fontSize: '0.7rem' }}>
                              {med ? (med.translations?.en?.name || med.name) : 'Unknown Medium'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-end">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <button
                                onClick={() => handleOpenEditForm(sub)}
                                className="btn btn-sm btn-light p-2 rounded-circle"
                                style={{ color: 'var(--brand-secondary)' }}
                                title="Edit Subject"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="btn btn-sm btn-light p-2 rounded-circle text-danger"
                                title="Delete Subject"
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
                <span>No subjects found. Click Add Subject to get started.</span>
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
                maxWidth: '550px',
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
                  {editingId ? 'Edit Subject Details' : 'Add New Subject'}
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
                
                {/* Linked Class Dropdown */}
                <div>
                  <CustomSelect
                    label="Assigned Class"
                    options={classSelectOptions}
                    value={classId}
                    onChange={handleClassChange}
                    placeholder="Select Class"
                    showSearch={false}
                  />
                </div>

                {/* Linked Medium Dropdown (Filtered by Class) */}
                <div>
                  <CustomSelect
                    label="Assigned Medium"
                    options={filteredMediumOptions}
                    value={mediumId}
                    onChange={setMediumId}
                    placeholder={classId ? "Select Medium" : "Please select a Class first"}
                    disabled={!classId || filteredMediumOptions.length === 0}
                    showSearch={false}
                  />
                  {!classId && (
                    <span className="text-danger mt-1 d-block" style={{ fontSize: '0.7rem' }}>
                      Select a Class above to load corresponding Mediums
                    </span>
                  )}
                  {classId && filteredMediumOptions.length === 0 && (
                    <span className="text-danger mt-1 d-block" style={{ fontSize: '0.7rem' }}>
                      No mediums configured for the selected class. Add one first.
                    </span>
                  )}
                </div>

                {/* Translatable fields */}
                {activeLangTab === 'en' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-2" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px dashed var(--brand-secondary)' }}>
                      <div className="d-flex align-items-center gap-2 small" style={{ color: 'var(--brand-primary)' }}>
                        <span style={{ fontSize: '1.1rem' }}>✨</span>
                        <span className="fw-semibold">Auto-generate Marathi & Hindi text</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoTranslate}
                        disabled={translating || !nameEn}
                        className="btn btn-sm px-3 py-1 rounded-pill text-white fw-bold d-flex align-items-center gap-1.5 transition-all"
                        style={{
                          background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
                          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                          fontSize: '0.75rem',
                          opacity: !nameEn ? 0.6 : 1
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
                    <label className="form-label small fw-semibold text-heading mb-1">Subject Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Science Part 1, Geometry, History"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      onBlur={handleNameEnBlur}
                      className="form-control rounded-3"
                      required
                    />
                  </div>
                )}

                {activeLangTab === 'mr' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span className="small text-success fw-semibold">💡 You can change or edit the auto-generated Marathi text below</span>
                    </div>
                    <label className="form-label small fw-semibold text-heading mb-1">Subject Name (Marathi)</label>
                    <input
                      type="text"
                      placeholder="उदा. विज्ञान भाग १"
                      value={nameMr}
                      onChange={(e) => setNameMr(e.target.value)}
                      className="form-control rounded-3"
                    />
                  </div>
                )}

                {activeLangTab === 'hi' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <span className="small text-warning fw-semibold">💡 You can change or edit the auto-generated Hindi text below</span>
                    </div>
                    <label className="form-label small fw-semibold text-heading mb-1">Subject Name (Hindi)</label>
                    <input
                      type="text"
                      placeholder="जैसे: विज्ञान भाग १"
                      value={nameHi}
                      onChange={(e) => setNameHi(e.target.value)}
                      className="form-control rounded-3"
                    />
                  </div>
                )}

                {/* Action footer */}
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
                    {editingId ? 'Save Changes' : 'Create Subject'}
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
