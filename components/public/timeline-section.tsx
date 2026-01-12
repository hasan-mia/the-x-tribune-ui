import React from 'react'

// Default timeline data as fallback
const defaultTimeline = [
    {
        year: "1995",
        title: "Founded",
        description: "Founded the CPA firm with a focus on small business accounting."
    },
    {
        year: "2000",
        title: "First 10 Employees",
        description: "Expanded the team to 10 employees to accommodate growing client base."
    },
    {
        year: "2005",
        title: "New Office",
        description: "Opened a new office location to better serve our regional clients."
    },
    {
        year: "2010",
        title: "Technology Integration",
        description: "Implemented advanced accounting software to improve service efficiency."
    },
    {
        year: "2015",
        title: "50 Employees",
        description: "Reached a milestone of 50 employees, including CPAs and support staff."
    },
    {
        year: "2020",
        title: "Virtual Services Launch",
        description: "Launched virtual accounting services in response to the COVID-19 pandemic."
    },
    {
        year: "2023",
        title: "Industry Recognition",
        description: "Received industry awards for excellence in client service and innovation."
    }
];

export default function TimelineSection({ timeline }: { timeline?: { year: string; title: string; description: string }[] }) {
    // Use provided timeline or fallback to default
    const timelineData = timeline && timeline.length > 0 ? timeline : defaultTimeline;

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
                    <p className="text-xl text-muted-foreground">
                        Three decades of growth and innovation
                    </p>
                </div>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

                    <div className="space-y-12">
                        {timelineData.map((item, index) => (
                            <div key={item.year} className={`relative grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                {index % 2 === 0 ? (
                                    <>
                                        <div className="md:text-right space-y-2">
                                            <h3 className="text-3xl font-bold text-primary">{item.year}</h3>
                                            <h4 className="text-xl font-semibold">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center">
                                            <div className="h-4 w-4 rounded-full bg-primary border-4 border-background" />
                                        </div>
                                        <div />
                                    </>
                                ) : (
                                    <>
                                        <div />
                                        <div className="hidden md:flex items-center justify-center">
                                            <div className="h-4 w-4 rounded-full bg-primary border-4 border-background" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-bold text-primary">{item.year}</h3>
                                            <h4 className="text-xl font-semibold">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}