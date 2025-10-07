import { useState, useEffect } from 'react'
import { FileUpload } from '../components/storage/FileUpload'
import { FileGallery } from '../components/storage/FileGallery'
import { storage, supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { RefreshCw, FolderOpen, Image as ImageIcon, FileText } from 'lucide-react'

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

        <Tabs value={activeFolder} onValueChange={handleFolderChange} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="images" className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="temp" className="flex items-center space-x-2">
                <FolderOpen className="h-4 w-4" />
                <span>Temporary</span>
              </TabsTrigger>
            </TabsList>

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

          <TabsContent value="images" className="space-y-6">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Images ({files.length})
                </h2>
              </div>
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
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
              <FileUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                folder="documents"
                accept=".pdf,.doc,.docx,.txt"
                maxSizeMB={10}
                multiple={true}
              />
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Documents ({files.length})
                </h2>
              </div>
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
          </TabsContent>

          <TabsContent value="temp" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Temporary Files</h2>
              <p className="text-sm text-gray-600 mb-4">
                Files in the temporary folder can be used for short-term storage
              </p>
              <FileUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                folder="temp"
                accept="*"
                maxSizeMB={10}
                multiple={true}
              />
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Temporary Files ({files.length})
                </h2>
              </div>
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
          </TabsContent>
        </Tabs>

        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to Use File Storage
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Upload:</strong> Drag and drop files or click to browse</li>
            <li>• <strong>View:</strong> Click on images to preview them in full size</li>
            <li>• <strong>Download:</strong> Hover over a file and click the download button</li>
            <li>• <strong>Delete:</strong> Hover over a file and click the trash icon</li>
            <li>• <strong>Organize:</strong> Use folders (Images, Documents, Temp) to keep files organized</li>
            <li>• <strong>Limits:</strong> Maximum file size is 10MB per file</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
