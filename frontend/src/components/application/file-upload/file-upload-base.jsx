import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, RefreshCw, FileSpreadsheet, X } from 'lucide-react';

export const getReadableFileSize = (bytes) => {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const Root = ({ children, className = '' }) => {
  return (
    <div className={`d-flex flex-column gap-3 w-100 ${className}`}>
      {children}
    </div>
  );
};

const DropZone = ({ isDisabled = false, onDropFiles, accept = '.xlsx,.xls,.csv', title, subtitle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isDisabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onDropFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      onClick={() => !isDisabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="position-relative p-4 rounded-4 text-center transition-all d-flex flex-column align-items-center justify-content-center gap-3"
      style={{
        border: isDragging 
          ? '2px dashed var(--brand-secondary)' 
          : '2px dashed var(--border-subtle)',
        backgroundColor: isDragging 
          ? 'rgba(99, 102, 241, 0.08)' 
          : 'var(--bg-primary)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        minHeight: '180px',
        boxShadow: isDragging ? 'var(--neon-blue-glow)' : 'none',
        transition: 'all 0.25s ease'
      }}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        disabled={isDisabled}
        accept={accept}
        multiple
        style={{ display: 'none' }}
      />
      
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center p-3 transition-all"
        style={{
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-secondary)',
          color: 'var(--brand-secondary)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}
      >
        <UploadCloud size={32} />
      </div>

      <div>
        <p className="m-0 fw-bold" style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>
          {title || 'Click to upload or drag and drop'}
        </p>
        <p className="m-0 mt-1 small" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          {subtitle || 'Excel (.xlsx, .xls) or CSV (.csv) files up to 10 MB'}
        </p>
      </div>

      <div 
        className="badge px-3 py-1.5 rounded-pill fw-semibold"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--brand-primary)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem'
        }}
      >
        Browse Files
      </div>
    </div>
  );
};

const List = ({ children, className = '' }) => {
  return (
    <div className={`d-flex flex-column gap-2 mt-1 ${className}`}>
      {children}
    </div>
  );
};

const ListItemProgressFill = ({
  id,
  name,
  size,
  progress = 0,
  failed = false,
  feedback = '',
  onDelete,
  onRetry
}) => {
  const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv');
  const isComplete = progress === 100 && !failed;

  return (
    <div 
      className="position-relative overflow-hidden rounded-3 border p-3 transition-all d-flex align-items-center justify-content-between gap-3"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: failed ? '#ef4444' : isComplete ? '#10b981' : 'var(--border-subtle)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}
    >
      {/* Background progress fill */}
      <div 
        className="position-absolute top-0 start-0 h-100 transition-all"
        style={{
          width: `${progress}%`,
          backgroundColor: failed 
            ? 'rgba(239, 68, 68, 0.08)' 
            : isComplete 
              ? 'rgba(16, 185, 129, 0.08)' 
              : 'rgba(99, 102, 241, 0.08)',
          zIndex: 0,
          transition: 'width 0.3s ease'
        }}
      />

      {/* Left section: Icon & Details */}
      <div className="d-flex align-items-center gap-3 position-relative" style={{ zIndex: 1, minWidth: 0, flexGrow: 1 }}>
        <div 
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 p-2.5"
          style={{
            backgroundColor: failed 
              ? 'rgba(239, 68, 68, 0.12)' 
              : isComplete 
                ? 'rgba(16, 185, 129, 0.12)' 
                : 'var(--bg-secondary)',
            color: failed 
              ? '#ef4444' 
              : isComplete 
                ? '#10b981' 
                : 'var(--brand-secondary)'
          }}
        >
          {isExcel ? <FileSpreadsheet size={22} /> : <FileText size={22} />}
        </div>

        <div className="d-flex flex-column min-width-0 flex-grow-1 text-truncate">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-truncate text-heading" style={{ fontSize: '0.88rem' }}>
              {name}
            </span>
            {size ? (
              <span className="small text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                ({getReadableFileSize(size)})
              </span>
            ) : null}
          </div>

          {/* Live feedback or progress status */}
          <div className="d-flex align-items-center gap-2 mt-0.5">
            {failed ? (
              <span className="small fw-semibold d-flex align-items-center gap-1 text-danger" style={{ fontSize: '0.78rem' }}>
                <AlertCircle size={13} />
                <span>{feedback || 'Upload failed'}</span>
              </span>
            ) : isComplete ? (
              <span className="small fw-semibold d-flex align-items-center gap-1 text-success" style={{ fontSize: '0.78rem' }}>
                <CheckCircle2 size={13} />
                <span>{feedback || 'Upload complete!'}</span>
              </span>
            ) : (
              <div className="d-flex align-items-center gap-2 w-100">
                <span className="small fw-semibold text-muted" style={{ fontSize: '0.78rem' }}>
                  {feedback || `Uploading... ${progress}%`}
                </span>
                <div className="progress flex-grow-1" style={{ height: '4px', backgroundColor: 'var(--border-subtle)', maxWidth: '120px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${progress}%`, backgroundColor: 'var(--brand-secondary)' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="d-flex align-items-center gap-2 position-relative flex-shrink-0" style={{ zIndex: 1 }}>
        {failed && onRetry && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="btn btn-sm p-1.5 rounded-circle btn-light text-primary d-flex align-items-center justify-content-center"
            title="Retry upload"
            style={{ width: '32px', height: '32px' }}
          >
            <RefreshCw size={15} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="btn btn-sm p-1.5 rounded-circle btn-light text-danger d-flex align-items-center justify-content-center"
            title="Remove file"
            style={{ width: '32px', height: '32px' }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export const FileUpload = {
  Root,
  DropZone,
  List,
  ListItemProgressFill
};
