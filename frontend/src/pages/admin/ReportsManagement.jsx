import React, { useState, useMemo } from 'react';
import {
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  PlayCircle,
  BarChart2,
  Calendar,
  Layers,
  BookOpen,
  MonitorPlay,
  ExternalLink,
  XCircle
} from 'lucide-react';
import {
  mockVideos,
  mockSubjects,
  mockClasses,
  mockMediums
} from '../../data/mockData';

export default function ReportsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dateRange, setDateRange] = useState('');

  // Base Report Data
  const baseReportData = useMemo(() => {
    return mockVideos.map((video) => {
      const subject = mockSubjects.find((s) => s.id === video.subjectId);
      const cls = mockClasses.find((c) => c.id === subject?.classId);
      const medium = mockMediums.find((m) => m.id === subject?.mediumId);
      return {
        id: video.id,
        title: video.title?.en || 'Unknown Title',
        classId: cls?.id || '',
        className: cls?.name?.en || 'Unknown',
        mediumId: medium?.id || '',
        mediumName: medium?.name?.en || 'Unknown',
        subjectId: subject?.id || '',
        subjectName: subject?.name?.en || 'Unknown',
        views: video.views || 0,
        completionRate: Math.floor(Math.random() * 40) + 60,
        avgWatchTime: '08:45',
        uploadDate: new Date(video.createdAt).toLocaleDateString()
      };
    });
  }, []);

  // Filtered Data based on selections
  const filteredData = useMemo(() => {
    return baseReportData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass ? item.classId === selectedClass : true;
      const matchesMedium = selectedMedium ? item.mediumId === selectedMedium : true;
      const matchesSubject = selectedSubject ? item.subjectId === selectedSubject : true;
      return matchesSearch && matchesClass && matchesMedium && matchesSubject;
    });
  }, [baseReportData, searchTerm, selectedClass, selectedMedium, selectedSubject]);

  // Derived Options for Cascading Dropdowns
  const availableMediumIds = useMemo(() => {
    if (!selectedClass) return mockMediums.map(m => m.id);
    const subjectsInClass = mockSubjects.filter(s => s.classId === selectedClass);
    return [...new Set(subjectsInClass.map(s => s.mediumId))];
  }, [selectedClass]);

  const availableSubjectIds = useMemo(() => {
    let subjects = mockSubjects;
    if (selectedClass) subjects = subjects.filter(s => s.classId === selectedClass);
    if (selectedMedium) subjects = subjects.filter(s => s.mediumId === selectedMedium);
    return [...new Set(subjects.map(s => s.id))];
  }, [selectedClass, selectedMedium]);

  const handleClearFilters = () => {
    setSelectedClass('');
    setSelectedMedium('');
    setSelectedSubject('');
    setDateRange('');
    setSearchTerm('');
  };

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ['Video Content', 'Hierarchy', 'Total Views', 'Completion Rate', 'Avg Watch Time', 'Upload Date'];
    const rows = filteredData.map(row => [
      `"${row.title}"`,
      `"${row.className} / ${row.mediumName} / ${row.subjectName}"`,
      row.views,
      `${row.completionRate}%`,
      row.avgWatchTime,
      row.uploadDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dasvi_reports_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h2 className="m-0 fw-extrabold" style={{ color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
            Analytics & Reports
          </h2>
          <p className="small text-secondary m-0 mt-1">
            Detailed performance metrics and insights for your platform
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!filteredData.length}
          className="btn px-3 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
          style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', fontSize: '0.9rem' }}
        >
          <ExternalLink size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important', boxShadow: 'var(--glass-shadow)' }}>
            <div className="d-flex justify-content-between align-items-center h-100">
              <div className="d-flex flex-column justify-content-center">
                <span className="small text-muted-custom fw-semibold mb-1">Total Views</span>
                <span className="h3 fw-extrabold m-0" style={{ color: 'var(--text-heading)' }}>
                  4,190
                </span>
              </div>
              <div className="p-3 rounded-4 flex-shrink-0" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <PlayCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important', boxShadow: 'var(--glass-shadow)' }}>
            <div className="d-flex justify-content-between align-items-center h-100">
              <div className="d-flex flex-column justify-content-center">
                <span className="small text-muted-custom fw-semibold mb-1">Avg. Completion</span>
                <span className="h3 fw-extrabold m-0" style={{ color: 'var(--text-heading)' }}>
                  78%
                </span>
              </div>
              <div className="p-3 rounded-4 flex-shrink-0" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <BarChart2 size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important', boxShadow: 'var(--glass-shadow)' }}>
            <div className="d-flex justify-content-between align-items-center h-100">
              <div className="d-flex flex-column justify-content-center">
                <span className="small text-muted-custom fw-semibold mb-1">Total Watch Time</span>
                <span className="h3 fw-extrabold m-0" style={{ color: 'var(--text-heading)' }}>
                  842<span className="fs-5 text-muted-custom ms-1 fw-normal">hrs</span>
                </span>
              </div>
              <div className="p-3 rounded-4 flex-shrink-0" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <Clock size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 rounded-4 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0 fw-bold" style={{ color: 'var(--text-heading)' }}>Filter Reports</h6>
          <button onClick={handleClearFilters} className="btn btn-sm btn-link text-decoration-none text-danger d-flex align-items-center gap-1 p-0 border-0 outline-none">
            <XCircle size={14} /> Clear Filters
          </button>
        </div>
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold text-secondary text-uppercase mb-1 d-flex align-items-center gap-1">
              <Calendar size={14} /> Date Range
            </label>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="form-select bg-transparent" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              <option value="">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
              <option value="365">This Year</option>
            </select>
          </div>
          
          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold text-secondary text-uppercase mb-1 d-flex align-items-center gap-1">
              <Layers size={14} /> Class
            </label>
            <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedMedium(''); setSelectedSubject(''); }} className="form-select bg-transparent" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              <option value="">All Classes</option>
              {mockClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name.en}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold text-secondary text-uppercase mb-1 d-flex align-items-center gap-1">
              <MonitorPlay size={14} /> Medium
            </label>
            <select value={selectedMedium} onChange={e => { setSelectedMedium(e.target.value); setSelectedSubject(''); }} className="form-select bg-transparent" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              <option value="">All Mediums</option>
              {mockMediums.filter(m => availableMediumIds.includes(m.id)).map((m) => (
                <option key={m.id} value={m.id}>{m.name.en}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold text-secondary text-uppercase mb-1 d-flex align-items-center gap-1">
              <BookOpen size={14} /> Subject
            </label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="form-select bg-transparent" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              <option value="">All Subjects</option>
              {mockSubjects.filter(s => availableSubjectIds.includes(s.id)).map((s) => (
                <option key={s.id} value={s.id}>{s.name.en}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card border-0 rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle) !important' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h5 className="fw-bold m-0" style={{ color: 'var(--text-heading)' }}>
            Video Performance Details
          </h5>
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text border-end-0 rounded-start-pill bg-transparent" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-control border-start-0 rounded-end-pill bg-transparent"
              placeholder="Search reports..."
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle m-0" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase" style={{ fontSize: '0.72rem' }}>Video Content</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase" style={{ fontSize: '0.72rem' }}>Hierarchy</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase text-end" style={{ fontSize: '0.72rem' }}>Total Views</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase text-end" style={{ fontSize: '0.72rem' }}>Completion</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase text-end" style={{ fontSize: '0.72rem' }}>Avg Watch</th>
                <th className="px-3 py-2.5 text-secondary small fw-bold uppercase text-end" style={{ fontSize: '0.72rem' }}>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted small">
                    No results match your filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="px-3 py-2.5">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded d-flex align-items-center justify-content-center text-white p-2" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                          <PlayCircle size={16} className="text-primary" />
                        </div>
                        <span className="fw-bold text-heading">{row.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted small">
                      {row.className} / {row.mediumName} / {row.subjectName}
                    </td>
                    <td className="px-3 py-2.5 text-end fw-bold">
                      {row.views.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <span className="fw-bold">{row.completionRate}%</span>
                        <div className="progress" style={{ width: '60px', height: '6px' }}>
                          <div
                            className={`progress-bar ${row.completionRate > 75 ? 'bg-success' : row.completionRate > 50 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${row.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-end">
                      <span className="badge bg-light text-secondary border">{row.avgWatchTime}</span>
                    </td>
                    <td className="px-3 py-2.5 text-end text-muted small">
                      {row.uploadDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}