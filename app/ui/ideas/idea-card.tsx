import { CalendarIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface IdeaCardProps {
    title: string;
    description: string;
    tags: string[];
    status: 'High Potential' | 'Active Test' | 'Paused' | 'High Alpha' | string;
    updatedAt: string;
    imageUrl?: string;
}

export function IdeaCard({ title, description, tags, status, updatedAt, imageUrl }: IdeaCardProps) {
    const statusColors = {
        'High Potential': 'bg-green-100 text-green-700',
        'Active Test': 'bg-blue-100 text-blue-700',
        'Paused': 'bg-gray-100 text-gray-700',
        'High Alpha': 'bg-indigo-100 text-indigo-700',
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white transition-all hover:shadow-lg border border-transparent hover:border-gray-100">
            {imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                    <span className={clsx(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                    )}>
                        {status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4 flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {description}
                    </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 border border-gray-100"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>Updated {updatedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
