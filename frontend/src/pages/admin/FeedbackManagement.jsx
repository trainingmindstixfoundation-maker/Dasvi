import React, { useEffect, useState } from 'react';
import { getFeedbacks, addFeedback, deleteFeedback } from '../../services/adminService';
import { Search, Plus, Trash2, X, MessageSquare, Star, User, Mail, Calendar, FileUp, Eye, ExternalLink, HelpCircle } from 'lucide-react';

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('5 Stars - Highly Helpful');
  const [formUrl, setFormUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const showNotificationPopup = (type, msg) => {
    setNotification({ type, message: msg });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFeedbacks();
      setFeedbacks(data || []);
    } catch (err) {
      showNotificationPopup('error', 'Failed to load feedback submissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setTitle('Platform Experience Survey');
    setName('');
    setEmail('');
    setRating('5 Stars - Highly Helpful');
    setFormUrl('');
    setMessage('');
    setShowForm(true);
  };

  const handleOpenDetailModal = (item) => {
    setSelectedFeedback(item);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback submission?')) {
      try {
        await deleteFeedback(id);
        showNotificationPopup('success', 'Feedback deleted successfully!');
        loadData();
      } catch (err) {
        showNotificationPopup('error', 'Failed to delete feedback.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) {
      showNotificationPopup('error', 'Student Name and Feedback Message are required!');
      return;
    }

    try {
      await addFeedback({
        title: title || 'General Feedback',
        name,
        email,
        rating,
        formUrl,
        message
      });
      showNotificationPopup('success', 'Feedback submission created successfully!');
      setShowForm(false);
      loadData();
    } catch (err) {
      showNotificationPopup('error', 'Failed to save feedback submission.');
    }
  };

  const handleExportCSV = () => {
    if (!feedbacks || feedbacks.length === 0) {
      alert('No feedback data available to export!');
      return;
    }

    const headers = ['ID', 'Student Name', 'Student Email', 'Feedback Topic', 'Rating / Evaluation', 'Message / Notes', 'Survey Link', 'Submission Date'];
    const rows = feedbacks.map(f => [
      f.id,
      `"${(f.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(f.email || '').replace(/"/g, '""')}"`,
      `"${(f.title || 'General Feedback').replace(/"/g, '""')}"`,
      `"${(f.rating || 'N/A').replace(/"/g, '""')}"`,
      `"${(f.message || '').replace(/"/g, '""')}"`,
      `"${(f.formUrl || '').replace(/"/g, '""')}"`,
      new Date(f.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Dasvi_Student_Feedback_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (f.name || '').toLowerCase().includes(q);
    const emailMatch = (f.email || '').toLowerCase().includes(q);
    const titleMatch = (f.title || '').toLowerCase().includes(q);
    const msgMatch = (f.message || '').toLowerCase().includes(q);
    const matchesSearch = nameMatch || emailMatch || titleMatch || msgMatch;

    const matchesRating = !ratingFilter || (f.rating && f.rating.includes(ratingFilter));
    return matchesSearch && matchesRating;
  });

  const getRatingBadgeClass = (rate) => {
    if (!rate) return 'bg-secondary-subtle text-secondary';
    if (rate.includes('5')) return 'bg-success-subtle text-success';
    if (rate.includes('4')) return 'bg-primary-subtle text-primary';
    if (rate.includes('3')) return 'bg-info-subtle text-info';
    return 'bg-warning-subtle text-warning';
  };

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
            Student Feedback & Surveys
          </h2>
          <p className="text-muted-custom small m-0">
            Review student form submissions, platform satisfaction ratings, and manage survey records
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={!feedbacks || feedbacks.length === 0}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 border transition-all fw-bold"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--brand-secondary)',
              fontSize: '0.9rem',
              opacity: (!feedbacks || feedbacks.length === 0) ? 0.5 : 1
            }}
          >
            <FileUp size={16} />
            <span>Export CSV</span>
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
            <span>Create Feedback</span>
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="row g-4 flex-grow-1" style={{ overflow: 'hidden', minHeight: 0 }}>
        <div className="col-12 d-flex flex-column" style={{ height: '100%', minHeight: 0 }}>
          
          {/* Search & Filters */}
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <div className="position-relative flex-grow-1">
              <Search size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--brand-secondary)' }} />
              <input
                type="text"
                placeholder="Search feedback by student name, email, topic, or message..."
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
                  border: '1px solid var(--border-subtle)'
                }}
              />
            </div>

            <div style={{ width: '220px' }}>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="form-select py-2.5 px-3 rounded-3"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="">All Ratings & Status</option>
                <option value="5">5 Stars (Highly Helpful)</option>
                <option value="4">4 Stars (Good)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="Needs Improvement">Needs Improvement</option>
                <option value="Inquiry">General Inquiry</option>
              </select>
            </div>
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
            ) : filteredFeedbacks.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.825rem' }}>
                  <thead className="table-light" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>#</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Student Details</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Feedback Topic</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Rating / Evaluation</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Student Message</th>
                      <th className="px-3 py-2.5 small text-muted text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Submitted On</th>
                      <th className="px-4 py-2.5 small text-muted text-uppercase fw-bold text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedbacks.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="px-4 py-2.5 small text-muted fw-semibold">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-heading d-flex align-items-center gap-1.5">
                              <User size={13} className="text-primary" />
                              {item.name || 'Anonymous Student'}
                            </span>
                            {item.email && (
                              <span className="small text-muted-custom d-flex align-items-center gap-1 mt-0.5" style={{ fontSize: '0.75rem' }}>
                                <Mail size={11} />
                                {item.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 fw-semibold text-heading">
                          <span className="badge bg-light text-dark px-2.5 py-1 rounded small" style={{ fontSize: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                            {item.title || 'General Feedback'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`badge px-2.5 py-1 rounded small ${getRatingBadgeClass(item.rating)}`} style={{ fontSize: '0.72rem' }}>
                            <Star size={11} className="me-1 d-inline" />
                            {item.rating || 'Standard Evaluation'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="text-truncate text-muted-custom" style={{ maxWidth: '240px', lineHeight: '1.4' }}>
                            {item.message || 'No written comments provided.'}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 small text-muted">
                          <span className="d-flex align-items-center gap-1">
                            <Calendar size={13} />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button
                              onClick={() => handleOpenDetailModal(item)}
                              className="btn btn-sm btn-light p-2 rounded-circle"
                              style={{ color: 'var(--brand-secondary)' }}
                              title="View Full Feedback"
                            >
                              <Eye size={14} />
                            </button>
                            {item.formUrl && (
                              <a
                                href={item.formUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-light p-2 rounded-circle"
                                style={{ color: '#0d6efd' }}
                                title="Open Attached Form Link"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-sm btn-light p-2 rounded-circle text-danger"
                              title="Delete Submission"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 h-100 text-muted gap-2">
                <MessageSquare size={36} className="text-secondary opacity-50" />
                <span className="fw-semibold">No feedback submissions found.</span>
                <span className="small text-muted-custom">Students who fill out feedback forms will appear here, or click Create Feedback above.</span>
              </div>
            )}
          </div>
        </div>

        {/* Centered Popup Modal for Creating Feedback */}
        {showForm && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
            style={{
              backgroundColor: 'rgba(15, 12, 30, 0.45)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1050,
              padding: '20px'
            }}
          >
            <div
              className="animate-zoom-in w-100 rounded-4 p-4 border d-flex flex-column"
              style={{
                maxWidth: '580px',
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                maxHeight: '90vh',
                overflow: 'hidden'
              }}
            >
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                    <MessageSquare size={18} />
                  </div>
                  <h5 className="m-0 fw-extrabold text-heading">
                    Create Feedback Record
                  </h5>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-light btn-sm p-1.5 rounded-circle border-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 overflow-y-auto pr-1 flex-grow-1" style={{ minHeight: 0 }}>
                
                <div>
                  <label className="form-label small fw-semibold text-heading mb-1">
                    Feedback Topic / Form Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Platform Experience Survey, Course Content Evaluation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control rounded-3 py-2"
                    required
                  />
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-heading mb-1">
                      Student Name (Who filled form) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control rounded-3 py-2"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-heading mb-1">
                      Student Email / Contact (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control rounded-3 py-2"
                    />
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-heading mb-1">
                      Rating / Evaluation Status
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="form-select rounded-3 py-2"
                    >
                      <option value="5 Stars - Highly Helpful">5 Stars - Highly Helpful</option>
                      <option value="4 Stars - Good">4 Stars - Good</option>
                      <option value="3 Stars - Average">3 Stars - Average</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-heading mb-1">
                      External Survey Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://forms.gle/xyz..."
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      className="form-control rounded-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label small fw-semibold text-heading mb-1">
                    Student Feedback Message / Response <span className="text-danger">*</span>
                  </label>
                  <textarea
                    placeholder="Enter the student's comments, suggestions, or written feedback here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control rounded-3 py-2"
                    rows={4}
                    required
                  />
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top mt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-light px-3 py-2 rounded-3 fw-bold small"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-3 text-white border-0 fw-bold small"
                    style={{ background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)' }}
                  >
                    Save Submission Record
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Centered Popup Modal for Viewing Full Details */}
        {showDetailModal && selectedFeedback && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
            style={{
              backgroundColor: 'rgba(15, 12, 30, 0.45)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1050,
              padding: '20px'
            }}
          >
            <div
              className="animate-zoom-in w-100 rounded-4 p-4 border d-flex flex-column gap-3"
              style={{
                maxWidth: '540px',
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                    <Eye size={18} />
                  </div>
                  <h5 className="m-0 fw-extrabold text-heading">
                    Feedback Submission Details
                  </h5>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn btn-light btn-sm p-1.5 rounded-circle border-0"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="d-flex flex-column gap-3 py-1">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <span className="small text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Student Name</span>
                    <span className="fw-extrabold text-heading fs-6">{selectedFeedback.name || 'Anonymous Student'}</span>
                  </div>
                  <div>
                    <span className={`badge px-3 py-1.5 rounded-pill ${getRatingBadgeClass(selectedFeedback.rating)}`} style={{ fontSize: '0.78rem' }}>
                      <Star size={13} className="me-1 d-inline" />
                      {selectedFeedback.rating || 'Standard Evaluation'}
                    </span>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <span className="small text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Email / Contact</span>
                    <span className="text-muted-custom small">{selectedFeedback.email || 'Not provided'}</span>
                  </div>
                  <div className="col-6">
                    <span className="small text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Submission Date</span>
                    <span className="text-muted-custom small">
                      {new Date(selectedFeedback.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="small text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Feedback Topic / Survey</span>
                  <span className="badge bg-light text-dark px-3 py-1.5 rounded mt-1 fw-bold" style={{ fontSize: '0.8rem', border: '1px solid var(--border-subtle)' }}>
                    {selectedFeedback.title || 'General Platform Feedback'}
                  </span>
                </div>

                {selectedFeedback.formUrl && (
                  <div>
                    <span className="small text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.68rem' }}>Associated Survey Form Link</span>
                    <a
                      href={selectedFeedback.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center gap-1 small text-primary text-decoration-none fw-semibold p-2 rounded bg-primary-subtle w-100"
                    >
                      <ExternalLink size={14} />
                      <span className="text-truncate">{selectedFeedback.formUrl}</span>
                    </a>
                  </div>
                )}

                <div className="p-3 rounded-3 mt-1" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <span className="small text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.68rem' }}>Written Response / Notes</span>
                  <p className="m-0 text-heading small" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {selectedFeedback.message || 'No written response provided.'}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-end pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn btn-primary px-4 py-2 rounded-3 text-white border-0 fw-bold small"
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
