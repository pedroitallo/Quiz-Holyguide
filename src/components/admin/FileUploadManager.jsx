import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UploadFile } from '@/api/integrations';
import { Asset } from '@/api/entities';
import { Upload, Image, Music, FileText, Copy, Check, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUploadManager() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [copiedUrls, setCopiedUrls] = useState(new Set());
    const fileInputRef = useRef(null);

    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('audio/')) return 'audio';
        if (file.type.startsWith('video/')) return 'video';
        return 'document';
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'image': return Image;
            case 'audio': return Music;
            case 'video': return FileText;
            default: return FileText;
        }
    };

    const getBadgeColor = (fileType) => {
        switch (fileType) {
            case 'image': return 'bg-green-100 text-green-800';
            case 'audio': return 'bg-blue-100 text-blue-800';
            case 'video': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        setIsUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const fileType = getFileType(file);
                
                // Upload do arquivo
                const { file_url } = await UploadFile({ file });
                
                // Salva no banco de dados
                const asset = await Asset.create({
                    name: file.name,
                    file_url,
                    file_type: fileType,
                    description: `Uploaded ${fileType} file`
                });

                return {
                    id: asset.id,
                    name: file.name,
                    url: file_url,
                    type: fileType,
                    size: file.size,
                    created_date: new Date().toISOString()
                };
            });

            const results = await Promise.all(uploadPromises);
            setUploadedFiles(prev => [...results, ...prev]);

        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Erro ao fazer upload dos arquivos. Tente novamente.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const copyToClipboard = async (url, id) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrls(prev => new Set([...prev, id]));
            
            setTimeout(() => {
                setCopiedUrls(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            }, 2000);
        } catch (error) {
            console.error('Erro ao copiar URL:', error);
        }
    };

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                <CardContent className="p-8 text-center">
                    <div className="mb-4">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Upload Files</h3>
                            <p className="text-gray-600">
                                Upload images, audio files, videos or documents
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file-upload" className="sr-only">
                                Choose files
                            </Label>
                            <Input
                                id="file-upload"
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                                className="hidden"
                            />
                            
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Choose Files
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Uploaded Files ({uploadedFiles.length})
                        </h3>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {uploadedFiles.map((file) => {
                                const IconComponent = getFileIcon(file.type);
                                const isCopied = copiedUrls.has(file.id);
                                
                                return (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <IconComponent className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                            
                                            <Badge className={getBadgeColor(file.type)}>
                                                {file.type}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(file.url, file.id)}
                                                className="flex items-center gap-2"
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copy URL
                                                    </>
                                                )}
                                            </Button>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeFile(file.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {uploadedFiles.length === 0 && !isUploading && (
                <div className="text-center py-8 text-gray-500">
                    No files uploaded yet. Upload your first file to get started.
                </div>
            )}
        </div>
    );
}