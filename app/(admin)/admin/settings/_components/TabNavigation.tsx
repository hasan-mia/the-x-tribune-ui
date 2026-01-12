import React from 'react';

interface TabNavigationProps {
    activeTab: 'contact' | 'about';
    setActiveTab: (tab: 'contact' | 'about') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'contact'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Contact & Map
                </button>
                <button
                    onClick={() => setActiveTab('about')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'about'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    About Page
                </button>
            </div>
        </div>
    );
};

export default TabNavigation;