import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, MapPopup } from '@/components/ui/map';
import { Button } from '@/components/ui/button';
import TextWrapper from '@/components/TextWrapper';

export default function Contact() {
  const [showPopup, setShowPopup] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct Gmail Compose URL prefilled with Name, From Email, Subject and Message
    const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contact@mindstixfoundation.org&su=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open Gmail composer in a new tab/window
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="container py-5 flex-grow-1 text-start">
      {/* Back Button */}
      <Link 
        to="/" 
        className="btn px-4 py-2 mb-4 d-inline-flex align-items-center gap-2 text-decoration-none shadow-sm"
        style={{ 
          borderRadius: '50px', 
          backgroundColor: 'var(--badge-bg)', 
          color: 'var(--brand-primary)', 
          border: '1px solid var(--border-subtle)',
          fontWeight: '600'
        }}
      >
        <i className="bi bi-arrow-left"></i>
        <span>Back to Home</span>
      </Link>

      {/* Page Header */}
      <div className="mb-5 pb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="fw-bold uppercase small d-block mb-1" style={{ letterSpacing: '0.1em', color: 'var(--brand-secondary)' }}>
          GET IN TOUCH
        </span>
        <h1 className="text-heading fw-bold display-6 m-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontWeight: '800' }}>
          Contact Mindstix Foundation
        </h1>
        <p className="text-muted-custom mt-2 mb-0">
          Have questions about the ITI Learning Platform, syllabus modules, or technical support? Feel free to reach out to us.
        </p>
      </div>

      <div className="row g-4 align-items-stretch">
        {/* Left Side: Address Details & Contact Form */}
        <div className="col-12 col-lg-5">
          <div className="card glow-card p-4 h-100 d-flex flex-column" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
            <h3 className="h5 text-heading fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)' }}>
              Mindstix Foundation Trust
            </h3>

            {/* Address Metas */}
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex gap-3 align-items-start">
                <div className="rounded-circle d-flex align-items-center justify-content-center p-2.5" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--brand-primary)', width: '40px', height: '40px', flexShrink: 0 }}>
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <h4 className="h6 fw-bold mb-1 text-heading">Office Address</h4>
                  <p className="text-muted-custom small mb-0" style={{ lineHeight: '1.45' }}>
                    604, Block A, Ashar Belleza, Road No. 16, Waghle Estate, Thane (W): 400604, Maharashtra, India.
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-start">
                <div className="rounded-circle d-flex align-items-center justify-content-center p-2.5" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--brand-secondary)', width: '40px', height: '40px', flexShrink: 0 }}>
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <h4 className="h6 fw-bold mb-1 text-heading">Email Inquiries</h4>
                  <p className="text-muted-custom small mb-0">
                    <a href="mailto:info@mindstixfoundation.org" className="text-decoration-none" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>contact@mindstixfoundation.org</a>
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-start">
                <div className="rounded-circle d-flex align-items-center justify-content-center p-2.5" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--brand-primary)', width: '40px', height: '40px', flexShrink: 0 }}>
                  <i className="bi bi-globe"></i>
                </div>
                <div>
                  <h4 className="h6 fw-bold mb-1 text-heading">Official Website</h4>
                  <p className="text-muted-custom small mb-0">
                    <a href="https://mindstixfoundation.org" target="_blank" rel="noopener noreferrer" className="text-decoration-none" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>mindstixfoundation.org</a>
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: 'var(--border-subtle)' }} />

            {/* Quick message form */}
            <h4 className="h6 fw-bold text-heading mb-3">Send Us a Message</h4>
            {formSubmitted ? (
              <div className="alert border-0 rounded-3 shadow-sm py-3 px-4 d-flex align-items-center gap-2 mb-0 mt-2" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
                <i className="bi bi-check2-circle fs-4"></i>
                <div>
                  <span className="fw-bold d-block">Message Received!</span>
                  <small className="small opacity-85">Thank you for your feedback. We will get back to you shortly.</small>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="row g-2">
                  <div className="col-6">
                    <input 
                      type="text" 
                      name="name"
                      className="form-control" 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      type="email" 
                      name="email"
                      className="form-control" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
                <div>
                  <input 
                    type="text" 
                    name="subject"
                    className="form-control" 
                    placeholder="Subject Topic" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <textarea 
                    name="message"
                    className="form-control" 
                    rows="3" 
                    placeholder="How can we help you?" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn py-2.5 px-4 text-white shadow-sm mt-1" 
                  style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)', border: 'none', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700' }}
                >
                  Send Message &rarr;
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Standalone Interactive Map Panel */}
        <div className="col-12 col-lg-7">
          <div className="position-relative h-100 w-full" style={{ minHeight: '450px' }}>
            <Map center={[19.1947, 72.9537]} zoom={15}>
              {showPopup && (
                <MapPopup
                  longitude={72.9537}
                  latitude={19.1947}
                  onClose={() => setShowPopup(false)}
                  closeButton
                >
                  <div className="space-y-2">
                    <h3 className="text-foreground font-semibold h6 fw-bold mb-1" style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-heading)' }}>
                      Mindstix Foundation Trust
                    </h3>
                    <p className="text-muted-custom small mb-3" style={{ lineHeight: '1.4', fontSize: '0.78rem' }}>
                      604, Block A, Ashar Belleza, Road No. 16, Waghle Estate, Thane (W): 400604.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-100"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </Button>
                  </div>
                </MapPopup>
              )}
            </Map>

            {!showPopup && (
              <Button
                size="sm"
                className="absolute position-absolute bottom-4 left-4 z-10 m-3 shadow-md"
                onClick={() => setShowPopup(true)}
                style={{ zIndex: 100, left: '12px', bottom: '12px', background: 'var(--brand-primary)' }}
              >
                Show Popup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
