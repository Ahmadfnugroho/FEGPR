import React, { useEffect, useState } from 'react';
import useStorage from '../hooks/useStorage';

/**
 * Komponen untuk mengupload dan mengelola file
 */
const FileUploader: React.FC = () => {
  // Gunakan hook useStorage
  const {
    uploadFile,
    isUploading,
    fileList,
    fetchFiles,
    deleteFile,
    isDeleting,
    isLoading,
    error,
    clearError,
  } = useStorage();
  
  // State untuk file yang dipilih
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Ambil daftar file saat komponen dimount
  useEffect(() => {
    fetchFiles(1, 10, 'image');
  }, []);
  
  // Handler untuk perubahan file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };
  
  // Handler untuk upload file
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const fileUrl = await uploadFile(selectedFile, 'products');
    if (fileUrl) {
      // Reset selected file setelah upload berhasil
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };
  
  // Handler untuk hapus file
  const handleDelete = async (fileId: string) => {
    const success = await deleteFile(fileId);
    if (success) {
      // File berhasil dihapus, fileList sudah diupdate di hook
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">File Uploader</h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
      {/* Upload form */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/80"
            disabled={isUploading}
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-4 py-2 rounded-md text-white font-medium ${!selectedFile || isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-accent hover:bg-accent/80'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">
            Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>
      
      {/* File list */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
        {isLoading ? (
          <p className="text-gray-500">Loading files...</p>
        ) : fileList.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fileList.map((file) => (
              <div key={file.id} className="border rounded-md p-3 relative">
                {file.mime_type.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center mb-2 rounded">
                    <span className="text-gray-500">{file.mime_type}</span>
                  </div>
                )}
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {Math.round(file.size / 1024)} KB
                </p>
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={isDeleting}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;