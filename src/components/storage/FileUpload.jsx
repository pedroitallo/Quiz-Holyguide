import { useState, useRef } from 'react'
import { Upload, X, FileIcon, Loader2, CheckCircle2, AlertCircle, FileUp } from 'lucide-react'
import { storage } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function FileUpload({
  onUploadComplete,
  onUploadError,
  folder = 'images',
  accept = 'image/*',
  maxSizeMB = 10,
  multiple = false,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState([])
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    const maxSize = maxSizeMB * 1024 * 1024

    if (file.size > maxSize) {
      return `File size exceeds ${maxSizeMB}MB limit`
    }

    if (accept && accept !== '*') {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const fileType = file.type
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''))
        }
        return fileType === type
      })

      if (!isAccepted) {
        return `File type ${fileType} is not accepted`
      }
    }

    return null
  }

  const handleFiles = async (files) => {
    const fileArray = Array.from(files)

    const validationErrors = fileArray.map(file => ({
      file,
      error: validateFile(file)
    }))

    const invalidFiles = validationErrors.filter(v => v.error)
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles.map(v => `${v.file.name}: ${v.error}`).join('\n')
      if (onUploadError) {
        onUploadError(new Error(errorMessage))
      }
      return
    }

    setUploading(true)
    const initialProgress = fileArray.map(file => ({
      name: file.name,
      status: 'uploading',
      progress: 0
    }))
    setUploadProgress(initialProgress)

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          const result = await storage.uploadFile(file, folder)

          setUploadProgress(prev => prev.map((p, i) =>
            i === index ? { ...p, status: 'success', progress: 100 } : p
          ))

          return { success: true, file, result }
        } catch (error) {
          setUploadProgress(prev => prev.map((p, i) =>
            i === index ? { ...p, status: 'error', progress: 0, error: error.message } : p
          ))
          return { success: false, file, error }
        }
      })

      const results = await Promise.all(uploadPromises)
      const successful = results.filter(r => r.success)
      const failed = results.filter(r => !r.success)

      if (successful.length > 0 && onUploadComplete) {
        onUploadComplete(successful.map(r => r.result))
      }

      if (failed.length > 0 && onUploadError) {
        onUploadError(new Error(`${failed.length} file(s) failed to upload`))
      }

      setTimeout(() => {
        setUploadProgress([])
      }, 3000)
    } catch (error) {
      console.error('Upload error:', error)
      if (onUploadError) {
        onUploadError(error)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      if (!multiple && files.length > 1) {
        if (onUploadError) {
          onUploadError(new Error('Only one file can be uploaded at a time'))
        }
        return
      }
      handleFiles(files)
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const clearProgress = () => {
    setUploadProgress([])
  }

  return (
    <div className={className}>
      <div
        className={`transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`rounded-lg p-4 ${isDragging ? 'bg-indigo-100' : 'bg-indigo-50'}`}>
            {uploading ? (
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
            ) : (
              <FileUp className={`h-12 w-12 ${isDragging ? 'text-indigo-700' : 'text-indigo-600'}`} />
            )}
          </div>

          <div>
            <p className="text-base text-slate-700">
              <span className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-700">
                Click here
              </span>{' '}
              to upload your file or drag.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supported Format: SVG, JPG, PNG (10mb each)
            </p>
          </div>

          <Button
            type="button"
            onClick={openFileDialog}
              disabled={uploading}
              variant="outline"
            >
              Choose File{multiple ? 's' : ''}
            </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadProgress.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Upload Progress</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearProgress}
              className="h-6 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {uploadProgress.map((item, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  {item.error && (
                    <p className="text-xs text-red-600 mt-1">{item.error}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {item.status === 'uploading' && (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
