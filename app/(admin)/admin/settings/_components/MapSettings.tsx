import React from 'react';
import { Map, Save, Loader2 } from 'lucide-react';

interface MapSettingsProps {
    mapUrl: string;
    setMapUrl: React.Dispatch<React.SetStateAction<string>>;
    mapDescription: string;
    setMapDescription: React.Dispatch<React.SetStateAction<string>>;
    handleSave: () => Promise<void>;
    isLoading: boolean;
}

const MapSettings: React.FC<MapSettingsProps> = ({
    mapUrl,
    setMapUrl,
    mapDescription,
    setMapDescription,
    handleSave,
    isLoading,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Map className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Google Maps Embed</h2>
                        <p className="text-sm text-gray-600">Configure the map displayed on your website</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isLoading ? 'Saving...' : 'Save Map'}
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Maps Embed URL
                    </label>
                    <input
                        type="text"
                        value={mapUrl}
                        onChange={(e) => setMapUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Get this from Google Maps → Share → Embed a map
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <input
                        type="text"
                        value={mapDescription}
                        onChange={(e) => setMapDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Map description"
                    />
                </div>

                {mapUrl && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                        </label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <iframe
                                src={mapUrl}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps Preview"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapSettings;