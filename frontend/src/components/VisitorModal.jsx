import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Mail, Phone, Building2, X } from 'lucide-react';

export default function VisitorModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    itiInstitute: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    // Name Validation Requirement: First Name + Middle Name + Surname
    const nameParts = formData.fullName.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length < 3) {
      setError('Name should contain First Name + Middle Name + Surname.');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number.');
      return false;
    }
    if (!formData.itiInstitute) {
      setError('Please enter your School / Institute Name.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('visitor_token', token);
      
      try {
        const response = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, visitorToken: token })
        });
        if (!response.ok) {
           console.warn('Backend registration failed, but proceeding locally.');
        }
      } catch (err) {
        console.warn('Backend API not responding, proceeding locally.');
      }

      setLoading(false);
      if (onSuccess) onSuccess(token);
      if (onClose) onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(15, 12, 30, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        padding: '15px'
      }}
    >
      <div
        className="rounded-4 p-3 p-sm-4 bg-white d-flex flex-column shadow-lg animate-zoom-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2 text-primary">
            <ShieldCheck size={24} />
            <h4 className="m-0 fw-bold">Student Verification</h4>
          </div>
          {onClose && (
            <button onClick={onClose} className="btn btn-sm btn-light p-2 rounded-circle border-0">
              <X size={18} />
            </button>
          )}
        </div>

        <p className="small text-muted mb-4">
          Please enter your details to access this premium video lesson. This is a one-time verification.
        </p>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-bold mb-1">Full Name <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><User size={16} className="text-secondary" /></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="First Middle Surname"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>Requirement: First Name + Middle Name + Surname</small>
          </div>

          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-bold mb-1">Phone Number <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-secondary" /></span>
                <input
                  type="tel"
                  className="form-control border-start-0 ps-0"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-bold mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-secondary" /></span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label small fw-bold mb-1">School / ITI Institute <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Building2 size={16} className="text-secondary" /></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Government ITI Thane"
                value={formData.itiInstitute}
                onChange={(e) => setFormData({ ...formData, itiInstitute: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 fw-bold py-2 mt-2 shadow-sm rounded-3"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', border: 'none' }}
          >
            {loading ? 'Verifying...' : 'Verify & Continue to Lesson'}
          </button>
        </form>
      </div>
    </div>
  );
}
