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
      <div className="item-content">
        {/* Icon + File Info */}
        <div className="file-info">
          <div className="file-icon-wrapper">
            <FileIcon className="file-icon" size={32} />
          </div>

          <div className="file-details">
            <p className="file-name" title={name}>{name}</p>
            <div className="file-meta">
              <span className="file-size">{formatFileSize(size)}</span>
              <span className="separator">•</span>
              <span className="file-type">{type || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Status / Progress */}
        <div className="item-status">
          {isUploading && (
            <div className="progress-section">
              <Progress className="upload-progress" value={progress} />
              <span className="progress-text">{progress}%</span>
            </div>
          )}

          {!isUploading && isError && (
            <Badge className="status-badge" variant="destructive">
              <AlertCircle size={14} />
              Upload Failed
            </Badge>
          )}

          {!isUploading && !isError && (
            <Badge className="status-badge" variant="success">
              <CheckCircle size={14} />
              Uploaded
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="item-actions">
          {url && onDownload && (
            <Button
              aria-label="Download file"
              size="icon"
              variant="ghost"
              onClick={() => onDownload(file)}
            >
              <Download size={16} />
            </Button>
          )}

          <Button
            aria-label="Remove file"
            className="remove-button"
            size="icon"
            variant="ghost"
            onClick={() => onRemove?.(file)}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FileUploadItem;