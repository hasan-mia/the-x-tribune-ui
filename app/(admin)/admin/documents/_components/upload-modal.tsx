import React, { useEffect } from 'react';
import { X, Upload, Check, File, Trash2, Loader2 } from 'lucide-react';
import ConfirmDeleteModal from '@/components/shared/confirm-modal';
import { useUploadFile } from '@/api/file';
import { useGetDocumentTypes, useCreateDocument, useDeleteDocument } from '@/api/document-type';
import useCustomToast from '@/hooks/use-custom-toast';
import { getDocumentIcon } from '@/utils/helper';
import Select from '@/app/(client)/organizer/_components/Select';

export interface Document {
    id?: string;
    document_type_id: string;
    typeName: string;
    file_name: string;
    file_url?: string;
    file_path?: string;
    file_size?: number;
    mime_type?: string;
    status: 'pending' | 'uploading' | 'uploaded' | 'rejected';
    notes: string;
    uploaded_at?: string;
}

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizerId: string;
    preSelectedDocumentTypeId?: string | null;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
    isOpen,
    onClose,
    organizerId,
    preSelectedDocumentTypeId
}) => {
    const toast = useCustomToast();
    const [docs, setDocs] = React.useState<Document[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [documentToDelete, setDocumentToDelete] = React.useState<number | null>(null);
    const [deletingIndex, setDeletingIndex] = React.useState<number | null>(null);
    const fileInputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});

    // API hooks
    const uploadFileMutation = useUploadFile();
    const createDocumentMutation = useCreateDocument(organizerId);
    const deleteDocumentMutation = useDeleteDocument();
    const { data: docTypeResponse, isLoading: isLoadingDocTypes } = useGetDocumentTypes();

    // Transform API data to dropdown format
    const docTypes = React.useMemo(() => {
        if (!docTypeResponse?.data) return [];

        return docTypeResponse.data.map((type: any) => ({
            value: type.id,
            label: `${type.name}${type.description ? ` - ${type.description}` : ''}`,
            name: type.name,
            icon: getDocumentIcon(type.name)
        }));
    }, [docTypeResponse]);

    // Auto-add document if pre-selected document type is provided
    useEffect(() => {
        if (isOpen && preSelectedDocumentTypeId && docTypes.length > 0 && docs.length === 0) {
            // Check if the pre-selected document type exists
            const selectedDocType = docTypes.find((d: { value: string; }) => d.value === preSelectedDocumentTypeId);

            if (selectedDocType) {
                const newDoc: Document = {
                    id: undefined,
                    document_type_id: preSelectedDocumentTypeId,
                    typeName: selectedDocType.name,
                    file_name: '',
                    status: 'pending',
                    notes: '',
                };
                setDocs([newDoc]);
            }
        }
    }, [isOpen, preSelectedDocumentTypeId, docTypes, docs.length]);

    // Reset docs when modal closes
    useEffect(() => {
        if (!isOpen) {
            setDocs([]);
        }
    }, [isOpen]);

    const addDocument = (typeId: string) => {
        const docType = docTypes.find((d: { value: string; }) => d.value === typeId);
        if (!docType) return;

        const newDoc: Document = {
            id: undefined,
            document_type_id: typeId,
            typeName: docType.name,
            file_name: '',
            status: 'pending',
            notes: '',
        };
        setDocs(prev => [...prev, newDoc]);
    };

    const updateDoc = (index: number, updates: Partial<Document>) => {
        setDocs(prev => prev.map((d, i) => i === index ? { ...d, ...updates } : d));
    };

    const handleDeleteClick = (index: number) => {
        const doc = docs[index];

        // If document has an ID (saved to database) and uploaded file, show modal
        if (doc.id && doc.file_url && doc.status === 'uploaded') {
            setDocumentToDelete(index);
            setIsDeleteModalOpen(true);
        } else {
            // No file uploaded yet or not saved to database, just remove from state
            setDocs(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleConfirmDelete = async () => {
        if (documentToDelete === null) return;

        const index = documentToDelete;
        const doc = docs[index];

        // If document has an ID, delete from database
        if (doc.id) {
            setDeletingIndex(index);

            try {
                await deleteDocumentMutation.mutateAsync(doc.id);
                toast.success('Document deleted successfully');

                // Remove from state
                setDocs(prev => prev.filter((_, i) => i !== index));
            } catch (error: any) {
                console.error('Delete document error:', error);
                toast.error(error?.response?.data?.message || 'Failed to delete document');
            } finally {
                setDeletingIndex(null);
                setIsDeleteModalOpen(false);
                setDocumentToDelete(null);
            }
        } else {
            // Just remove from state if no ID
            setDocs(prev => prev.filter((_, i) => i !== index));
            setIsDeleteModalOpen(false);
            setDocumentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDocumentToDelete(null);
    };

    const handleFileSelect = (index: number) => {
        const input = fileInputRefs.current[`doc-${index}`];
        if (input) {
            input.click();
        }
    };

    const handleFileChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const doc = docs[index];

        // Update status to uploading
        updateDoc(index, { status: 'uploading' });

        try {
            // Step 1: Upload file to storage
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await uploadFileMutation.mutateAsync(formData);

            const fileUrl = uploadResponse.url || uploadResponse.file_url || uploadResponse.data?.url;
            const filePath = uploadResponse.path || uploadResponse.file_path || uploadResponse.data?.path;

            // Step 2: Create document record in database
            const documentData = {
                document_type_id: doc.document_type_id,
                file_name: file.name,
                file_url: fileUrl,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                status: 'uploaded',
                notes: doc.notes || '',
                uploaded_at: new Date().toISOString(),
            };

            const createResponse = await createDocumentMutation.mutateAsync(documentData);

            // Step 3: Update local state with created document
            updateDoc(index, {
                id: createResponse.data?.id || createResponse.id,
                status: 'uploaded',
                file_name: file.name,
                file_url: fileUrl,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                uploaded_at: new Date().toISOString(),
            });

            toast.success('Document uploaded successfully');
        } catch (error: any) {
            console.error('Upload error:', error);
            updateDoc(index, { status: 'rejected' });

            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload document';
            toast.error(errorMessage);
        }

        // Clear the input value
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleClose = () => {
        // Check if there are any pending uploads
        const hasUploading = docs.some(d => d.status === 'uploading');
        if (hasUploading) {
            toast.error('Please wait for all uploads to complete');
            return;
        }

        // Clear docs and close
        setDocs([]);
        onClose();
    };

    const quickAccessDocs = docTypes.slice(0, 9);
    const remainingDocs = docTypes.slice(9);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {preSelectedDocumentTypeId && docs.length > 0
                                    ? `Uploading to ${docs[0]?.typeName}`
                                    : 'Add your tax documents to the system'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <ConfirmDeleteModal
                            isOpen={isDeleteModalOpen}
                            onClose={handleCancelDelete}
                            onConfirm={handleConfirmDelete}
                            title="Delete Document?"
                            description={`Are you sure you want to delete "${docs[documentToDelete ?? -1]?.file_name}"? This will permanently remove the document.`}
                            isLoading={deletingIndex !== null}
                        />

                        {preSelectedDocumentTypeId && docs.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Quick Upload:</strong> Ready to upload to {docs[0]?.typeName}. You can add more document types below.
                                </p>
                            </div>
                        )}

                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Tip:</strong> Upload all your tax documents here. This helps ensure accurate filing and faster processing.
                            </p>
                        </div>

                        {isLoadingDocTypes ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin mr-2" size={24} />
                                <span className="text-gray-600">Loading document types...</span>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h4 className="font-medium mb-3">
                                        {preSelectedDocumentTypeId && docs.length > 0
                                            ? 'Add More Document Types'
                                            : 'Select Document Type'}
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {quickAccessDocs.map((type: any) => (
                                            <button
                                                key={type.value}
                                                onClick={() => addDocument(type.value)}
                                                className="p-2 text-left border rounded-lg hover:bg-gray-50 transition text-sm"
                                            >
                                                <span className="mr-1">{type.icon}</span> {type.name}
                                            </button>
                                        ))}
                                    </div>
                                    {remainingDocs.length > 0 && (
                                        <div className="mt-3">
                                            <Select
                                                label=""
                                                name="otherDocType"
                                                value=""
                                                onChange={(e) => e.target.value && addDocument(e.target.value)}
                                                options={[
                                                    { value: '', label: 'Select more document types...' },
                                                    ...remainingDocs
                                                ]}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="space-y-3">
                            <h4 className="font-medium">Documents to Upload ({docs.length})</h4>
                            {docs.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg text-gray-500">
                                    <Upload className="mx-auto mb-2" size={32} />
                                    <p>No documents added yet</p>
                                    <p className="text-sm">Click a document type above to add</p>
                                </div>
                            )}
                            {docs.map((doc, index) => (
                                <div key={`${doc.document_type_id}-${index}`} className="p-3 border rounded-lg bg-gray-50">
                                    <input
                                        ref={el => { fileInputRefs.current[`doc-${index}`] = el; }}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(index, e)}
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                    />
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <File size={18} className="text-blue-600" />
                                            <span className="font-medium">{doc.typeName}</span>
                                            {doc.status === 'uploaded' && <Check size={16} className="text-green-600" />}
                                            {doc.status === 'rejected' && <span className="text-red-600 text-xs">Failed</span>}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteClick(index)}
                                            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={doc.status === 'uploading' || deletingIndex === index}
                                        >
                                            {deletingIndex === index ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {doc.status === 'pending' && (
                                            <button
                                                onClick={() => handleFileSelect(index)}
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            >
                                                Upload File
                                            </button>
                                        )}
                                        {doc.status === 'rejected' && (
                                            <button
                                                onClick={() => handleFileSelect(index)}
                                                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                                            >
                                                Retry Upload
                                            </button>
                                        )}
                                        {doc.status === 'uploading' && (
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Loader2 className="animate-spin" size={14} />
                                                Uploading...
                                            </span>
                                        )}
                                        {doc.status === 'uploaded' && (
                                            <span className="text-sm text-green-600 flex items-center gap-1">
                                                ✓ {doc.file_name}
                                                {doc.file_size && (
                                                    <span className="text-gray-500">
                                                        ({(doc.file_size / 1024).toFixed(1)} KB)
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Add notes..."
                                            value={doc.notes || ''}
                                            onChange={(e) => updateDoc(index, { notes: e.target.value })}
                                            className="flex-1 px-2 py-1 text-sm border rounded"
                                            disabled={doc.status === 'uploading'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                        <div className="text-sm text-gray-600">
                            {docs.filter(d => d.status === 'uploaded').length} of {docs.length} documents uploaded
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleClose}
                                disabled={docs.some(d => d.status === 'uploading')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadDocumentModal;