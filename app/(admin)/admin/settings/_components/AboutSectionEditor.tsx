import React from 'react';
import { Save, Loader2, LucideIcon } from 'lucide-react';
import { AboutSection } from '@/types/type';

interface AboutSectionEditorProps {
    icon: LucideIcon;
    title: string;
    description: string;
    section: AboutSection;
    setSection: React.Dispatch<React.SetStateAction<AboutSection>>;
    handleSave: () => Promise<void>;
    isLoading: boolean;
    rows?: number;
}

const AboutSectionEditor: React.FC<AboutSectionEditorProps> = ({
    icon: Icon,
    title,
    description,
    section,
    setSection,
    handleSave,
    isLoading,
    rows = 6,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isLoading ? 'Saving...' : `Save ${title}`}
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={section.title}
                        onChange={(e) => setSection({ ...section, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={title}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        value={section.description}
                        onChange={(e) => setSection({ ...section, description: e.target.value })}
                        rows={rows}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter your ${title.toLowerCase()}...`}
                    />
                    {rows >= 8 && (
                        <p className="text-xs text-gray-500 mt-1">Use line breaks to separate paragraphs</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutSectionEditor;