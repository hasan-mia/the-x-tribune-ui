import React from 'react';
import { Save, Loader2, Plus } from 'lucide-react';
import ContactBlockItem from './ContactBlockItem';
import { ContactBlock } from '@/types/type';

interface ContactInfoSettingsProps {
    contactInfo: ContactBlock[];
    setContactInfo: React.Dispatch<React.SetStateAction<ContactBlock[]>>;
    handleSave: () => Promise<void>;
    isLoading: boolean;
}

const ContactInfoSettings: React.FC<ContactInfoSettingsProps> = ({
    contactInfo,
    setContactInfo,
    handleSave,
    isLoading,
}) => {
    const addContactBlock = (): void => {
        setContactInfo([
            ...contactInfo,
            {
                icon: 'MapPin',
                title: '',
                details: [''],
                link: '',
            },
        ]);
    };

    const removeContactBlock = (index: number): void => {
        setContactInfo(contactInfo.filter((_, i) => i !== index));
    };

    const updateBlock = (index: number, field: keyof ContactBlock, value: string): void => {
        const updated = [...contactInfo];
        updated[index] = { ...updated[index], [field]: value };
        setContactInfo(updated);
    };

    const addDetail = (blockIndex: number): void => {
        const updated = [...contactInfo];
        updated[blockIndex].details.push('');
        setContactInfo(updated);
    };

    const removeDetail = (blockIndex: number, detailIndex: number): void => {
        const updated = [...contactInfo];
        updated[blockIndex].details = updated[blockIndex].details.filter((_, i) => i !== detailIndex);
        setContactInfo(updated);
    };

    const updateDetail = (blockIndex: number, detailIndex: number, value: string): void => {
        const updated = [...contactInfo];
        updated[blockIndex].details[detailIndex] = value;
        setContactInfo(updated);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                    <p className="text-sm text-gray-600">Manage contact details displayed on your website</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isLoading ? 'Saving...' : 'Save Contact Info'}
                </button>
            </div>

            <div className="space-y-6">
                {contactInfo.map((block, blockIndex) => (
                    <ContactBlockItem
                        key={blockIndex}
                        block={block}
                        blockIndex={blockIndex}
                        updateBlock={updateBlock}
                        removeBlock={removeContactBlock}
                        addDetail={addDetail}
                        removeDetail={removeDetail}
                        updateDetail={updateDetail}
                    />
                ))}
            </div>

            <button
                onClick={addContactBlock}
                type="button"
                className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} />
                Add New Contact Block
            </button>
        </div>
    );
};

export default ContactInfoSettings;