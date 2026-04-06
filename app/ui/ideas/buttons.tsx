export function Button({ title = "Submit" }: { title: string }) {
    return (
        <button className="inline-block 
        w-full
        md:w-auto
        rounded-sm
        bg-sky-600
        px-8
        md:px-12
        lg:px-16
        py-3
        text-xs
        md:text-sm
        lg:text-base
        font-medium 
        text-white 
        hover:bg-sky-700">
            {title}
        </button>
    );
}