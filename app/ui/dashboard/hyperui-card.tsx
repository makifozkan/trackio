export default function Card({ keywords, title, description, status, updatedAt }: { keywords?: string[], title: string, description?: string, status?: string, updatedAt?: Date }) {
    return (
        <article className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <time dateTime="2022-10-10" className="block text-xs text-gray-500"> {updatedAt?.toLocaleDateString()} </time>

            <a href="#">
                <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                    {title}
                </h3>
                <p>
                    {description}
                </p>
            </a>

            <div className="mt-4 flex flex-wrap gap-1">
                {keywords?.map((keyword) => (<span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600">
                    {keyword}
                </span>
                ))}

            </div>
        </article>
    );
}