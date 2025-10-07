import { useState, useEffect } from 'react'
import { FileUpload } from '../components/storage/FileUpload'
import { FileGallery } from '../components/storage/FileGallery'
import { storage, supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { RefreshCw, Image as ImageIcon } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            File Manager
          </h1>
          <p className="text-gray-600">
            Upload, manage, and organize your files with Supabase Storage
          </p>
        </div>

        {uploadSuccess && (
          <Card className="mb-6 p-4 bg-green-50 border-green-200">
            <p className="text-green-800 font-medium">
              Files uploaded successfully!
            </p>
          </Card>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Galeria</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h2>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              folder="images"
              accept="image/*"
              maxSizeMB={10}
              multiple={true}
            />
          </Card>

          <div>
            {loading ? (
              <Card className="p-12 text-center">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading files...</p>
              </Card>
            ) : (
              <FileGallery
                files={files}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
