import React from 'react';
import AboutSectionEditor from './AboutSectionEditor';
import TimelineEditor from './TimelineEditor';
import { AboutSection, TimelineItem } from '@/types/type';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

interface AboutPageTabProps {
    aboutUs: AboutSection;
    setAboutUs: React.Dispatch<React.SetStateAction<AboutSection>>;
    ourStory: AboutSection;
    setOurStory: React.Dispatch<React.SetStateAction<AboutSection>>;
    ourMission: AboutSection;
    setOurMission: React.Dispatch<React.SetStateAction<AboutSection>>;
    ourVision: AboutSection;
    setOurVision: React.Dispatch<React.SetStateAction<AboutSection>>;
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
    handleSaveAbout: () => Promise<void>;
    handleSaveStory: () => Promise<void>;
    handleSaveMission: () => Promise<void>;
    handleSaveVision: () => Promise<void>;
    handleSaveTimeline: () => Promise<void>;
    isLoading: boolean;
}

const AboutPageTab: React.FC<AboutPageTabProps> = ({
    aboutUs,
    setAboutUs,
    ourStory,
    setOurStory,
    ourMission,
    setOurMission,
    ourVision,
    setOurVision,
    timeline,
    setTimeline,
    handleSaveAbout,
    handleSaveStory,
    handleSaveMission,
    handleSaveVision,
    handleSaveTimeline,
    isLoading,
}) => {
    return (
        <>
            <AboutSectionEditor
                icon={BookOpen}
                title="About Us"
                description="Companies about"
                section={aboutUs}
                setSection={setAboutUs}
                handleSave={handleSaveAbout}
                isLoading={isLoading}
                rows={8}
            />
            <AboutSectionEditor
                icon={BookOpen}
                title="Our Story"
                description="Company history and background"
                section={ourStory}
                setSection={setOurStory}
                handleSave={handleSaveStory}
                isLoading={isLoading}
                rows={8}
            />

            <AboutSectionEditor
                icon={Target}
                title="Our Mission"
                description="Company mission statement"
                section={ourMission}
                setSection={setOurMission}
                handleSave={handleSaveMission}
                isLoading={isLoading}
                rows={6}
            />

            <AboutSectionEditor
                icon={TrendingUp}
                title="Our Vision"
                description="Company vision and values"
                section={ourVision}
                setSection={setOurVision}
                handleSave={handleSaveVision}
                isLoading={isLoading}
                rows={6}
            />

            <TimelineEditor
                timeline={timeline}
                setTimeline={setTimeline}
                handleSave={handleSaveTimeline}
                isLoading={isLoading}
            />
        </>
    );
};

export default AboutPageTab;