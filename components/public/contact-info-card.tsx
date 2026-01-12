import React from 'react'
import { useGetSettings } from '@/api/settings'
import { MapPin, Phone, Mail, Clock, LucideIcon } from 'lucide-react'
import ContactInfoSkeleton from '../shared/skelton/contact-info-skelton'

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
    MapPin,
    Phone,
    Mail,
    Clock,
}


export default function ContactInfoCard() {
    const { data, isLoading, isError } = useGetSettings('contact_info')

    if (isLoading) {
        return (
            <section className="py-16 px-4 -mt-8">
                <div className="max-w-7xl mx-auto">
                    <ContactInfoSkeleton />
                </div>
            </section>
        )
    }

    if (isError || !data?.data?.value) {
        return null
    }

    const contactInfo = data.data.value

    return (
        <section className="py-16 px-4 -mt-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo?.map((info: any) => {
                        const Icon = iconMap[info.icon] || MapPin
                        return (
                            <div key={info.title} className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    {info.details.map((detail: string, idx: number) => (
                                        info.link && idx === 0 ? (
                                            <a key={idx} href={info.link} className="block hover:text-primary transition-colors">
                                                {detail}
                                            </a>
                                        ) : (
                                            <p key={idx}>{detail}</p>
                                        )
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}