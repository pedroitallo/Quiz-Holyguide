import { useState } from 'react'
import { Trash2, Download, ExternalLink, FileIcon, Image as ImageIcon, Loader2, X, Copy, Check } from 'lucide-react'
import { storage } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'

export function FileGallery({ files, onDelete, onRefresh, className = '' }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const [copiedUrl, setCopiedUrl] = useState(null)

  const isImage = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
    const ext = filename.split('.').pop()?.toLowerCase()
    return imageExtensions.includes(ext)
  }

  const handleDelete = async () => {
    if (!fileToDelete) return

    setDeleting(fileToDelete.path)
    try {
      await storage.deleteFile(fileToDelete.path)
      if (onDelete) {
        onDelete(fileToDelete)
      }
      if (onRefresh) {
        onRefresh()
      }
      setShowDeleteDialog(false)
      setFileToDelete(null)
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file: ' + error.message)
    } finally {
      setDeleting(null)
    }
  }

  const confirmDelete = (file) => {
    setFileToDelete(file)
    setShowDeleteDialog(true)
  }

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download file: ' + error.message)
    }
  }

  const openFile = (file) => {
    setSelectedFile(file)
  }

  const closePreview = () => {
    setSelectedFile(null)
  }

  const handleCopyUrl = async (file) => {
    try {
      await navigator.clipboard.writeText(file.url)
      setCopiedUrl(file.url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Error copying URL:', error)
      alert('Failed to copy URL: ' + error.message)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  if (!files || files.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          <FileIcon className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {files.map((file, index) => (
          <Card key={file.id || index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative group">
              {isImage(file.name) ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openFile(file)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopyUrl(file)}
                  className="bg-white hover:bg-gray-100 shadow-lg"
                  title="Copy image URL"
                >
                  {copiedUrl === file.url ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  {isImage(file.name) && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => openFile(file)}
                      className="bg-white hover:bg-gray-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(file)}
                    className="bg-white hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDelete(file)}
                    disabled={deleting === file.path}
                  >
                    {deleting === file.path ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.metadata?.size)}
                </p>
                {file.created_at && (
                  <p className="text-xs text-gray-400">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={closePreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedFile.name}</DialogTitle>
              <DialogDescription>
                {formatFileSize(selectedFile.metadata?.size)} • {formatDate(selectedFile.created_at)}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[70vh] overflow-auto">
              {isImage(selectedFile.name) ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-full h-auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
                  <FileIcon className="h-24 w-24 text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDownload(selectedFile)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={closePreview}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setFileToDelete(null)
              }}
              disabled={!!deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={!!deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
