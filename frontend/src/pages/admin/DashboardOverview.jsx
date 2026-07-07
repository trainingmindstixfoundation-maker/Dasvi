import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/adminService';
import { BookOpen, Layers, Library, Video, Plus, ArrowRight, TrendingUp } from 'lucide-react';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [graphPeriod, setGraphPeriod] = useState('monthly'); // daily, weekly, monthly, yearly
  const [activeTooltip, setActiveTooltip] = useState(null); // { x, y, label, value }

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 py-5">
        <div className="spinner-border text-primary" role="status" style={{ color: 'var(--brand-secondary)' }}>
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // Backend returns: { stats: { totalClasses, ... }, recentVideos, contentOverview, topSubjects, growthHistory }
  const raw = stats || {};
  const rawStats = raw.stats || {};
  const growthHistory = raw.growthHistory || [];

  const safeStats = {
    totalClasses: rawStats.totalClasses ?? 0,
    totalMediums: rawStats.totalMediums ?? 0,
    totalSubjects: rawStats.totalSubjects ?? 0,
    totalVideos: rawStats.totalVideos ?? 0,
    recentVideos: raw.recentVideos || [],
    contentOverview: raw.contentOverview || [],
    topSubjects: raw.topSubjects || [],
    contentGrowth: {
      labels: growthHistory.map(g => g.month),
      videos: growthHistory.map(g => g.videos),
      subjects: growthHistory.map(g => g.subjects),
      monthly: {
        labels: growthHistory.map(g => g.month),
        videos: growthHistory.map(g => g.videos)
      }
    }
  };

  const statCards = [
    { label: 'Total Classes', value: safeStats.totalClasses, icon: <BookOpen size={22} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Total Mediums', value: safeStats.totalMediums, icon: <Layers size={22} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Total Subjects', value: safeStats.totalSubjects, icon: <Library size={22} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Total Videos', value: safeStats.totalVideos, icon: <Video size={22} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
  ];

  // Define Graph Data for Daily, Weekly, Monthly, Yearly
  const getGraphData = () => {
    switch (graphPeriod) {
      case 'daily':
        return {
          labels: safeStats.contentGrowth?.daily?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: safeStats.contentGrowth?.daily?.videos || [0, 0, 0, 0, 0, 0, 0],
          title: 'Daily Uploads'
        };
      case 'weekly':
        return {
          labels: safeStats.contentGrowth?.weekly?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          values: safeStats.contentGrowth?.weekly?.videos || [0, 0, 0, 0],
          title: 'Weekly Uploads'
        };
      case 'yearly':
        return {
          labels: safeStats.contentGrowth?.yearly?.labels || ['2022', '2023', '2024', '2025', '2026'],
          values: safeStats.contentGrowth?.yearly?.videos || [0, 0, 0, 0, 0],
          title: 'Yearly Upload Cumulative'
        };
      case 'monthly':
      default:
        // Use monthly cumulative growth values from backend/service stats if available
        return {
          labels: safeStats.contentGrowth?.monthly?.labels || safeStats.contentGrowth?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          values: safeStats.contentGrowth?.monthly?.videos || safeStats.contentGrowth?.videos || [0, 0, 0, 0, 0, 0],
          title: 'Monthly Cumulative Uploads'
        };
    }
  };

  const graphData = getGraphData();

  // Helper function to plot SVG line coordinates
  const getSvgCoordinates = (values, width = 500, height = 150) => {
    if (values.length === 0) return [];
    const max = Math.max(...values, 10);
    const min = 0;
    const padding = 20;
    const usableHeight = height - padding * 2;
    const usableWidth = width - padding * 2;
    const stepX = values.length > 1 ? usableWidth / (values.length - 1) : usableWidth;

    return values.map((val, idx) => {
      const x = padding + idx * stepX;
      const y = padding + (usableHeight - ((val - min) / (max - min)) * usableHeight);
      return { x, y, val };
    });
  };

  const coords = getSvgCoordinates(graphData.values);

  // Generate SVG path strings
  const getLinePath = (coordinates) => {
    if (coordinates.length === 0) return '';
    return coordinates.reduce((path, c, idx) => {
      return idx === 0 ? `M ${c.x} ${c.y}` : `${path} L ${c.x} ${c.y}`;
    }, '');
  };

  const getAreaPath = (coordinates, height = 150) => {
    if (coordinates.length === 0) return '';
    const linePath = getLinePath(coordinates);
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    return `${linePath} L ${last.x} ${height - 20} L ${first.x} ${height - 20} Z`;
  };

  const linePath = getLinePath(coords);
  const areaPath = getAreaPath(coords);

  // Pie Chart calculations using real language counts from medium data
  const languages = safeStats.contentOverview && safeStats.contentOverview.length > 0
    ? safeStats.contentOverview.map((item, idx) => {
        const colors = ['var(--brand-primary)', 'var(--brand-secondary)', 'var(--accent-green)', '#8b5cf6', '#f59e0b', '#ec4899'];
        return {
          label: item.name,
          count: item.count,
          color: colors[idx % colors.length]
        };
      })
    : [
        { label: 'English', count: 0, color: 'var(--brand-primary)' },
        { label: 'Hindi', count: 0, color: 'var(--brand-secondary)' },
        { label: 'Marathi', count: 0, color: 'var(--accent-green)' }
      ];

  const pieTotal = languages.reduce((sum, item) => sum + item.count, 0);

  // Helper to build SVG Pie Chart slices
  const getPieSlices = () => {
    if (pieTotal === 0) {
      return [{
        pathData: `M 50 50 L 50 0 A 50 50 0 1 1 49.99 0 Z`,
        color: 'var(--border-subtle)',
        label: 'No Videos',
        percentage: '100',
        count: 0
      }];
    }
    let accumulatedAngle = 0;
    const radius = 50;
    const cx = 50;
    const cy = 50;

    return languages.map((lang) => {
      const percentage = (lang.count / pieTotal) * 100;
      const angle = (lang.count / pieTotal) * 360;

      // Coordinates of slice points
      const radStart = (accumulatedAngle - 90) * (Math.PI / 180);
      const radEnd = (accumulatedAngle + angle - 90) * (Math.PI / 180);

      const x1 = cx + radius * Math.cos(radStart);
      const y1 = cy + radius * Math.sin(radStart);
      const x2 = cx + radius * Math.cos(radEnd);
      const y2 = cy + radius * Math.sin(radEnd);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      accumulatedAngle += angle;
      return {
        pathData,
        color: lang.color,
        label: lang.label,
        percentage: percentage.toFixed(0),
        count: lang.count
      };
    });
  };

  const pieSlices = getPieSlices();

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h2 className="m-0 fw-extrabold" style={{ color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
            Dashboard Overview
          </h2>
          <p className="text-muted-custom small m-0">
            Real-time analytics and quick system actions
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3">
        {statCards.map((card, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-xl-3">
            <div
              className="p-3 border rounded-3 d-flex align-items-center justify-content-between position-relative overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <div className="d-flex flex-column">
                <span className="small text-muted-custom fw-semibold mb-1">
                  {card.label}
                </span>
                <span className="h3 fw-extrabold m-0" style={{ color: 'var(--text-heading)' }}>
                  {card.value}
                </span>
              </div>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: card.bg,
                  color: card.color
                }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Grid */}
      <div>
        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>Quick Actions</h5>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <button
              onClick={() => navigate('/admin/classes', { state: { openAdd: true } })}
              className="w-100 btn d-flex flex-column align-items-center justify-content-center py-4 px-3 rounded-3 border-0 transition-all text-center"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                color: '#3b82f6',
                gap: '10px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="p-2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center">
                <Plus size={20} />
              </div>
              <span className="small fw-bold">Add Class</span>
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button
              onClick={() => navigate('/admin/mediums', { state: { openAdd: true } })}
              className="w-100 btn d-flex flex-column align-items-center justify-content-center py-4 px-3 rounded-3 border-0 transition-all text-center"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                color: '#10b981',
                gap: '10px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="p-2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center">
                <Plus size={20} />
              </div>
              <span className="small fw-bold">Add Medium</span>
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button
              onClick={() => navigate('/admin/subjects', { state: { openAdd: true } })}
              className="w-100 btn d-flex flex-column align-items-center justify-content-center py-4 px-3 rounded-3 border-0 transition-all text-center"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                color: '#8b5cf6',
                gap: '10px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="p-2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center">
                <Plus size={20} />
              </div>
              <span className="small fw-bold">Add Subject</span>
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button
              onClick={() => navigate('/admin/videos', { state: { openAdd: true } })}
              className="w-100 btn d-flex flex-column align-items-center justify-content-center py-4 px-3 rounded-3 border-0 transition-all text-center"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                color: '#f59e0b',
                gap: '10px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="p-2 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center">
                <Plus size={20} />
              </div>
              <span className="small fw-bold">Upload Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts & Widgets Area */}
      <div className="row g-4">
        {/* Left: Custom SVG Graph and Widgets */}
        <div className="col-12 col-xl-8 d-flex flex-column gap-4">
          
          {/* Real-time Custom SVG Line Chart */}
          <div
            className="p-4 border rounded-3 d-flex flex-column position-relative"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--glass-shadow)',
              minHeight: '340px'
            }}
          >
            {/* Header / Period Select */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <TrendingUp size={20} style={{ color: 'var(--brand-secondary)' }} />
                <h5 className="m-0 fw-bold" style={{ color: 'var(--text-heading)' }}>
                  Upload Trends
                </h5>
              </div>
              <div
                className="d-inline-flex p-1 rounded-pill"
                style={{ backgroundColor: 'var(--search-bg)' }}
              >
                {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setGraphPeriod(period)}
                    className="btn btn-sm py-1.5 px-3 rounded-pill text-capitalize border-0"
                    style={{
                      backgroundColor: graphPeriod === period ? 'var(--bg-secondary)' : 'transparent',
                      color: graphPeriod === period ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      fontWeight: graphPeriod === period ? '700' : '500',
                      fontSize: '0.75rem'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Plot Wrapper */}
            <div className="flex-grow-1 position-relative w-100" style={{ height: '180px' }}>
              <svg viewBox="0 0 500 150" width="100%" height="100%" preserveAspectRatio="none">
                {/* Background Grid Lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="20" y1="75" x2="480" y2="75" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="20" y1="130" x2="480" y2="130" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3" />

                {/* SVG Area Under Path */}
                {coords.length > 0 && (
                  <path
                    d={areaPath}
                    fill="url(#area-gradient)"
                    opacity="0.15"
                  />
                )}

                {/* SVG Stroke Line Path */}
                {coords.length > 0 && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="var(--brand-secondary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Points */}
                {coords.map((coord, idx) => (
                  <circle
                    key={idx}
                    cx={coord.x}
                    cy={coord.y}
                    r={activeTooltip?.index === idx ? 6 : 4}
                    fill={activeTooltip?.index === idx ? 'var(--brand-primary)' : 'var(--brand-secondary)'}
                    stroke="var(--bg-secondary)"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                      setActiveTooltip({
                        index: idx,
                        x: ((coord.x / 500) * parentRect.width),
                        y: ((coord.y / 150) * parentRect.height),
                        label: graphData.labels[idx],
                        value: coord.val
                      });
                    }}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                ))}

                {/* Gradients Definitions */}
                <defs>
                  <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-secondary)" />
                    <stop offset="100%" stopColor="var(--brand-secondary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Real-time Tooltip overlay */}
              {activeTooltip && (
                <div
                  className="position-absolute p-2 rounded border shadow-sm text-center animate-fade-in"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--brand-secondary)',
                    left: `${activeTooltip.x}px`,
                    top: `${activeTooltip.y - 50}px`,
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}
                >
                  <span className="d-block small text-muted-custom font-semibold" style={{ fontSize: '0.65rem' }}>
                    {activeTooltip.label}
                  </span>
                  <span className="d-block fw-bold text-heading" style={{ fontSize: '0.8rem' }}>
                    {activeTooltip.value} Videos
                  </span>
                </div>
              )}
            </div>

            {/* X-axis Labels */}
            <div className="d-flex justify-content-between px-3 mt-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              {graphData.labels.map((lbl, idx) => (
                <span key={idx} className="text-muted-custom fw-semibold" style={{ fontSize: '0.65rem' }}>
                  {lbl}
                </span>
              ))}
            </div>
          </div>

          {/* Widget: Recently Added Videos (3) */}
          <div
            className="p-4 border rounded-3 d-flex flex-column gap-3"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <h5 className="m-0 fw-bold" style={{ color: 'var(--text-heading)' }}>
                Recently Added Videos
              </h5>
              <button
                onClick={() => navigate('/admin/videos')}
                className="btn btn-link text-decoration-none d-flex align-items-center gap-1.5 p-0 border-0 outline-none text-heading font-bold"
                style={{ fontSize: '0.8rem', color: 'var(--brand-secondary)' }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              {safeStats.recentVideos.length > 0 ? (
                safeStats.recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="d-flex align-items-center gap-3 p-2.5 rounded-3 border transition-colors hover-bg"
                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-primary)' }}
                  >
                    {/* Video Thumbnail */}
                    <div
                      className="rounded overflow-hidden flex-shrink-0 bg-dark"
                      style={{ width: '80px', height: '48px' }}
                    >
                      <img
                        src={video.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                        alt={video.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-grow-1 text-truncate">
                      <h6 className="m-0 text-truncate font-bold small text-heading">
                        {video.title}
                      </h6>
                      <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                        <span className="badge px-2 py-1 rounded" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', fontSize: '0.65rem' }}>
                          {video.class?.name || 'Class'}
                        </span>
                        <span className="badge px-2 py-1 rounded bg-secondary-subtle text-dark" style={{ fontSize: '0.65rem' }}>
                          {video.medium?.name || 'Medium'}
                        </span>
                        <span className="badge px-2 py-1 rounded bg-secondary-subtle text-dark" style={{ fontSize: '0.65rem' }}>
                          {video.subject?.name || 'Subject'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted small">
                  No recently added videos. Use the actions above to upload!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Pie Chart Widget & Top Subjects List */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          
          {/* Custom SVG Pie Chart Widget */}
          <div
            className="p-4 border rounded-3 d-flex flex-column align-items-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--glass-shadow)',
              minHeight: '340px'
            }}
          >
            <div className="w-100 pb-2 border-bottom mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <h5 className="m-0 fw-bold" style={{ color: 'var(--text-heading)' }}>
                Videos by Language
              </h5>
            </div>

            {/* SVG Pie Representation */}
            <div className="position-relative d-flex align-items-center justify-content-center mb-4" style={{ width: '130px', height: '130px' }}>
              <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
                {pieSlices.map((slice, idx) => (
                  <path
                    key={idx}
                    d={slice.pathData}
                    fill={slice.color}
                    stroke="var(--bg-secondary)"
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                ))}
              </svg>
              {/* Inner Hole for Donut-style look */}
              <div
                className="position-absolute rounded-circle shadow-inner"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              />
            </div>

            {/* Legend */}
            <div className="w-100 d-flex flex-column gap-2 mt-auto">
              {pieSlices.map((slice, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded bg-light" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: slice.color }} />
                    <span className="small fw-semibold text-heading">{slice.label}</span>
                  </div>
                  <span className="small fw-bold text-muted-custom">{slice.count} videos ({slice.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Subjects List */}
          <div
            className="p-4 border rounded-3 d-flex flex-column gap-3"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <div className="pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <h5 className="m-0 fw-bold" style={{ color: 'var(--text-heading)' }}>
                Top Active Subjects
              </h5>
            </div>

            <div className="d-flex flex-column gap-3">
              {safeStats.topSubjects.length > 0 ? (
                safeStats.topSubjects.map((sub, idx) => (
                  <div key={idx} className="d-flex flex-column gap-1.5">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="small fw-bold text-heading">{sub.name}</span>
                      <span className="small text-muted-custom fw-semibold">{sub.videos} Videos ({sub.percent}%)</span>
                    </div>
                    {/* Custom progress bar */}
                    <div className="w-100 rounded-pill overflow-hidden" style={{ height: '6px', backgroundColor: 'var(--search-bg)' }}>
                      <div
                        className="h-100 rounded-pill"
                        style={{
                          width: `${sub.percent}%`,
                          background: 'linear-gradient(90deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)'
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted small">
                  No active subjects found.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
