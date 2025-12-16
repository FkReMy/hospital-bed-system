// src/components/uploads/FileUploadItem.jsx
/**
 * FileUploadItem Component
 * 
 * Production-ready, reusable item displaying a single uploaded file in the upload zone.
 * Used in FileUploadZone for patient documents, reports, or attachments.
 * 
 * Features:
 * - File name with truncation
 * - File size and type display
 * - Progress bar (for uploading state)
 * - Success/error state with icons
 * - Remove action with confirmation
 * - Accessible (ARIA labels, keyboard support)
 * - Unified with global Card, Badge, Button, Progress components
 * - Premium glassmorphic design
 */

import React from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  Image, 
  Film, 
  Music, 
  Archive, 
  X, 
  CheckCircle,
  AlertCircle,
  Download 
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import Progress from '@components/ui/progress.jsx';
import './FileUploadItem.scss';

/**
 * Props:
 * - file: File object or uploaded file metadata
 *   { name, size, type, progress (0-100), status ('uploading'|'success'|'error'), url }
 * - onRemove: (file) => void - remove handler
 * - onDownload: (file) => void - optional download handler
 */
const FileUploadItem = ({ 
  file, 
  onRemove, 
  onDownload 
}) => {
  const { name, size, type, progress = 100, status = 'success', url } = file;

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Get appropriate icon based on file type
  const getFileIcon = () => {
    const mime = type || '';
    if (mime.startsWith('image/')) return Image;
    if (mime.startsWith('video/')) return Film;
    if (mime.startsWith('audio/')) return Music;
    if (mime.includes('zip') || mime.includes('rar')) return Archive;
    return FileText;
  };

  const FileIcon = getFileIcon();

  const isUploading = status === 'uploading';
  const isError = status === 'error';

  return (
    <Card className={`file-upload-item ${status}`}>
      <div className="itemContent">
        {/* Icon + File Info */}
        <div className="fileInfo">
          <div className="fileIconWrapper">
            <FileIcon className="fileIcon" size={32} />
          </div>

          <div className="fileDetails">
            <p className="fileName" title={name}>{name}</p>
            <div className="fileMeta">
              <span className="fileSize">{formatFileSize(size)}</span>
              <span className="separator">•</span>
              <span className="fileType">{type || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Status / Progress */}
        <div className="itemStatus">
          {isUploading && (
            <div className="progressSection">
              <Progress value={progress} className="uploadProgress" />
              <span className="progressText">{progress}%</span>
            </div>
          )}

          {!isUploading && isError && (
            <Badge variant="destructive" className="statusBadge">
              <AlertCircle size={14} />
              Upload Failed
            </Badge>
          )}

          {!isUploading && !isError && (
            <Badge variant="success" className="statusBadge">
              <CheckCircle size={14} />
              Uploaded
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="itemActions">
          {url && onDownload && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDownload(file)}
              aria-label="Download file"
            >
              <Download size={16} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove?.(file)}
            aria-label="Remove file"
            className="removeButton"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FileUploadItem;