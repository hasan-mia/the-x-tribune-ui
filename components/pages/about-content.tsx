/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { Users } from 'lucide-react'
import MissionVision from '../public/mission-vision'
import AboutCta from '../public/about-cta'
import { useAllSettings } from '@/api/settings'
import AboutPageSkeleton from '../shared/skelton/about-page-skelton';
import PageHero from '../shared/page-hero';

export default function AboutContent() {
    const { data: settingsData, isLoading } = useAllSettings();

    // Extract settings from the API response
    const getSettingByKey = (key: string) => {
        return settingsData?.data?.find((setting: any) => setting.key === key);
    };

    const ourMission = getSettingByKey('our_mission');
    const ourVision = getSettingByKey('our_vision');

    if (isLoading) {
        return <AboutPageSkeleton />;
    }

    return (
        <div className="min-h-screen">
            <PageHero
                icon={Users}
                badge="About Us"
                title="Who We Are"
                description="A leading CPA firm dedicated to delivering exceptional accounting, tax, and advisory services to businesses and individuals for over three decades."
            />

            {/* Stats Section */}
            {/* <AboutStats stats={stats} /> */}

            {/* Story Section */}
            {/* <StorySection story={ourStory?.value} /> */}

            {/* Mission & Vision */}
            <MissionVision
                mission={ourMission?.value}
                vision={ourVision?.value}
            />

            {/* Values */}
            {/* <ValueSection values={values} /> */}

            {/* Timeline */}
            {/* <TimelineSection timeline={timeline?.value || []} /> */}

            {/* Team Section */}
            {/* <TeamMember /> */}

            {/* Certifications */}
            {/* <Certification certifications={certifications} /> */}

            {/* CTA */}
            <AboutCta />
        </div>
    )
}