import React from 'react';
import { Trash2 } from 'lucide-react';
import { TimelineItem } from '@/types/type';

interface TimelineItemEditorProps {
    item: TimelineItem;
    index: number;
    updateItem: (index: number, field: keyof TimelineItem, value: string) => void;
    removeItem: (index: number) => void;
}

const TimelineItemEditor: React.FC<TimelineItemEditorProps> = ({
    item,
    index,
    updateItem,
    removeItem,
}) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
                <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                            <input
                                type="text"
                                value={item.year}
                                onChange={(e) => updateItem(index, 'year', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 2020"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Company Founded"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe this milestone..."
                        />
                    </div>
                </div>
                <button
                    onClick={() => removeItem(index)}
                    type="button"
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove this timeline item"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default TimelineItemEditor;