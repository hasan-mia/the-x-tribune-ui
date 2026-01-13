
export default function OnOverCardWithContent({ article }: any) {
    return (
        <article key={article.id} className="cursor-pointer">
            <div className="group">
                <div className="relative overflow-hidden shadow-md">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <h2 className="absolute bottom-0 left-0 right-0 p-4 text-base font-bold text-white leading-tight group-hover:text-red-400 transition">
                        {article.title}
                    </h2>

                </div>
            </div>
            <p className="mt-3 text-lg ">
                {article.description}
            </p>
        </article>
    )
}
