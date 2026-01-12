"use client";
import { useState } from 'react'
import { FileText, Folder, Download, Trash2, Upload, Search, Grid, List, Clock, FolderOpen, File, Eye, ArrowLeft, Loader2 } from 'lucide-react'
import { formatDateTime, getDocumentIcon } from '@/utils/helper';
import { useGetDocumentStats, useGetDocumentsByType, useDeleteDocument } from '@/api/document-type';
import { useGetDocumentTypes } from '@/api/document-type';
import useCustomToast from '@/hooks/use-custom-toast';
import ConfirmDeleteModal from '@/components/shared/confirm-modal';
import UploadDocumentModal from './_components/upload-modal';
import SearchableOrganizerSelect from './_components/SearchableOrganizerSelect';

const DocumentsPage = () => {
  const toast = useCustomToast();
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<any>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [organizerId, setOrganizerId] = useState('')
  const [preSelectedDocType, setPreSelectedDocType] = useState<string | null>(null)

  // API Hooks
  const { data: statsData, isLoading: statsLoading } = useGetDocumentStats()
  const { data: docTypesData, isLoading: docTypesLoading } = useGetDocumentTypes()
  // Always fetch documents when a folder is selected, regardless of organizer
  const { data: documentsData, isLoading: documentsLoading } = useGetDocumentsByType(
    selectedFolder,
    page,
    limit,
    organizerId
  )
  const deleteDocumentMutation = useDeleteDocument()

  const getColorForType = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('prior')) return 'purple';
    if (nameLower.includes('id') || nameLower.includes('social')) return 'indigo';
    if (nameLower.includes('receipt')) return 'green';
    if (nameLower.includes('bank')) return 'teal';
    if (nameLower.includes('other')) return 'gray';
    return 'blue';
  };

  const folders = docTypesData?.data?.map((type: any) => ({
    type: type.id,
    name: type.name,
    description: type.description,
    icon: getDocumentIcon(type.name),
    tag: 'Tax',
    color: getColorForType(type.name),
    count: 0,
  })) || [];

  const stats = statsData?.data?.stats || [];

  const formatFileSize = (bytes: string | number) => {
    const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes
    if (!numBytes) return '0 KB'
    if (numBytes < 1024) return numBytes + ' B'
    if (numBytes < 1024 * 1024) return (numBytes / 1024).toFixed(1) + ' KB'
    return (numBytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const documents = documentsData?.data?.documents || [];

  const filteredDocuments = documents.filter((doc: any) =>
    doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFolders = folders.filter((folder: any) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (doc: any) => {
    setDocumentToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocumentMutation.mutateAsync(documentToDelete.id);
      toast.success('Document deleted successfully');
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete document');
    }
  };

  // Handle upload button click - validate organizer selection and set pre-selected doc type
  const handleUploadClick = () => {
    if (!organizerId) {
      toast.error('Please select an organizer first');
      return;
    }

    // Set pre-selected document type if a folder is currently selected
    setPreSelectedDocType(selectedFolder);
    setIsUploadModalOpen(true);
  };

  // Handle modal close - clear pre-selected doc type
  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    setPreSelectedDocType(null);
  };

  const handleFolderClick = (folderId: string) => {
    // Allow viewing folder structure without organizer selected
    setSelectedFolder(folderId);
    setPage(1);
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'text-gray-500' }
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText,
      FolderOpen,
      File
    };
    return icons[iconName] || FileText;
  };

  if (statsLoading || docTypesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upload Modal - Pass pre-selected document type */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        organizerId={organizerId}
        preSelectedDocumentTypeId={preSelectedDocType}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Document?"
        description={`Are you sure you want to delete "${documentToDelete?.file_name}"? This action cannot be undone.`}
        isLoading={deleteDocumentMutation.isPending}
      />

      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedFolder && (
                <button
                  onClick={() => {
                    setSelectedFolder(null);
                    setPage(1);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedFolder
                    ? folders.find((f: any) => f.type === selectedFolder)?.name
                    : 'Documents'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedFolder
                    ? `${documents.length} files in this folder`
                    : 'Manage and organize your financial documents'}
                </p>
              </div>
            </div>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!organizerId}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Stats Cards */}
          {!selectedFolder && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat: any, i: number) => {
                const Icon = getIconComponent(stat.icon);
                const colors = colorClasses[stat.color as keyof typeof colorClasses];

                return (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>


        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {/* Organizer Selector */}
          <div className="">
            <SearchableOrganizerSelect
              value={organizerId}
              onChange={setOrganizerId}
              placeholder="Select Organizer for uploading file"
              className="max-w-md"
            />
          </div>

          <div className='w-full'>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={selectedFolder ? "Search files..." : "Search folders..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {selectedFolder && (
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Folder/Document View */}
        {
          !selectedFolder ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFolders.map((folder: any) => {
                const colors = colorClasses[folder.color as keyof typeof colorClasses];
                return (
                  <div
                    key={folder.type}
                    onClick={() => handleFolderClick(folder.type)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden group cursor-pointer"
                  >
                    <div className={`h-32 ${colors.bg} flex items-center justify-center relative`}>
                      <div className="text-5xl">{folder.icon}</div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-gray-900 truncate mb-1">{folder.name}</p>
                      {folder.description && (
                        <p className="text-xs text-gray-500 mb-2 truncate">{folder.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 ${colors.bg} ${colors.text} rounded text-xs font-medium`}>
                          {folder.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            documentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-2">
                {filteredDocuments.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? 'Try adjusting your search criteria' : 'Start by uploading your first document'}
                    </p>
                    <button
                      onClick={() => searchTerm ? setSearchTerm('') : handleUploadClick()}
                      className={`px-6 py-2.5 text-white rounded-lg transition-colors font-medium ${!organizerId ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} `}
                      disabled={!organizerId}
                    >
                      {searchTerm ? 'Clear Search' : 'Upload Document'}
                    </button>
                  </div>
                ) : (
                  filteredDocuments.map((doc: any) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50">
                            <FileText className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{doc.file_name}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDateTime(doc.uploaded_at)}
                              </span>
                              <span>•</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${doc.status === 'uploaded' ? 'bg-green-100 text-green-700' :
                                doc.status === 'uploading' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                {doc.status}
                              </span>
                            </div>
                            {doc.notes && (
                              <p className="text-xs text-gray-500 mt-1 italic">{doc.notes}</p>
                            )}
                            {doc.uploader && (
                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded by: {doc.uploader.first_name} {doc.uploader.last_name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </a>
                            <button
                              onClick={() => handleDeleteClick(doc)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.length === 0 ? (
                  <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? 'Try adjusting your search criteria' : 'Start by uploading your first document'}
                    </p>
                    <button
                      onClick={() => searchTerm ? setSearchTerm('') : handleUploadClick()}
                      className={`px-6 py-2.5 text-white rounded-lg transition-colors font-medium ${!organizerId ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} `}
                      disabled={!organizerId}
                    >
                      {searchTerm ? 'Clear Search' : 'Upload Document'}
                    </button>
                  </div>
                ) : (
                  filteredDocuments.map((doc: any) => (
                    <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden group">
                      <div className="h-32 bg-blue-50 flex items-center justify-center relative">
                        <FileText className="h-16 w-16 text-blue-400" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="h-4 w-4 text-gray-700" />
                          </a>
                          <a
                            href={doc.file_url}
                            download
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Download className="h-4 w-4 text-gray-700" />
                          </a>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-gray-900 truncate mb-1">{doc.file_name}</p>
                        <p className="text-sm text-gray-600 mb-2">{formatFileSize(doc.file_size)}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{formatDateTime(doc.uploaded_at)}</span>
                          <button
                            onClick={() => handleDeleteClick(doc)}
                            className="p-1.5 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          )
        }

        {/* Empty State for Folders */}
        {
          !selectedFolder && filteredFolders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'No document types available'}
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Clear Search
              </button>
            </div>
          )
        }

        {/* Pagination */}
        {
          selectedFolder && documentsData?.data?.pagination && documentsData.data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!documentsData.data.pagination.hasPrevPage}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {documentsData.data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!documentsData.data.pagination.hasNextPage}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )
        }
      </div >
    </div >
  )
}

export default DocumentsPage