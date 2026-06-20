import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Languages,
  Book,
  Video,
  FileQuestion,
  BarChart3,
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useLanguage } from '../../services/i18n';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dasvi-theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dasvi-theme', nextTheme);
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: t('admin.nav.dashboard')
    },
    {
      path: '/admin/classes',
      icon: <BookOpen className="w-5 h-5" />,
      label: t('admin.nav.classes')
    },
    {
      path: '/admin/mediums',
      icon: <Languages className="w-5 h-5" />,
      label: t('admin.nav.mediums')
    },
    {
      path: '/admin/subjects',
      icon: <Book className="w-5 h-5" />,
      label: t('admin.nav.subjects')
    },
    {
      path: '/admin/videos',
      icon: <Video className="w-5 h-5" />,
      label: t('admin.nav.videos')
    },
    {
      path: '/admin/tests',
      icon: <FileQuestion className="w-5 h-5" />,
      label: t('admin.nav.tests')
    },
    {
      path: '/admin/reports',
      icon: <BarChart3 className="w-5 h-5" />,
      label: t('admin.nav.reports')
    }
  ];

  const handleLogout = () => {
    // Clear admin auth state if any (we will use sessionStorage or localStorage)
    sessionStorage.removeItem('admin_authenticated');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-dark-border">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {t('admin.nav.adminPanel')}
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-dark-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('admin.nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
            {/* Admin Language Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                <Languages className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    language === 'en' ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('mr')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    language === 'mr' ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    language === 'hi' ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-dark-border">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Admin User
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
