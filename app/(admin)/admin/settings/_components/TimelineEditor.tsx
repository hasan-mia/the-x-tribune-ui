import React from 'react';
import { History, Save, Loader2, Plus } from 'lucide-react';
import TimelineItemEditor from './TimelineItemEditor';
import { TimelineItem } from '@/types/type';

interface TimelineEditorProps {
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
    handleSave: () => Promise<void>;
    isLoading: boolean;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
    timeline,
    setTimeline,
    handleSave,
    isLoading,
}) => {
    const addTimelineItem = (): void => {
        setTimeline([...timeline, { year: '', title: '', description: '' }]);
    };

    const removeTimelineItem = (index: number): void => {
        setTimeline(timeline.filter((_, i) => i !== index));
    };

    const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string): void => {
        const updated = [...timeline];
        updated[index] = { ...updated[index], [field]: value };
        setTimeline(updated);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <History className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Company Timeline</h2>
                        <p className="text-sm text-gray-600">Major milestones and achievements</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isLoading ? 'Saving...' : 'Save Timeline'}
                </button>
            </div>

            <div className="space-y-6">
                {timeline.map((item, index) => (
                    <TimelineItemEditor
                        key={index}
                        item={item}
                        index={index}
                        updateItem={updateTimelineItem}
                        removeItem={removeTimelineItem}
                    />
                ))}
            </div>

            <button
                onClick={addTimelineItem}
                type="button"
                className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} />
                Add Timeline Item
            </button>
        </div>
    );
};

export default TimelineEditor;