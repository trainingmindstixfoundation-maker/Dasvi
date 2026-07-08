import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Languages, Book, Video,
  FileQuestion, BarChart3, LogOut, Menu, X,
  MessageSquare, Users
} from 'lucide-react';
import { useLanguage } from '../../services/i18n';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', exact: true, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/classes', icon: <BookOpen size={20} />, label: 'Classes' },
    { path: '/admin/mediums', icon: <Languages size={20} />, label: 'Mediums' },
    { path: '/admin/subjects', icon: <Book size={20} />, label: 'Subjects' },
    { path: '/admin/videos', icon: <Video size={20} />, label: 'Videos' },
    { path: '/admin/tests', icon: <FileQuestion size={20} />, label: 'Tests' },
    { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { path: '/admin/feedbacks', icon: <MessageSquare size={20} />, label: 'Feedback' },
    { path: '/admin/visitors', icon: <Users size={20} />, label: 'Visitor' }
  ];

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="bg-white border-end d-flex flex-column transition-all sidebar-container"
        style={{
          width: '260px',
          minWidth: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ height: '70px', borderColor: 'var(--border-subtle)' }}>
          <div className="d-flex align-items-center gap-2 text-primary">
            <div className="p-2 rounded rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: '#2b3674', color: 'white', width: '36px', height: '36px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18L10 6L14 12L18 6L20 18H4Z" />
              </svg>
            </div>
            <span className="fs-5 fw-extrabold text-heading" style={{ letterSpacing: '-0.03em' }}>Dasvi Admin</span>
          </div>
        </div>

        <div className="flex-grow-1 overflow-y-auto py-3 px-3 d-flex flex-column gap-1">
          <div className="small text-muted-custom fw-bold text-uppercase mb-2 px-2" style={{ fontSize: '0.7rem' }}>Menu</div>
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path || location.pathname === '/admin/'
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all fw-bold ${
                  isActive 
                    ? 'text-white shadow-sm' 
                    : 'text-muted-custom hover-bg-light'
                }`}
                style={{ 
                  fontSize: '0.9rem',
                  background: isActive ? 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)' : 'transparent',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)' }}>
              AD
            </div>
            <div className="d-flex flex-column">
              <span className="fw-bold text-heading" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>Administrator</span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>System Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn p-2 text-danger rounded-circle d-flex align-items-center justify-content-center hover-bg-light" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="flex-grow-1 d-flex flex-column transition-all main-content-area"
        style={{
          width: '100%',
          backgroundColor: '#f8f9fa' // Slightly lighter background for the content
        }}
      >
        {/* Page Content */}
        <div className="p-3 p-md-4 p-lg-4 overflow-auto flex-grow-1">
          <Outlet />
        </div>
      </main>

      {/* Inline styles for media queries and hover */}
      <style>{`
        .sidebar-container { display: flex !important; }
        .main-content-area { width: 100% !important; }
        .hover-bg-light:hover { background-color: rgba(0,0,0,0.05); color: var(--text-heading) !important; }
      `}</style>
    </div>
  );
}
