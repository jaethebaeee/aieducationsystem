import React, { useRef, forwardRef, useImperativeHandle } from 'react';

export interface AccessibleFileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFileSelect: (files: File[]) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface AccessibleFileUploadRef {
  focus: () => void;
  click: () => void;
}

const AccessibleFileUpload = forwardRef<AccessibleFileUploadRef, AccessibleFileUploadProps>(
  ({ 
    label, 
    accept = "*", 
    multiple = false, 
    maxSize, 
    onFileSelect, 
    helperText, 
    error, 
    disabled = false,
    required = false,
    className = ""
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

    useImperativeHandle(ref, () => ({
      focus: () => fileInputRef.current?.focus(),
      click: () => fileInputRef.current?.click(),
    }));

    const handleFiles = (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const validFiles: File[] = [];

      for (const file of fileArray) {
        // Check file size
        if (maxSize && file.size > maxSize) {
          console.warn(`File ${file.name} is too large. Maximum size is ${maxSize} bytes.`);
          continue;
        }

        // Check file type
        if (accept !== "*") {
          const acceptedTypes = accept.split(',').map(type => type.trim());
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
          const fileType = file.type;
          
          const isAccepted = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
              return fileExtension === type.toLowerCase();
            }
            return fileType === type || fileType.startsWith(type.replace('*', ''));
          });

          if (!isAccepted) {
            console.warn(`File ${file.name} is not an accepted file type.`);
            continue;
          }
        }

        validFiles.push(file);
      }

      setSelectedFiles(validFiles);
      onFileSelect(validFiles);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    };

    const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`space-y-2 ${className}`}>
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>

        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
        >
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
          />

          <div className="space-y-2">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </div>
            
            {accept !== "*" && (
              <p className="text-xs text-gray-500">
                {accept.split(',').join(', ')}
              </p>
            )}
            
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max size: {(maxSize / (1024 * 1024)).toFixed(1)} MB
              </p>
            )}
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected files:</h4>
            <ul className="space-y-1">
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center justify-between">
                  <span>{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleFileUpload.displayName = 'AccessibleFileUpload';

export default AccessibleFileUpload; 