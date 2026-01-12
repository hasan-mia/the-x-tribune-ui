"use client";

import React, { useState, useEffect } from 'react';
import { Sliders, Loader2 } from 'lucide-react';
import useSettings from './_hooks/useSettings';
import LogoUpdate from '@/app/(admin)/admin/settings/_components/LogoUpdate';
import TabNavigation from './_components/TabNavigation';
import ContactMapTab from './_components/ContactMapTab';
import AboutPageTab from './_components/AboutPageTab';
import { ContactBlock, TimelineItem, AboutSection } from '@/types/type';

const SettingsAdmin: React.FC = () => {
    const { listData, listLoading, updateSetting, isLoading } = useSettings('settings');

    // Contact states
    const [contactInfo, setContactInfo] = useState<ContactBlock[]>([]);
    const [mapUrl, setMapUrl] = useState<string>('');
    const [mapDescription, setMapDescription] = useState<string>('');

    // About states
    const [aboutUs, setAboutUs] = useState<AboutSection>({ title: '', description: '' });
    const [ourStory, setOurStory] = useState<AboutSection>({ title: '', description: '' });
    const [ourMission, setOurMission] = useState<AboutSection>({ title: '', description: '' });
    const [ourVision, setOurVision] = useState<AboutSection>({ title: '', description: '' });
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);

    const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState<'contact' | 'about'>('contact');

    useEffect(() => {
        if (listData?.data) {
            const contactSetting = listData.data.find((s: any) => s.key === 'contact_info');
            const mapSetting = listData.data.find((s: any) => s.key === 'map');
            const aboutSetting = listData.data.find((s: any) => s.key === 'about_us');
            const storySetting = listData.data.find((s: any) => s.key === 'our_story');
            const missionSetting = listData.data.find((s: any) => s.key === 'our_mission');
            const visionSetting = listData.data.find((s: any) => s.key === 'our_vision');
            const timelineSetting = listData.data.find((s: any) => s.key === 'timeline');

            if (contactSetting) setContactInfo(contactSetting.value || []);
            if (mapSetting) {
                setMapUrl(mapSetting.value || '');
                setMapDescription(mapSetting.description || '');
            }
            if (aboutSetting) setAboutUs(aboutSetting.value || { title: '', description: '' });
            if (storySetting) setOurStory(storySetting.value || { title: '', description: '' });
            if (missionSetting) setOurMission(missionSetting.value || { title: '', description: '' });
            if (visionSetting) setOurVision(visionSetting.value || { title: '', description: '' });
            if (timelineSetting) setTimeline(timelineSetting.value || []);
        }
    }, [listData]);

    const showMessage = (type: string, text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSaveContactInfo = async (): Promise<void> => {
        const response = await updateSetting('contact_info', {
            key: 'contact_info',
            value: contactInfo,
            description: 'Contact information displayed on the website'
        });
        if (response?.success) showMessage('success', 'Contact info updated successfully!');
    };

    const handleSaveMap = async (): Promise<void> => {
        const response = await updateSetting('map', {
            key: 'map',
            value: mapUrl,
            description: mapDescription
        });
        if (response?.success) showMessage('success', 'Map URL updated successfully!');
    };

    const handleSaveAbout = async (): Promise<void> => {
        const response = await updateSetting('about_us', {
            key: 'about_us',
            value: aboutUs,
            description: 'Our company about us section'
        });
        if (response?.success) showMessage('success', 'About Us updated successfully!');
    };

    const handleSaveStory = async (): Promise<void> => {
        const response = await updateSetting('our_story', {
            key: 'our_story',
            value: ourStory,
            description: 'Our company story and history'
        });
        if (response?.success) showMessage('success', 'Story updated successfully!');
    };

    const handleSaveMission = async (): Promise<void> => {
        const response = await updateSetting('our_mission', {
            key: 'our_mission',
            value: ourMission,
            description: 'Our company mission statement'
        });
        if (response?.success) showMessage('success', 'Mission updated successfully!');
    };

    const handleSaveVision = async (): Promise<void> => {
        const response = await updateSetting('our_vision', {
            key: 'our_vision',
            value: ourVision,
            description: 'Our company vision and core values'
        });
        if (response?.success) showMessage('success', 'Vision updated successfully!');
    };

    const handleSaveTimeline = async (): Promise<void> => {
        const response = await updateSetting('timeline', {
            key: 'timeline',
            value: timeline,
            description: 'Company timeline and milestones'
        });
        if (response?.success) showMessage('success', 'Timeline updated successfully!');
    };

    if (listLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Sliders className="text-blue-600" size={28} />
                        <h1 className="text-2xl font-bold text-gray-900">Settings Management</h1>
                    </div>
                    <p className="text-gray-600">Manage website settings and configuration</p>

                    {message.text && (
                        <div className={`mt-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div>
                    <LogoUpdate />
                </div>

                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === 'contact' && (
                    <ContactMapTab
                        contactInfo={contactInfo}
                        setContactInfo={setContactInfo}
                        mapUrl={mapUrl}
                        setMapUrl={setMapUrl}
                        mapDescription={mapDescription}
                        setMapDescription={setMapDescription}
                        handleSaveContactInfo={handleSaveContactInfo}
                        handleSaveMap={handleSaveMap}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'about' && (
                    <AboutPageTab
                        aboutUs={aboutUs}
                        setAboutUs={setAboutUs}
                        ourStory={ourStory}
                        setOurStory={setOurStory}
                        ourMission={ourMission}
                        setOurMission={setOurMission}
                        ourVision={ourVision}
                        setOurVision={setOurVision}
                        timeline={timeline}
                        setTimeline={setTimeline}
                        handleSaveAbout={handleSaveAbout}
                        handleSaveStory={handleSaveStory}
                        handleSaveMission={handleSaveMission}
                        handleSaveVision={handleSaveVision}
                        handleSaveTimeline={handleSaveTimeline}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default SettingsAdmin;