import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function ProcessSection({ title = "Our Process", description = "A proven methodology for delivering exceptional results", process }: any) {

    return (
        <section className="py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
                    <p className="text-xl text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {process.map((item: { step: boolean | Key | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: number) => (
                        <div key={index} className="relative">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                            {index < process.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}