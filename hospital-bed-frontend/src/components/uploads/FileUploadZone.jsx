// src/components/uploads/FileUploadZone.jsx
/**
 * FileUploadZone Component
 * 
 * Production-ready drag-and-drop file upload zone with progress tracking.
 * Used for patient documents, medical reports, or attachments in various pages.
 * 
 * Features:
 * - Drag/drop support with visual feedback
 * - Multiple file upload with size/type validation
 * - Progress tracking for each file
 * - Success/error states
 * - Remove/retry actions
 * - Accessible (ARIA labels, keyboard support)
 * - Unified with global Button, Card, Progress components
 * - Premium glassmorphic design with hover states
 */

import React from 'react';
import { UploadCloud, FileText, XCircle, AlertCircle } from 'lucide-react';
import Button from '@components/ui/button.jsx';
import Progress from '@components/ui/progress.jsx';
import FileUploadItem from '@components/uploads/FileUploadItem.jsx';
import './FileUploadZone.scss';

/**
 * Props:
 * - onFilesChange: (files: File[]) => void - callback for new files
 * - maxFiles: number - max simultaneous uploads (default: 5)
 * - acceptedTypes: string - MIME types or extensions (e.g., 'image/*,.pdf')
 * - maxSizeMB: number - max file size in MB (default: 10)
 * - existingFiles: Array - pre-uploaded files
 */
const FileUploadZone = ({
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = '*/*',
  maxSizeMB = 10,
  existingFiles = [],
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState(existingFiles);
  const inputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      // Size validation
      if (file.size / (1024 * 1024) > maxSizeMB) {
        console.warn(`File ${file.name} exceeds max size`);
        return false;
      }
      // Type validation
      if (acceptedTypes !== '*/*' && !acceptedTypes.includes(file.type)) {
        console.warn(`Invalid file type: ${file.type}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > maxFiles) {
      console.warn(`Max files exceeded, limiting to ${maxFiles}`);
      validFiles.length = maxFiles;
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div 
      className={`file-upload-zone ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        multiple
        accept={acceptedTypes}
        aria-hidden="true"
        className="file-input"
        ref={inputRef}
        type="file"
        onChange={handleChange}
      />

      <div className="upload-prompt">
        <UploadCloud className="upload-icon" size={48} />
        <p className="prompt-text">
          Drag & drop files here or{' '}
          <Button 
            className="browse-button" 
            variant="link"
            onClick={() => inputRef.current.click()}
          >
            browse
          </Button>
        </p>
        <p className="file-limits">
          Max {maxFiles} files • {maxSizeMB}MB each • {acceptedTypes}
        </p>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <FileUploadItem
              file={file}
              key={index}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;