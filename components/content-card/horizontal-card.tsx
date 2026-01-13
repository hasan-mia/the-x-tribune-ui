import React from 'react'

export default function HorizontalCard({ article }: any) {
    return (
        <article
            className="flex gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
        >
            <div className="flex-shrink-0">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-24 h-16 object-cover"
                />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight hover:text-red-700 transition">
                    {article.title}
                </h3>
            </div>
        </article>
    )
}
