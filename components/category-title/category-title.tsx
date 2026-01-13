import Link from 'next/link'

interface CategoryTitleProps {
    title: string;
    href?: string;
}

export default function CategoryTitle({ title, href = "#" }: CategoryTitleProps) {
    return (
        <div className="cat-title pb-4">
            <h1>
                <Link
                    href={href}
                    className="text-2xl font-bold text-gray-800 hover:text-red-500 transition-colors duration-200 no-underline"
                >
                    {title}
                </Link>
            </h1>
        </div>
    );
}