import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMediums, getClasses, addMedium, updateMedium, deleteMedium } from '../../services/adminService';
import CustomSelect from '../../components/ui/CustomSelect';
import { Search, Plus, Edit2, Trash2, X, Globe } from 'lucide-react';

export default function MediumManagement() {
  const location = useLocation();
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

  // Fields
  const [nameEn, setNameEn] = useState('');
  const [nameMr, setNameMr] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [classId, setClassId] = useState('');

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
      const [mediumsData, classesData] = await Promise.all([
        getMediums(),
        getClasses()
      ]);
      setMediums(mediumsData);
      setClasses(classesData);
    } catch (err) {
      showNotificationPopup('error', 'Failed to load mediums database.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setNameEn('');
    setNameMr('');
    setNameHi('');
    setClassId(classes[0]?.id || '');
    setActiveLangTab('en');
    setShowForm(true);
  };

  const handleOpenEditForm = (med) => {
    setEditingId(med.id);
    setNameEn(med.translations?.en?.name || med.name || '');
    setNameMr(med.translations?.mr?.name || '');
    setNameHi(med.translations?.hi?.name || '');
    setClassId(med.classId || '');
    setActiveLangTab('en');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medium? All associated subjects and videos will be impacted.')) {
      try {
        await deleteMedium(id);
        showNotificationPopup('success', 'Medium deleted successfully!');
        loadData();
      } catch (err) {
        showNotificationPopup('error', 'Failed to delete medium.');
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

    const payload = {
      name: nameEn,
      classId: classId,
      translations: {
        en: { name: nameEn },
        mr: { name: nameMr || nameEn },
        hi: { name: nameHi || nameEn }
      }
    };

    try {
      if (editingId) {
        await updateMedium(editingId, payload);
        showNotificationPopup('success', 'Medium details updated successfully!');
      } else {
        await addMedium(payload);
        showNotificationPopup('success', 'Medium created successfully!');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to save medium details.');
    }
  };

  const filteredMediums = mediums.filter(med => {
    const q = searchQuery.toLowerCase();
    const nameStrEn = (med.translations?.en?.name || med.name || '').toLowerCase();
    const nameStrMr = (med.translations?.mr?.name || '').toLowerCase();
    const nameStrHi = (med.translations?.hi?.name || '').toLowerCase();
    
    // Class name match
    const cls = classes.find(c => String(c.id) === String(med.classId));
    const classNameStr = cls ? (cls.translations?.en?.name || cls.name || '').toLowerCase() : '';

    return nameStrEn.includes(q) || nameStrMr.includes(q) || nameStrHi.includes(q) || classNameStr.includes(q);
  });

  const classSelectOptions = classes.map(c => ({
    value: c.id,
    label: activeLangTab === 'mr'
      ? (c.translations?.mr?.name || c.translations?.en?.name || c.name)
      : activeLangTab === 'hi'
      ? (c.translations?.hi?.name || c.translations?.en?.name || c.name)
      : (c.translations?.en?.name || c.name)
  }));

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
            Mediums Management
          </h2>
          <p className="text-muted-custom small m-0">
            Configure learning languages, streams, and options for classes
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
          <span>Add Medium</span>
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
              placeholder="Search mediums by name or parent class..."
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
            ) : filteredMediums.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead className="table-light" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>ID</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Medium Name</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Assigned Class</th>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMediums.map((med, index) => {
                      const cls = classes.find(c => String(c.id) === String(med.classId));
                      return (
                        <tr key={med.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td className="px-4 py-2.5 small text-muted">{index + 1}</td>
                          <td className="px-3 py-2.5 fw-bold text-heading">
                            <div className="d-flex flex-column">
                              <span>{med.translations?.en?.name || med.name}</span>
                              <span className="text-muted-custom font-normal" style={{ fontSize: '0.7rem' }}>
                                MR: {med.translations?.mr?.name || '—'} | HI: {med.translations?.hi?.name || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="badge px-2.5 py-1.5 rounded" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', fontWeight: '600', fontSize: '0.7rem' }}>
                              {cls ? (cls.translations?.en?.name || cls.name) : 'Unknown Class'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-end">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <button
                                onClick={() => handleOpenEditForm(med)}
                                className="btn btn-sm btn-light p-2 rounded-circle"
                                style={{ color: 'var(--brand-secondary)' }}
                                title="Edit Medium"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(med.id)}
                                className="btn btn-sm btn-light p-2 rounded-circle text-danger"
                                title="Delete Medium"
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
                <span>No mediums found. Click Add Medium to get started.</span>
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
                  {editingId ? 'Edit Medium Details' : 'Add New Medium'}
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
                
                {/* Linked Class Custom Select */}
                <div>
                  <CustomSelect
                    label="Assigned Class"
                    options={classSelectOptions}
                    value={classId}
                    onChange={setClassId}
                    placeholder="Select a class category"
                    showSearch={false}
                  />
                </div>

                {/* Translatable fields */}
                {activeLangTab === 'en' && (
                  <div>
                    <label className="form-label small fw-semibold text-heading mb-1">Medium Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. English, Marathi, Tech Training"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="form-control rounded-3"
                      required
                    />
                  </div>
                )}

                {activeLangTab === 'mr' && (
                  <div>
                    <label className="form-label small fw-semibold text-heading mb-1">Medium Name (Marathi)</label>
                    <input
                      type="text"
                      placeholder="उदा. मराठी"
                      value={nameMr}
                      onChange={(e) => setNameMr(e.target.value)}
                      className="form-control rounded-3"
                    />
                  </div>
                )}

                {activeLangTab === 'hi' && (
                  <div>
                    <label className="form-label small fw-semibold text-heading mb-1">Medium Name (Hindi)</label>
                    <input
                      type="text"
                      placeholder="जैसे: हिंदी"
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
                    {editingId ? 'Save Changes' : 'Create Medium'}
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
