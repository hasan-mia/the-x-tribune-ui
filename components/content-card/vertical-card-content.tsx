
export default function VerticalCardWithContent({ article }: any) {
    return (
        <article className="group cursor-pointer">
            <div className="relative overflow-hidden shadow-md">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-800 leading-tight group-hover:text-red-700 transition">
                {article.title}
            </h2>
            <p className="mt-3 text-lg ">
                {article.description}
            </p>
        </article>
    )
}
