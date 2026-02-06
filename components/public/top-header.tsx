/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react'
import { Mail, Phone, Clock } from 'lucide-react'
import TopHeaderSkelton from '../shared/skelton/top-header-skelton';

export default function TopHeader({ data, isLoading, isError }: any) {
    // Extract contact info from settings
    const contactInfo = data?.data?.find((setting: any) => setting.key === 'contact_info')?.value || [];

    // Find specific contact items
    const phoneInfo = contactInfo.find((item: any) => item.icon === 'Phone');
    const emailInfo = contactInfo.find((item: any) => item.icon === 'Mail');
    const hoursInfo = contactInfo.find((item: any) => item.icon === 'Clock');

    if (isLoading) {
        return (
            <TopHeaderSkelton />
        );
    }

    if (isError) {
        return null;
    }

    return (
        <div className='container mx-auto'>
            <div className="container bg-gradient-to-r from-primary via-primary to-blue-700 text-primary-foreground py-2.5 px-4 hidden lg:block">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                        {/* Phone */}
                        {phoneInfo && phoneInfo.details?.[0] && (
                            <a
                                href={phoneInfo.link || `tel:${phoneInfo.details[0].replace(/\D/g, '')}`}
                                className="flex items-center gap-2 hover:opacity-90 transition-all hover:translate-x-0.5"
                            >
                                <Phone className="h-4 w-4" />
                                <span className="font-medium">{phoneInfo.details[0]}</span>
                            </a>
                        )}

                        {/* Email */}
                        {emailInfo && emailInfo.details?.[0] && (
                            <a
                                href={emailInfo.link || `mailto:${emailInfo.details[0]}`}
                                className="flex items-center gap-2 hover:opacity-90 transition-all hover:translate-x-0.5"
                            >
                                <Mail className="h-4 w-4" />
                                <span className="font-medium">{emailInfo.details[0]}</span>
                            </a>
                        )}
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-center gap-2">
                        {hoursInfo && hoursInfo.details?.[0] && (
                            <>
                                <Clock className="h-4 w-4 opacity-90" />
                                <span className="opacity-90">{hoursInfo.details[0]}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}