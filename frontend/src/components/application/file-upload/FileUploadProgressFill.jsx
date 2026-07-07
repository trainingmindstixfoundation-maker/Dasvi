import React, { useState } from "react";
import { FileUpload } from "./file-upload-base";

const defaultUploadFile = (file, onProgress, onSuccess, onError) => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            if (onSuccess) onSuccess("Upload and processing complete!");
        }
        onProgress(progress);
    }, 150);
};

export const FileUploadProgressFill = ({ 
    isDisabled = false, 
    onUploadFile,
    initialFiles = [],
    accept = ".xlsx,.xls,.csv",
    title = "Upload Excel or CSV video files",
    subtitle = "Drag & drop spreadsheet files here to batch import video lectures"
}) => {
    const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

    const runUpload = (fileObj, id) => {
        const uploader = onUploadFile || defaultUploadFile;
        uploader(
            fileObj,
            (progress, feedback) => {
                setUploadedFiles((prev) => 
                    prev.map((item) => (item.id === id ? { ...item, progress, feedback: feedback || item.feedback } : item))
                );
            },
            (successMsg) => {
                setUploadedFiles((prev) => 
                    prev.map((item) => (item.id === id ? { ...item, progress: 100, failed: false, feedback: successMsg || "Upload complete!" } : item))
                );
            },
            (errorMsg) => {
                setUploadedFiles((prev) => 
                    prev.map((item) => (item.id === id ? { ...item, progress: 100, failed: true, feedback: errorMsg || "Upload failed" } : item))
                );
            }
        );
    };

    const handleDropFiles = (files) => {
        const newFiles = Array.from(files);
        const newFilesWithIds = newFiles.map((file) => ({
            id: Math.random().toString(36).substring(2, 11),
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            failed: false,
            feedback: "Starting upload...",
            fileObject: file,
        }));

        setUploadedFiles((prev) => [...newFilesWithIds.map(({ fileObject: _, ...file }) => file), ...prev]);

        newFilesWithIds.forEach(({ id, fileObject }) => {
            runUpload(fileObject, id);
        });
    };

    const handleDeleteFile = (id) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const handleRetryFile = (id) => {
        const item = uploadedFiles.find((f) => f.id === id);
        if (!item) return;

        setUploadedFiles((prev) => 
            prev.map((f) => (f.id === id ? { ...f, progress: 0, failed: false, feedback: "Retrying upload..." } : f))
        );

        // If fileObject was preserved or create empty representation
        const fileObj = item.fileObject || new File([], item.name, { type: item.type });
        runUpload(fileObj, id);
    };

    return (
        <FileUpload.Root>
            <FileUpload.DropZone 
                isDisabled={isDisabled} 
                onDropFiles={handleDropFiles} 
                accept={accept}
                title={title}
                subtitle={subtitle}
            />

            {uploadedFiles.length > 0 && (
                <div className="mt-2">
                    <div className="d-flex align-items-center justify-content-between mb-2 px-1">
                        <span className="small fw-bold text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>
                            Uploaded Files ({uploadedFiles.length})
                        </span>
                        <button 
                            type="button" 
                            onClick={() => setUploadedFiles([])} 
                            className="btn btn-link btn-sm p-0 text-muted small text-decoration-none"
                            style={{ fontSize: '0.75rem' }}
                        >
                            Clear list
                        </button>
                    </div>
                    <FileUpload.List>
                        {uploadedFiles.map((file) => (
                            <FileUpload.ListItemProgressFill
                                key={file.id}
                                {...file}
                                size={file.size}
                                onDelete={() => handleDeleteFile(file.id)}
                                onRetry={() => handleRetryFile(file.id)}
                            />
                        ))}
                    </FileUpload.List>
                </div>
            )}
        </FileUpload.Root>
    );
};

export default FileUploadProgressFill;
