import { useState } from 'react'
import { Trash2, Pencil, Check, X, Copy, Image as ImageIcon, FileIcon } from 'lucide-react'
import { storage, supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/dialog'

export function FileGallery({ files, onDelete, onRefresh }) {
  const [editingFile, setEditingFile] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const startEditing = (file) => {
    setEditingFile(file)
    setEditedName(file.name)
  }

  const cancelEditing = () => {
    setEditingFile(null)
    setEditedName('')
  }

  const saveEdit = async () => {
    if (!editingFile || !editedName) return

    try {
      await supabase
        .from('uploaded_files')
        .update({ file_name: editedName })
        .eq('file_path', editingFile.path)

      setEditingFile(null)
      setEditedName('')
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error updating file name:', error)
      alert('Failed to update file name: ' + error.message)
    }
  }

  const handleCopyUrl = async (file) => {
    try {
      await navigator.clipboard.writeText(file.url)
      setCopiedUrl(file.url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Error copying URL:', error)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <FileIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No files uploaded yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Attached Files{' '}
                <span className="text-sm font-normal text-slate-500 ml-2">
                  {files.length} Total
                </span>
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Here you can explore your uploaded files.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">
                  Preview
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">
                  File Name
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">
                  Size
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">
                  URL
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map((file, index) => (
                <tr key={file.id || index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      {isImage(file.name) ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {editingFile?.path === file.path ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="max-w-xs"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          className="text-slate-600 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {file.name}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(file)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="h-3 w-3 text-slate-500" />
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">
                      {formatFileSize(file.metadata?.size)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 max-w-xs">
                      <span className="text-sm text-slate-600 truncate">
                        {file.url}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyUrl(file)}
                        className="flex-shrink-0"
                      >
                        {copiedUrl === file.url ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => confirmDelete(file)}
                        disabled={deleting === file.path}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
