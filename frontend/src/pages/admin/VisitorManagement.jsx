import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  FileUp,
  Activity,
  Eye,
  Calendar,
  Building2,
  Phone,
  Mail,
  X,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected visitor for activity logs drawer
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/visitors');
      if (res.ok) {
        const data = await res.json();
        setVisitors(data || []);
      }
    } catch (err) {
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleViewActivities = async (visitor) => {
    setSelectedVisitor(visitor);
    setLoadingActivities(true);
    try {
      const res = await fetch(`http://localhost:5000/api/visitors/${visitor.id}/activities`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleExportCSV = () => {
    if (!visitors.length) return;
    const headers = ['UUID', 'Full Name', 'Email', 'Phone', 'ITI Institute', 'Total Visits', 'Last Visit', 'Created At'];
    const rows = visitors.map(v => [
      v.visitorToken || v.id,
      `"${(v.fullName || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.itiInstitute || '').replace(/"/g, '""')}"`,
      v.totalVisits || 1,
      v.lastVisit ? new Date(v.lastVisit).toLocaleString() : '',
      v.createdAt ? new Date(v.createdAt).toLocaleString() : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dasvi_visitors_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVisitors = visitors.filter(v => {
    const term = searchTerm.toLowerCase();
    return (
      (v.fullName && v.fullName.toLowerCase().includes(term)) ||
      (v.email && v.email.toLowerCase().includes(term)) ||
      (v.phone && v.phone.includes(term)) ||
      (v.itiInstitute && v.itiInstitute.toLowerCase().includes(term)) ||
      (v.visitorToken && v.visitorToken.toLowerCase().includes(term))
    );
  });

  const totalVisitsCount = visitors.reduce((acc, v) => acc + (v.totalVisits || 1), 0);
  const uniqueInstitutesCount = new Set(visitors.map(v => v.itiInstitute).filter(Boolean)).size;

  const getActivityBadgeColor = (type) => {
    switch (type) {
      case 'VIDEO_VIEW': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', icon: '🎥' };
      case 'TEST_START': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: '📝' };
      case 'TEST_SUBMIT': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: '🏆' };
      case 'PDF_VIEW': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: '📄' };
      default: return { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', icon: '🌐' };
    }
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h2 className="m-0 fw-extrabold" style={{ color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
            Visitor Identification & Tracking
          </h2>
          <p className="small text-secondary m-0 mt-1">
            Monitor registered ITI student visitors, persistent UUID tokens, and real-time learning activity logs.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={fetchVisitors}
            disabled={loading}
            className="btn btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
          >
            
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!visitors.length}
            className="btn px-3 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', fontSize: '0.9rem' }}
          >
            <FileUp size={16} />
            <span>Export CSV </span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="small font-semibold uppercase text-secondary d-block mb-1">Total Registered Students</span>
                <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-heading)', fontSize: '2rem' }}>
                  {visitors.length}
                </h3>
              </div>
              <div className="p-3 rounded-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="small font-semibold uppercase text-secondary d-block mb-1">Total Learning Sessions</span>
                <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-heading)', fontSize: '2rem' }}>
                  {totalVisitsCount}
                </h3>
              </div>
              <div className="p-3 rounded-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <Activity size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="small font-semibold uppercase text-secondary d-block mb-1">Active ITI Institutes</span>
                <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-heading)', fontSize: '2rem' }}>
                  {uniqueInstitutesCount}
                </h3>
              </div>
              <div className="p-3 rounded-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <Building2 size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h5 className="fw-bold m-0" style={{ color: 'var(--text-heading)' }}>
            Registered Visitors Roster
          </h5>

          {/* Search Bar */}
          <div className="input-group" style={{ maxWidth: '360px' }}>
            <span className="input-group-text border-end-0 rounded-start-pill bg-transparent" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 rounded-end-pill bg-transparent"
              placeholder="Search by name, email, phone, institute..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase" style={{ fontSize: '0.72rem' }}>Student Name</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase" style={{ fontSize: '0.72rem' }}>Contact Info</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase" style={{ fontSize: '0.72rem' }}>ITI Institute</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase text-center" style={{ fontSize: '0.72rem' }}>Sessions</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase" style={{ fontSize: '0.72rem' }}>Last Active</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase text-end" style={{ fontSize: '0.72rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <p className="small text-secondary m-0">Loading student visitor records...</p>
                  </td>
                </tr>
              ) : filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    <Users size={36} className="mb-2 opacity-50" />
                    <p className="m-0">No registered visitors match your search.</p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {/* Name & UUID */}
                    <td className="px-3 py-2.5">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
                            fontSize: '0.9rem'
                          }}
                        >
                          {(visitor.fullName || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: 'var(--text-heading)' }}>
                            {visitor.fullName}
                          </div>
                          <div className="text-muted small font-monospace" style={{ fontSize: '0.7rem' }}>
                            UUID: {(visitor.visitorToken || visitor.id).substring(0, 13)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-3 py-2.5">
                      <div className="d-flex flex-column gap-1 small">
                        <div className="d-flex align-items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                          <Phone size={14} className="text-primary" />
                          <span>+91 {visitor.phone}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1.5 text-secondary">
                          <Mail size={14} />
                          <span>{visitor.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Institute */}
                    <td className="px-3 py-2.5">
                      <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)', fontWeight: '500' }}>
                        <Building2 size={13} className="me-1.5 text-warning" />
                        {visitor.itiInstitute}
                      </span>
                    </td>

                    {/* Sessions */}
                    <td className="px-3 py-2.5 text-center">
                      <span className="badge rounded-pill px-3 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '0.8rem' }}>
                        {visitor.totalVisits || 1}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="px-3 py-2.5">
                      <div className="d-flex align-items-center gap-1.5 small text-secondary">
                        <Calendar size={14} />
                        <span>{visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5 text-end">
                      <button
                        onClick={() => handleViewActivities(visitor)}
                        className="btn btn-sm px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 shadow-sm"
                        style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary)' }}
                      >
                        <Eye size={14} />
                        <span className="small fw-bold">Activities ({visitor._count?.activities || 0})</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs Drawer / Modal */}
      {selectedVisitor && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-end animate-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
          onClick={() => setSelectedVisitor(null)}
        >
          <div
            className="h-100 p-4 d-flex flex-column border-start animate-slide-left shadow-lg"
            style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <span className="badge rounded-pill mb-1" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', fontSize: '0.7rem' }}>
                  Student Activity Logs
                </span>
                <h5 className="fw-bold m-0" style={{ color: 'var(--text-heading)' }}>
                  {selectedVisitor.fullName}
                </h5>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="btn btn-sm btn-light rounded-circle p-2 border-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Visitor Info Summary Box */}
            <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">UUID Token:</span>
                  <span className="font-monospace fw-bold text-truncate" style={{ maxWidth: '220px' }}>{selectedVisitor.visitorToken || selectedVisitor.id}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">Phone Number:</span>
                  <span className="fw-bold">+91 {selectedVisitor.phone}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">Institute:</span>
                  <span className="fw-bold text-end">{selectedVisitor.itiInstitute}</span>
                </div>
              </div>
            </div>

            {/* Activities Timeline */}
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <Activity size={18} className="text-primary" />
              <span>Activity History</span>
            </h6>

            <div className="flex-grow-1 overflow-auto pe-2">
              {loadingActivities ? (
                <div className="text-center py-5">
                  <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                  <p className="small text-secondary m-0">Loading activity timeline...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <Clock size={32} className="mb-2 opacity-50" />
                  <p className="small m-0">No specific learning activities recorded yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {activities.map((act) => {
                    const styleInfo = getActivityBadgeColor(act.activityType);
                    return (
                      <div key={act.id} className="p-3 rounded-3 d-flex gap-3 align-items-start" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '38px', height: '38px', backgroundColor: styleInfo.bg, color: styleInfo.color, fontSize: '1.2rem' }}
                        >
                          {styleInfo.icon}
                        </div>
                        <div className="overflow-hidden flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge rounded-pill" style={{ backgroundColor: styleInfo.bg, color: styleInfo.color, fontSize: '0.65rem', fontWeight: '700' }}>
                              {act.activityType}
                            </span>
                            <span className="small text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>
                              {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(act.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                            </span>
                          </div>
                          {act.resourceId && (
                            <div className="small fw-bold text-truncate" style={{ color: 'var(--text-heading)' }}>
                              Resource: {act.resourceId}
                            </div>
                          )}
                          {act.duration > 0 && (
                            <div className="small text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
                              Duration: {act.duration} seconds
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 mt-3 border-top d-grid" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="btn btn-secondary py-2 rounded-pill fw-bold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
