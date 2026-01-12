import React from 'react';
import { MapPin, Phone, Mail, Clock, Plus, Trash2 } from 'lucide-react';
import { ContactBlock } from '@/types/type';

const iconMap: Record<string, React.ComponentType<any>> = {
    MapPin: MapPin,
    Phone: Phone,
    Mail: Mail,
    Clock: Clock,
};

interface ContactBlockItemProps {
    block: ContactBlock;
    blockIndex: number;
    updateBlock: (index: number, field: keyof ContactBlock, value: string) => void;
    removeBlock: (index: number) => void;
    addDetail: (blockIndex: number) => void;
    removeDetail: (blockIndex: number, detailIndex: number) => void;
    updateDetail: (blockIndex: number, detailIndex: number, value: string) => void;
}

const ContactBlockItem: React.FC<ContactBlockItemProps> = ({
    block,
    blockIndex,
    updateBlock,
    removeBlock,
    addDetail,
    removeDetail,
    updateDetail,
}) => {
    const IconComponent = iconMap[block.icon] || MapPin;

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="text-blue-600" size={24} />
                </div>

                <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                            <select
                                value={block.icon}
                                onChange={(e) => updateBlock(blockIndex, 'icon', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="MapPin">Map Pin</option>
                                <option value="Phone">Phone</option>
                                <option value="Mail">Mail</option>
                                <option value="Clock">Clock</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={block.title}
                                onChange={(e) => updateBlock(blockIndex, 'title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Visit Us"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Details</label>
                            <button
                                onClick={() => addDetail(blockIndex)}
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Add Line
                            </button>
                        </div>
                        <div className="space-y-2">
                            {block.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => updateDetail(blockIndex, detailIndex, e.target.value)}
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter detail line"
                                    />
                                    {block.details.length > 1 && (
                                        <button
                                            onClick={() => removeDetail(blockIndex, detailIndex)}
                                            type="button"
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link (Optional)
                            <span className="text-gray-500 text-xs ml-2">e.g., tel:5551234567 or mailto:info@example.com</span>
                        </label>
                        <input
                            type="text"
                            value={block.link || ''}
                            onChange={(e) => updateBlock(blockIndex, 'link', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="tel: or mailto:"
                        />
                    </div>
                </div>

                <button
                    onClick={() => removeBlock(blockIndex)}
                    type="button"
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove this contact block"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default ContactBlockItem;