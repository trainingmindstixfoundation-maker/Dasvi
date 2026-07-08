import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './services/i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContinueButton from './components/FloatingContinueButton';
import ScrollToTop from './components/ScrollToTop';
import { loadDefaultLessons } from './services/csvService';

// Standard Pages
const Home = lazy(() => import('./pages/Home'));
const Trade = lazy(() => import('./pages/Trade'));
const Modules = lazy(() => import('./pages/Modules'));
const Lessons = lazy(() => import('./pages/Lessons'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview'));
const ClassManagement = lazy(() => import('./pages/admin/ClassManagement'));
const MediumManagement = lazy(() => import('./pages/admin/MediumManagement'));
const SubjectManagement = lazy(() => import('./pages/admin/SubjectManagement'));
const VideoManagement = lazy(() => import('./pages/admin/VideoManagement'));
const TestQuizManagement = lazy(() => import('./pages/admin/TestQuizManagement'));
const ReportsManagement = lazy(() => import('./pages/admin/ReportsManagement'));
const FeedbackManagement = lazy(() => import('./pages/admin/FeedbackManagement'));
const VisitorManagement = lazy(() => import('./pages/admin/VisitorManagement'));

function InnerApp({ lessons, isCustomData, searchQuery, setSearchQuery, handleCSVLoaded }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVideoRoute = location.pathname.startsWith('/lesson');

  return (
    <div id="root">
      {!isAdminRoute && (
        <Navbar 
          onCSVLoaded={handleCSVLoaded} 
          isCustomData={isCustomData} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <Suspense fallback={<div className="d-flex flex-column align-items-center justify-content-center py-5">Loading page…</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home lessons={lessons} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/trade/:tradeName" caseSensitive={false} element={<Trade lessons={lessons} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/trade/:tradeName/semester/:semester" caseSensitive={false} element={<Modules lessons={lessons} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/trade/:tradeName/semester/:semester/module/:moduleName" caseSensitive={false} element={<Lessons lessons={lessons} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/module/:moduleName" caseSensitive={false} element={<Lessons lessons={lessons} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/lesson/:lessonId" element={<VideoPlayer lessons={lessons} />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="classes" element={<ClassManagement />} />
            <Route path="mediums" element={<MediumManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="videos" element={<VideoManagement />} />
            <Route path="tests" element={<TestQuizManagement />} />
            <Route path="reports" element={<ReportsManagement />} />
            <Route path="feedbacks" element={<FeedbackManagement />} />
            <Route path="visitors" element={<VisitorManagement />} />
          </Route>
        </Routes>
      </Suspense>

      {!isAdminRoute && !isVideoRoute && <Footer />}
      {!isAdminRoute && <FloatingContinueButton />}
    </div>
  );
}

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [isCustomData, setIsCustomData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load default CSV lessons on startup
  useEffect(() => {
    async function init() {
      try {
        const data = await loadDefaultLessons();
        setLessons(data);
      } catch (err) {
        console.error("Failed to load default CSV data:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCSVLoaded = (newLessons, isCustom = true) => {
    setLessons(newLessons);
    setIsCustomData(isCustom);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', fontFamily: 'var(--font-heading)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem', color: 'var(--brand-primary)' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>Dasvi</h4>
        <small className="fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--brand-secondary)' }}>Dasvi Platform</small>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <InnerApp 
          lessons={lessons} 
          isCustomData={isCustomData} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleCSVLoaded={handleCSVLoaded} 
        />
      </Router>
    </LanguageProvider>
  );
}
