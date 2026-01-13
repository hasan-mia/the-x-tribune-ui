import React from 'react'

export default function VerticalCard({ article }: any) {
    return (
        <article key={article.id} className="group cursor-pointer">
            <div className="relative overflow-hidden shadow-md">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <h2 className="mt-3 text-base font-bold text-gray-800 leading-tight group-hover:text-red-700 transition">
                {article.title}
            </h2>
        </article>
    )
}
