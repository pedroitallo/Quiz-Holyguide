import { useState, useEffect } from 'react'
import { FileUpload } from '../components/storage/FileUpload'
import { FileGallery } from '../components/storage/FileGallery'
import { storage, supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { RefreshCw, Image as ImageIcon } from 'lucide-react'
import AdminLayout from '../components/admin/layout/AdminLayout'

export default function FileManager() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFolder, setActiveFolder] = useState('images')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const loadFiles = async (folder = activeFolder) => {
    setLoading(true)
    try {
      const filesList = await storage.listFiles(folder)
      setFiles(filesList)

      const { data: dbFiles } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('folder', folder)
        .order('created_at', { ascending: false })

      const enrichedFiles = filesList.map(file => {
        const dbFile = dbFiles?.find(df => df.file_path === `${folder}/${file.name}`)
        return {
          ...file,
          path: `${folder}/${file.name}`,
          description: dbFile?.description || '',
          metadata: dbFile?.metadata || {}
        }
      })

      setFiles(enrichedFiles)
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles(activeFolder)
  }, [activeFolder])

  const handleUploadComplete = async (uploadedFiles) => {
    console.log('Upload complete:', uploadedFiles)

    for (const file of uploadedFiles) {
      try {
        await supabase.from('uploaded_files').insert({
          file_name: file.path.split('/').pop(),
          file_path: file.path,
          file_url: file.url,
          folder: activeFolder,
          uploaded_by: 'anonymous'
        })
      } catch (error) {
        console.error('Error saving file metadata:', error)
      }
    }

    setUploadSuccess(true)
    setTimeout(() => setUploadSuccess(false), 3000)

    loadFiles(activeFolder)
  }

  const handleUploadError = (error) => {
    console.error('Upload error:', error)
    alert('Upload failed: ' + error.message)
  }

  const handleDelete = async (file) => {
    try {
      await supabase
        .from('uploaded_files')
        .delete()
        .eq('file_path', file.path)

      loadFiles(activeFolder)
    } catch (error) {
      console.error('Error deleting file record:', error)
    }
  }

  const handleRefresh = () => {
    loadFiles(activeFolder)
  }

  const handleFolderChange = (folder) => {
    setActiveFolder(folder)
  }

  return (
    <AdminLayout breadcrumbs={['Arquivos']}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          My Files & Assets
        </h1>
        <p className="text-slate-600">
          Upload, manage, and organize your files with ease
        </p>
      </div>

      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            Files uploaded successfully!
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl border-2 border-dashed border-indigo-300 p-8 text-center hover:border-indigo-400 transition-colors">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            folder="images"
            accept="image/*"
            maxSizeMB={10}
            multiple={true}
          />
        </div>

        <div>
          {loading ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mx-auto mb-2" />
              <p className="text-slate-500">Loading files...</p>
            </div>
          ) : (
            <FileGallery
              files={files}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
