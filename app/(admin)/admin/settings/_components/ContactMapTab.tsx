import React from 'react';
import MapSettings from './MapSettings';
import ContactInfoSettings from './ContactInfoSettings';
import { ContactBlock } from '@/types/type';

interface ContactMapTabProps {
    contactInfo: ContactBlock[];
    setContactInfo: React.Dispatch<React.SetStateAction<ContactBlock[]>>;
    mapUrl: string;
    setMapUrl: React.Dispatch<React.SetStateAction<string>>;
    mapDescription: string;
    setMapDescription: React.Dispatch<React.SetStateAction<string>>;
    handleSaveContactInfo: () => Promise<void>;
    handleSaveMap: () => Promise<void>;
    isLoading: boolean;
}

const ContactMapTab: React.FC<ContactMapTabProps> = ({
    contactInfo,
    setContactInfo,
    mapUrl,
    setMapUrl,
    mapDescription,
    setMapDescription,
    handleSaveContactInfo,
    handleSaveMap,
    isLoading,
}) => {
    return (
        <>
            <MapSettings
                mapUrl={mapUrl}
                setMapUrl={setMapUrl}
                mapDescription={mapDescription}
                setMapDescription={setMapDescription}
                handleSave={handleSaveMap}
                isLoading={isLoading}
            />
            <ContactInfoSettings
                contactInfo={contactInfo}
                setContactInfo={setContactInfo}
                handleSave={handleSaveContactInfo}
                isLoading={isLoading}
            />
        </>
    );
};

export default ContactMapTab;